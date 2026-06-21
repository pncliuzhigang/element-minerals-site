
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");

const syncHeader = () => {
  if (!header || !progress || !backToTop) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  backToTop.classList.toggle("is-visible", window.scrollY > 520);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.setProperty("--scroll-progress", `${percentage}%`);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll(".accordion").forEach((accordion) => {
  accordion.addEventListener("click", (event) => {
    const trigger = event.target.closest(".accordion-trigger");
    if (!trigger) return;
    const panel = trigger.nextElementSibling;
    if (panel) panel.classList.toggle("is-open");
  });
});

document.querySelectorAll("[data-directory-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.directoryFilter;
    document.querySelectorAll("[data-directory-filter]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    document.querySelectorAll(".directory-link").forEach((link) => {
      link.hidden = filter !== "all" && link.dataset.topic !== filter;
    });
  });
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const openSearch = document.querySelector("[data-open-search]");
const closeSearch = document.querySelector("[data-close-search]");
const searchPanel = document.querySelector("[data-search-panel]");
const searchInput = document.querySelector("[data-site-search]");
const searchResults = document.querySelector("[data-search-results]");
const pageSearchInput = document.querySelector("[data-site-search-page]");
const pageSearchResults = document.querySelector("[data-search-page-results]");

const renderResults = (query, target) => {
  if (!target) return;
  const q = query.trim().toLowerCase();
  const pages = window.ELEMENT_SITE_INDEX || [];
  const results = q
    ? pages.filter((page) => `${page.title} ${page.section} ${page.summary}`.toLowerCase().includes(q)).slice(0, 12)
    : pages.slice(0, 8);

  target.innerHTML = results
    .map((page) => `<a href="${page.url}"><strong>${page.title}</strong><span>${page.section}</span><small>${page.summary}</small></a>`)
    .join("");
};

if (openSearch && searchPanel) {
  openSearch.addEventListener("click", () => {
    searchPanel.classList.add("is-open");
    searchPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    renderResults("", searchResults);
    if (searchInput) searchInput.focus();
  });
}

if (closeSearch && searchPanel) {
  closeSearch.addEventListener("click", () => {
    searchPanel.classList.remove("is-open");
    searchPanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => renderResults(searchInput.value, searchResults));
}

if (pageSearchInput) {
  renderResults("", pageSearchResults);
  pageSearchInput.addEventListener("input", () => renderResults(pageSearchInput.value, pageSearchResults));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && searchPanel && searchPanel.classList.contains("is-open")) {
    searchPanel.classList.remove("is-open");
    searchPanel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
});
