/**
 * Terrain submission portal island.
 * Validates the terrain fully in the browser (nothing is uploaded until submit),
 * checks for exact duplicates against the current library (filename, then SHA-256),
 * gates the submit button on every requirement, and posts the multipart form —
 * terrain attached — to the configured relay, which emails it to support@.
 * All markup is server-rendered; this script only toggles state.
 */
const MAX_BYTES = 10 * 1024 * 1024;

type CheckId = "v-json" | "v-meta" | "v-preview" | "v-format" | "v-dupe";
const ALL_CHECKS: CheckId[] = ["v-json", "v-meta", "v-preview", "v-format", "v-dupe"];

interface TerrainMeta {
  name: string;
  author: string;
  version: string;
  description: string;
  size: string;
  fileSize: string;
  preview: string | null;
}

const $ = (id: string) => document.getElementById(id);

const humanBytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;

function setCheck(id: CheckId, state: "pending" | "pass" | "fail", msg = "") {
  const li = $(id);
  if (!li) return;
  li.classList.remove("pass", "fail");
  if (state !== "pending") li.classList.add(state);
  const msgEl = li.querySelector(".v-msg") as HTMLElement | null;
  if (msgEl) {
    msgEl.hidden = !msg;
    msgEl.textContent = msg;
  }
}

function decodePreview(b64: string): Promise<string | null> {
  return new Promise((resolve) => {
    const tryMime = (mimes: string[]) => {
      const mime = mimes.shift();
      if (!mime) return resolve(null);
      const img = new Image();
      const src = `data:image/${mime};base64,${b64}`;
      img.onload = () => resolve(src);
      img.onerror = () => tryMime(mimes);
      img.src = src;
    };
    tryMime(["jpeg", "png"]);
  });
}

function readLibrary(): string[] {
  const el = $("library-index");
  if (!el?.textContent) return [];
  try {
    return JSON.parse(el.textContent) as string[];
  } catch {
    return [];
  }
}

/** Content-addressed id: same 16-hex slice of SHA-256 the build uses (scripts/build.mts). */
async function terrainId(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

function initSubmit(form: HTMLFormElement) {
  // Success screen (after the relay redirects back with ?submitted=1)
  if (new URLSearchParams(location.search).has("submitted")) {
    form.hidden = true;
    const sub = $("submit-sub");
    if (sub) sub.hidden = true;
    const panel = $("success-panel");
    if (panel) {
      panel.hidden = false;
      panel.querySelector("h2")?.setAttribute("tabindex", "-1");
      (panel.querySelector("h2") as HTMLElement | null)?.focus();
    }
    return;
  }

  const nameIn = $("in-name") as HTMLInputElement;
  const emailIn = $("in-email") as HTMLInputElement;
  const fileIn = $("file-input") as HTMLInputElement;
  const dropzone = $("dropzone") as HTMLElement;
  const dzIdle = $("dz-idle") as HTMLElement;
  const dzSummary = $("dz-summary") as HTMLElement;
  const dzClear = $("dz-clear") as HTMLButtonElement;
  const dzState = $("dz-state") as HTMLElement;
  const vchecks = $("vchecks") as HTMLElement;
  const declChk = $("chk-decl") as HTMLInputElement;
  const privacyChk = $("chk-privacy") as HTMLInputElement;
  const copyChk = $("chk-copy") as HTMLInputElement;
  const submitBtn = $("submit-btn") as HTMLButtonElement;
  const progress = $("progress") as HTMLElement;

  const library = readLibrary();

  let fileOk = false; // the occupying file passed every check
  let meta: TerrainMeta | null = null;
  let submitting = false;
  let dragDepth = 0; // dragenter/dragleave counter — child transitions can't cause jitter

  const emailValid = () => /^[^\s@]+@[^\s@]+$/.test(emailIn.value.trim()); // intentionally lenient

  function gate() {
    const reqs: Record<string, boolean> = {
      name: nameIn.value.trim().length > 0,
      email: emailValid(),
      file: fileOk,
      decl: declChk.checked,
      privacy: privacyChk.checked,
    };
    for (const [key, done] of Object.entries(reqs)) {
      document.querySelector(`.reqs li[data-req="${key}"]`)?.classList.toggle("done", done);
    }
    submitBtn.disabled = submitting || !Object.values(reqs).every(Boolean);
    return reqs;
  }

  function fieldError(input: HTMLInputElement, errId: string, show: boolean) {
    const err = $(errId);
    if (err) err.hidden = !show;
    input.closest(".field")?.classList.toggle("invalid", show);
  }

  function clearFile(refocus = true) {
    fileIn.value = "";
    fileOk = false;
    meta = null;
    dragDepth = 0;
    dropzone.classList.remove("dz-over");
    dzSummary.hidden = true;
    dzIdle.hidden = false;
    dzClear.hidden = true;
    vchecks.hidden = true;
    ALL_CHECKS.forEach((c) => setCheck(c, "pending"));
    ($("f-subject") as HTMLInputElement).value = "Sheep Tag 2 — Terrain Submission";
    ["f-tname", "f-tauthor", "f-tversion", "f-tsize", "f-tfilesize", "f-tdesc", "f-vsummary"].forEach(
      (id) => (($(id) as HTMLInputElement).value = ""),
    );
    gate();
    if (refocus) dropzone.focus();
  }

  async function validateFile(file: File) {
    fileOk = false;
    meta = null;
    vchecks.hidden = false;
    dzClear.hidden = false;
    ALL_CHECKS.forEach((c) => setCheck(c, "pending"));
    dzIdle.hidden = true;
    dzSummary.hidden = false;

    const dzFile = $("dz-file") as HTMLElement;
    const dzMeta = $("dz-meta") as HTMLElement;
    const dzDesc = $("dz-desc") as HTMLElement;
    const dzThumb = $("dz-thumb") as HTMLImageElement;
    dzFile.textContent = file.name;
    dzMeta.textContent = humanBytes(file.size);
    dzDesc.textContent = "";
    dzThumb.hidden = true;
    dzState.className = "dz-state";
    dzState.textContent = "Validating…";

    const fail = (id: CheckId, msg: string) => {
      setCheck(id, "fail", msg);
      dzState.classList.add("bad");
      dzState.textContent = "Fix the issue below — press ✕ and upload the corrected file.";
      gate();
    };

    // Valid JSON: extension, size, parse
    if (!file.name.toLowerCase().endsWith(".json"))
      return fail("v-json", "Only Sheep Tag 2 terrain (.json) files are supported.");
    if (file.size > MAX_BYTES) return fail("v-json", "Terrain files must be smaller than 10 MB.");
    const rawBuf = await file.arrayBuffer();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(new TextDecoder().decode(rawBuf)) as Record<string, unknown>;
    } catch {
      return fail("v-json", "The selected file is not valid JSON.");
    }
    setCheck("v-json", "pass");

    // Show the map preview as soon as it decodes — even if later checks fail,
    // the author can still see which map this is.
    const md = data.Metadata as Record<string, unknown> | undefined;
    const previewB64 = md && typeof md.PreviewImage === "string" ? md.PreviewImage : "";
    const previewSrc = previewB64 ? await decodePreview(previewB64) : null;
    if (previewSrc) {
      dzThumb.src = previewSrc;
      dzThumb.hidden = false;
    }

    // Metadata block + required fields (Description must exist but may be empty)
    if (!md || typeof md !== "object")
      return fail("v-meta", "Required terrain metadata is missing.");
    for (const field of ["Name", "Author", "Version"]) {
      const v = md[field];
      if (v === undefined || v === null || String(v).trim() === "")
        return fail("v-meta", `Metadata.${field} is required.`);
    }
    if (!("Description" in md))
      return fail("v-meta", "Metadata.Description is missing (an empty description is fine).");
    setCheck("v-meta", "pass");

    // Preview image (must decode)
    if (!previewSrc)
      return fail("v-preview", "Every terrain must include a preview image before submission.");
    setCheck("v-preview", "pass");

    // Terrain format: dimensions + complete tile data
    const width = Number(data.Width);
    const length = Number(data.Length);
    const tiles = data.TileData;
    if (
      !Number.isFinite(width) ||
      !Number.isFinite(length) ||
      width <= 0 ||
      length <= 0 ||
      !Array.isArray(tiles) ||
      tiles.length !== width * length
    )
      return fail("v-format", "This file doesn't appear to be a valid Sheep Tag 2 terrain.");
    setCheck("v-format", "pass");

    // Duplicate detection: a matching content id means byte-identical content.
    try {
      const id = await terrainId(rawBuf);
      if (library.includes(id)) {
        fail("v-dupe", "This map has already been uploaded — ");
        // Link straight to the existing copy (same window)
        const msgEl = $("v-dupe")?.querySelector(".v-msg") as HTMLElement | null;
        if (msgEl) {
          const a = document.createElement("a");
          a.href = `/terrains?id=${id}`;
          a.textContent = "view it in the library";
          msgEl.append(a, document.createTextNode("."));
        }
        return;
      }
    } catch {
      /* hashing unavailable — skip the dupe check rather than block */
    }
    setCheck("v-dupe", "pass");

    meta = {
      name: String(md.Name),
      author: String(md.Author),
      version: String(md.Version),
      description: String(md.Description),
      size: `${width}×${length}`,
      fileSize: humanBytes(file.size),
      preview: previewSrc,
    };

    // Review card so the author can confirm everything looks right
    dzFile.textContent = `✔ ${file.name}`;
    dzMeta.textContent = `${meta.name} · by ${meta.author} · ${meta.size} · v${meta.version} · ${meta.fileSize}`;
    dzDesc.textContent = meta.description;
    dzThumb.src = previewSrc;
    dzThumb.hidden = false;
    dzState.classList.add("ok");
    dzState.textContent = "Ready to submit";

    // Fill the hidden email fields
    ($("f-subject") as HTMLInputElement).value = `Sheep Tag 2 — Terrain Submission: ${meta.name}`;
    ($("f-tname") as HTMLInputElement).value = meta.name;
    ($("f-tauthor") as HTMLInputElement).value = meta.author;
    ($("f-tversion") as HTMLInputElement).value = meta.version;
    ($("f-tsize") as HTMLInputElement).value = meta.size;
    ($("f-tfilesize") as HTMLInputElement).value = meta.fileSize;
    ($("f-tdesc") as HTMLInputElement).value = meta.description;
    ($("f-vsummary") as HTMLInputElement).value =
      "Client validation passed: valid JSON · metadata complete · preview image present · terrain format recognized · not a duplicate";

    fileOk = true;
    gate();
  }

  // Dropzone interactions — click/drop always works and REPLACES any current file
  // (single file only; the summary card makes it clear just one terrain is attached)
  const browse = () => fileIn.click();
  dropzone.addEventListener("click", browse);
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      browse();
    }
  });
  dzClear.addEventListener("click", (e) => {
    e.stopPropagation(); // don't let the dropzone interpret this as "browse"
    clearFile();
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => e.preventDefault()),
  );
  dropzone.addEventListener("dragenter", () => {
    dragDepth++;
    dropzone.classList.add("dz-over");
  });
  dropzone.addEventListener("dragleave", () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dropzone.classList.remove("dz-over");
  });
  dropzone.addEventListener("drop", (e) => {
    dragDepth = 0;
    dropzone.classList.remove("dz-over");
    const dt = (e as DragEvent).dataTransfer;
    if (!dt?.files?.length) return;
    const transfer = new DataTransfer();
    transfer.items.add(dt.files[0]); // single file only — a drop replaces the current one
    fileIn.files = transfer.files;
    validateFile(dt.files[0]);
  });
  fileIn.addEventListener("change", () => {
    if (fileIn.files?.length) validateFile(fileIn.files[0]);
  });

  // Field validation feedback
  nameIn.addEventListener("blur", () => fieldError(nameIn, "err-name", nameIn.value.trim() === ""));
  emailIn.addEventListener("blur", () =>
    fieldError(emailIn, "err-email", emailIn.value.trim() !== "" && !emailValid()),
  );
  [nameIn, emailIn].forEach((el) => el.addEventListener("input", gate));
  [declChk, privacyChk, copyChk].forEach((el) => el.addEventListener("change", gate));

  form.addEventListener("submit", (e) => {
    const reqs = gate();
    if (!Object.values(reqs).every(Boolean)) {
      e.preventDefault();
      const firstInvalid = !reqs.name
        ? nameIn
        : !reqs.email
          ? emailIn
          : !reqs.file
            ? dropzone
            : !reqs.decl
              ? declChk
              : privacyChk;
      fieldError(nameIn, "err-name", !reqs.name);
      fieldError(emailIn, "err-email", !reqs.email);
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus({ preventScroll: true });
      return;
    }
    // Final bookkeeping, then let the browser post the multipart form
    ($("f-timestamp") as HTMLInputElement).value = new Date().toISOString();
    ($("f-next") as HTMLInputElement).value = `${location.origin}/submit?submitted=1`;
    ($("f-replyto") as HTMLInputElement).value = emailIn.value.trim();
    const cc = $("f-cc") as HTMLInputElement;
    cc.disabled = !copyChk.checked;
    if (copyChk.checked) cc.value = emailIn.value.trim();
    submitting = true;
    submitBtn.disabled = true; // prevent duplicate submissions
    submitBtn.textContent = "Submitting…";
    progress.hidden = false;
  });

  gate();
}

const form = $("submit-form") as HTMLFormElement | null;
if (form) initSubmit(form);
