/**
 * Terrains browser (WEBSITE_PROPOSAL.md §7, build-time data).
 * All metadata + preview thumbnails are generated at build (scripts/build.mts) and
 * embedded as JSON. This island handles Grid/List views, search, a map-size filter,
 * sort, pagination with a per-page selector, and a per-terrain detail dialog.
 * No network requests.
 */
interface Terrain {
  id: string;
  slug: string;
  name: string;
  author: string;
  version: string;
  description: string;
  size: string;
  thumb: string | null;
  download: string;
  file: string;
  bytes: number;
  fileSize: string;
}

const DL_SVG =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>';

function readData(): Terrain[] {
  const el = document.getElementById("terrain-data");
  if (!el?.textContent) return [];
  try {
    return JSON.parse(el.textContent) as Terrain[];
  } catch (err) {
    console.error("[terrains] bad manifest", err);
    return [];
  }
}

function badge(text: string, gold = false): HTMLElement {
  const s = document.createElement("span");
  s.className = gold ? "badge badge--gold" : "badge";
  s.textContent = text;
  return s;
}

function initTerrains(view: HTMLElement) {
  const searchEl = document.getElementById("terrain-search") as HTMLInputElement | null;
  const sizeEl = document.getElementById("terrain-size") as HTMLSelectElement | null;
  const sortEl = document.getElementById("terrain-sort") as HTMLSelectElement | null;
  const perPageEl = document.getElementById("terrain-perpage") as HTMLSelectElement | null;
  const gridBtn = document.getElementById("btn-grid");
  const listBtn = document.getElementById("btn-list");
  const pager = document.getElementById("terrain-pager");
  const statusEl = document.getElementById("terrain-status");
  const resultsEl = document.getElementById("terrain-results");

  const dialog = document.getElementById("detail-dialog") as HTMLDialogElement | null;
  const detailClose = document.getElementById("detail-close");

  const all = readData();
  let filtered = all.slice();
  let mode: "grid" | "list" = "grid";
  let perPage = 25;
  let page = 0;

  /** Keep ?id=<hash> in the URL so every terrain has a stable shareable link. */
  function syncUrl(id: string | null) {
    const url = new URL(location.href);
    if (id) url.searchParams.set("id", id);
    else url.searchParams.delete("id");
    history.replaceState(null, "", url);
  }

  function openDetail(t: Terrain) {
    if (!dialog) return;
    syncUrl(t.id);
    const img = document.getElementById("detail-img") as HTMLImageElement;
    img.src = t.thumb ?? "";
    img.alt = `${t.name} map preview`;
    img.style.display = t.thumb ? "block" : "none";
    (document.getElementById("detail-name") as HTMLElement).textContent = t.name;
    (document.getElementById("detail-by") as HTMLElement).textContent = t.author ? `by ${t.author}` : "";
    const badges = document.getElementById("detail-badges") as HTMLElement;
    badges.replaceChildren();
    if (t.size) badges.appendChild(badge(t.size));
    if (t.version) badges.appendChild(badge(`v${t.version}`, true));
    (document.getElementById("detail-desc") as HTMLElement).textContent =
      t.description || "No description provided.";
    const dl = document.getElementById("detail-dl") as HTMLAnchorElement;
    dl.href = t.download;
    dl.setAttribute("download", t.file);
    (document.getElementById("detail-filesize") as HTMLElement).textContent = t.fileSize;
    dialog.showModal();
  }

  const closeDetail = () => {
    syncUrl(null);
    if (dialog?.open) dialog.close();
  };
  detailClose?.addEventListener("click", closeDetail);
  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog) closeDetail();
  });
  dialog?.addEventListener("cancel", () => syncUrl(null)); // Esc key
  dialog?.addEventListener("close", () => syncUrl(null));

  const openOnKeys = (el: HTMLElement, t: Terrain) => {
    el.addEventListener("click", () => openDetail(t));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetail(t);
      }
    });
  };

  function buildCard(t: Terrain, index: number): HTMLElement {
    const card = document.createElement("article");
    card.className = "tcard";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${t.name} by ${t.author} — view details`);
    card.style.animationDelay = `${Math.min(index * 28, 340)}ms`;
    card.innerHTML = `
      <div class="tcard-thumb"></div>
      <div class="tcard-body">
        <div class="tcard-top">
          <a class="tcard-dl" download target="_self">${DL_SVG}</a>
          <h3 class="tcard-name"></h3>
        </div>
        <p class="tcard-by"></p>
        <div class="tcard-badges"></div>
      </div>`;
    if (t.thumb) {
      const img = document.createElement("img");
      img.src = t.thumb;
      img.alt = `${t.name} map preview`;
      img.width = 96;
      img.height = 96;
      img.loading = "lazy";
      (card.querySelector(".tcard-thumb") as HTMLElement).appendChild(img);
    }
    (card.querySelector(".tcard-name") as HTMLElement).textContent = t.name;
    (card.querySelector(".tcard-by") as HTMLElement).textContent = `by ${t.author}`;
    const badges = card.querySelector(".tcard-badges") as HTMLElement;
    if (t.size) badges.appendChild(badge(t.size));
    if (t.version) badges.appendChild(badge(`v${t.version}`, true));
    const dl = card.querySelector(".tcard-dl") as HTMLAnchorElement;
    dl.href = t.download;
    dl.setAttribute("download", t.file);
    dl.setAttribute("aria-label", `Download ${t.name}`);
    dl.addEventListener("click", (e) => e.stopPropagation());
    openOnKeys(card, t);
    return card;
  }

  function buildTable(items: Terrain[]): HTMLElement {
    const table = document.createElement("table");
    table.className = "terrain-table";
    table.innerHTML =
      '<thead><tr><th class="col-thumb"><span class="visually-hidden">Map preview</span></th><th>Name</th><th>Author</th><th>Size</th><th>Version</th></tr></thead>';
    const tbody = document.createElement("tbody");
    items.forEach((t, i) => {
      const tr = document.createElement("tr");
      tr.tabIndex = 0;
      tr.setAttribute("role", "button");
      tr.setAttribute("aria-label", `${t.name} by ${t.author} — view details`);
      tr.style.animationDelay = `${Math.min(i * 16, 320)}ms`;
      tr.innerHTML =
        '<td class="col-thumb"></td><td class="t-name"></td><td class="t-author"></td><td class="t-size"></td><td class="t-ver"></td>';
      if (t.thumb) {
        const img = document.createElement("img");
        img.src = t.thumb;
        img.alt = "";
        img.width = 44;
        img.height = 44;
        img.loading = "lazy";
        (tr.querySelector(".col-thumb") as HTMLElement).appendChild(img);
      }
      (tr.querySelector(".t-name") as HTMLElement).textContent = t.name;
      (tr.querySelector(".t-author") as HTMLElement).textContent = t.author;
      (tr.querySelector(".t-size") as HTMLElement).textContent = t.size;
      (tr.querySelector(".t-ver") as HTMLElement).textContent = t.version ? `v${t.version}` : "";
      openOnKeys(tr, t);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  }

  function renderPager() {
    if (!pager) return;
    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (pages <= 1) {
      pager.hidden = true;
      pager.replaceChildren();
      return;
    }
    pager.hidden = false;
    const mk = (
      label: string,
      target: number,
      o: { disabled?: boolean; current?: boolean; aria?: string } = {},
    ) => {
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = label;
      if (o.aria) b.setAttribute("aria-label", o.aria);
      if (o.disabled) b.disabled = true;
      if (o.current) b.setAttribute("aria-current", "true");
      b.addEventListener("click", () => {
        page = target;
        render();
        view.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return b;
    };
    const btns: HTMLElement[] = [mk("‹", page - 1, { disabled: page === 0, aria: "Previous page" })];
    const from = Math.max(0, Math.min(page - 2, pages - 5));
    const to = Math.min(pages, from + 5);
    for (let i = from; i < to; i++)
      btns.push(mk(String(i + 1), i, { current: i === page, aria: `Page ${i + 1}` }));
    btns.push(mk("›", page + 1, { disabled: page >= pages - 1, aria: "Next page" }));
    pager.replaceChildren(...btns);
  }

  function render() {
    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (page >= pages) page = pages - 1;
    const items = filtered.slice(page * perPage, page * perPage + perPage);
    view.className = `terrain-view view-${mode}`;
    if (mode === "list") view.replaceChildren(buildTable(items));
    else view.replaceChildren(...items.map((t, i) => buildCard(t, i)));
    if (statusEl) {
      statusEl.hidden = filtered.length !== 0;
      statusEl.textContent = "No terrains match your filters.";
    }
    renderPager();
  }

  function applyFilterSort(resetPage = true) {
    const q = (searchEl?.value ?? "").trim().toLowerCase();
    const size = sizeEl?.value ?? "any";
    filtered = all.filter((t) => {
      if (size !== "any" && t.size !== size) return false;
      if (!q) return true;
      return `${t.name} ${t.author} ${t.description}`.toLowerCase().includes(q);
    });
    // Subtle result counter — only while a search or size filter is active.
    if (resultsEl) {
      const active = q.length > 0 || size !== "any";
      resultsEl.hidden = !active;
      if (active)
        resultsEl.textContent = `${filtered.length} ${filtered.length === 1 ? "terrain" : "terrains"} found`;
    }
    const s = sortEl?.value ?? "name-asc";
    filtered.sort((a, b) => {
      switch (s) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "author-asc":
          return a.author.localeCompare(b.author) || a.name.localeCompare(b.name);
        case "size-asc":
          return a.bytes - b.bytes;
        case "size-desc":
          return b.bytes - a.bytes;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    if (resetPage) page = 0;
    render();
  }

  function setMode(next: "grid" | "list") {
    mode = next;
    gridBtn?.classList.toggle("is-active", next === "grid");
    gridBtn?.setAttribute("aria-pressed", String(next === "grid"));
    listBtn?.classList.toggle("is-active", next === "list");
    listBtn?.setAttribute("aria-pressed", String(next === "list"));
    render();
  }

  let debounce: number | undefined;
  searchEl?.addEventListener("input", () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => applyFilterSort(), 150);
  });
  sizeEl?.addEventListener("change", () => applyFilterSort());
  sortEl?.addEventListener("change", () => applyFilterSort());
  perPageEl?.addEventListener("change", () => {
    perPage = Number(perPageEl.value) || 25;
    page = 0;
    render();
  });
  gridBtn?.addEventListener("click", () => setMode("grid"));
  listBtn?.addEventListener("click", () => setMode("list"));

  applyFilterSort();

  // Deep link: /terrains?id=<hash> opens that terrain's detail view.
  const linked = new URLSearchParams(location.search).get("id");
  if (linked) {
    const t = all.find((x) => x.id === linked);
    if (t) openDetail(t);
    else syncUrl(null); // unknown id — clean the URL
  }
}

function initHelp() {
  const btn = document.getElementById("help-btn");
  const dialog = document.getElementById("help-dialog") as HTMLDialogElement | null;
  const closeBtn = document.getElementById("help-close");
  if (btn && dialog && typeof dialog.showModal === "function") {
    btn.addEventListener("click", () => dialog.showModal());
    closeBtn?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const plat = (nav.userAgentData?.platform || navigator.platform || "").toLowerCase();
  const os = plat.includes("win")
    ? "windows"
    : plat.includes("mac")
      ? "macos"
      : plat.includes("linux")
        ? "linux"
        : "";
  if (os) document.querySelector(`.os-row[data-os="${os}"]`)?.classList.add("detected");

  document.querySelectorAll<HTMLButtonElement>(".copy-btn").forEach((b) => {
    b.addEventListener("click", async () => {
      const path = b.dataset.copy ?? "";
      try {
        await navigator.clipboard.writeText(path);
        const prev = b.textContent;
        b.textContent = "Copied!";
        window.setTimeout(() => (b.textContent = prev), 1400);
      } catch {
        /* clipboard blocked */
      }
    });
  });
}

const view = document.getElementById("terrain-view");
if (view) initTerrains(view);
initHelp();
