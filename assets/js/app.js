const navigationElement = document.querySelector("#notes-navigation");
const contentElement = document.querySelector("#note-content");
const breadcrumbsElement = document.querySelector("#breadcrumbs");

let navigation = [];

function currentPageId() {
  return window.location.hash.replace(/^#\//, "") || "home";
}

function findPage(pageId) {
  for (const module of navigation) {
    const page = module.pages.find((item) => item.id === pageId);
    if (page) {
      return { module, page };
    }
  }
  return null;
}

function renderNavigation(activePageId) {
  navigationElement.replaceChildren();

  for (const module of navigation) {
    const heading = document.createElement("div");
    heading.className = "module-title";
    heading.textContent = module.title;
    navigationElement.append(heading);

    const list = document.createElement("div");
    list.className = "nav nav-pills flex-column";

    for (const page of module.pages) {
      const link = document.createElement("a");
      link.className = `nav-link${page.id === activePageId ? " active" : ""}`;
      link.href = `#/${page.id}`;
      link.textContent = page.title;
      if (page.id === activePageId) {
        link.setAttribute("aria-current", "page");
      }
      list.append(link);
    }

    navigationElement.append(list);
  }
}

function renderBreadcrumbs(module, page) {
  breadcrumbsElement.replaceChildren();

  const moduleItem = document.createElement("li");
  moduleItem.className = "breadcrumb-item text-body-secondary";
  moduleItem.textContent = module.title;

  const pageItem = document.createElement("li");
  pageItem.className = "breadcrumb-item active";
  pageItem.setAttribute("aria-current", "page");
  pageItem.textContent = page.title;

  breadcrumbsElement.append(moduleItem, pageItem);
}

function closeMobileSidebar() {
  const sidebar = document.querySelector("#sidebar");
  const instance = bootstrap.Offcanvas.getInstance(sidebar);
  instance?.hide();
}

async function loadPage() {
  const pageId = currentPageId();
  const match = findPage(pageId);

  renderNavigation(pageId);

  if (!match) {
    breadcrumbsElement.replaceChildren();
    contentElement.innerHTML = `
      <h1>Page not found</h1>
      <p>The requested note is not listed in <code>navigation.json</code>.</p>
      <p><a href="#/home">Return to the homepage</a></p>
    `;
    document.title = "Page not found | Learning Notes";
    return;
  }

  renderBreadcrumbs(match.module, match.page);
  contentElement.innerHTML = '<div class="text-body-secondary">Loading note...</div>';

  try {
    const response = await fetch(match.page.file);
    if (!response.ok) {
      throw new Error(`Could not load ${match.page.file}`);
    }

    contentElement.innerHTML = await response.text();
    document.title = `${match.page.title} | Learning Notes`;
    contentElement.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    closeMobileSidebar();
  } catch (error) {
    contentElement.innerHTML = `
      <h1>Unable to load note</h1>
      <p>${error.message}</p>
    `;
  }
}

async function start() {
  try {
    const response = await fetch("navigation.json");
    if (!response.ok) {
      throw new Error("Could not load navigation.json");
    }

    navigation = await response.json();
    await loadPage();
  } catch (error) {
    contentElement.innerHTML = `
      <h1>Unable to start site</h1>
      <p>${error.message}</p>
    `;
  }
}

window.addEventListener("hashchange", loadPage);
start();

