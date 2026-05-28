// TWA Marketplace mockup SPA — hash router + role switcher + theme. Pure JS, no build.
(function () {
  // Routes that require the app shell (post-login) vs bare auth cards.
  const AUTH = new Set(["signin", "reset", "invite", "apply"]);

  // Per-route minimum role visibility (access-matrix). user < admin < super.
  const RANK = { user: 1, admin: 2, super: 3 };
  const ROUTE_MIN = {
    catalog: "user", product: "user", settings: "user",
    "admin": "admin", "admin-members": "admin", "admin-subscription": "admin",
    "super": "super", "super-orgs": "super", "super-products": "super",
    "super-product": "super", "super-keys": "super",
  };

  function role() { return localStorage.getItem("twa-role") || "user"; }
  function setRole(r) { localStorage.setItem("twa-role", r); applyRole(); route(); }

  function applyRole() {
    const r = role();
    document.body.setAttribute("data-role", r);
    // role switcher active state
    document.querySelectorAll("[data-setrole]").forEach(b =>
      b.setAttribute("aria-pressed", b.dataset.setrole === r));
    // show/hide elements gated by data-roles="admin super" etc.
    document.querySelectorAll("[data-roles]").forEach(el => {
      const allowed = el.dataset.roles.split(/\s+/);
      el.style.display = allowed.includes(r) ? "" : "none";
    });
  }

  function currentView() {
    const h = (location.hash.replace(/^#\/?/, "") || "catalog").split("/")[0];
    return h;
  }

  function route() {
    let v = currentView();
    const isAuth = AUTH.has(v);
    document.getElementById("app-shell").style.display = isAuth ? "none" : "";
    document.getElementById("auth-shell").style.display = isAuth ? "" : "none";

    // role-gate: if the target needs a higher role than selected, redirect to a safe view.
    if (!isAuth && ROUTE_MIN[v] && RANK[role()] < RANK[ROUTE_MIN[v]]) {
      v = "catalog"; location.hash = "#/catalog"; // access denied → bounce to catalog
    }

    document.querySelectorAll("[data-view]").forEach(sec => {
      sec.style.display = sec.dataset.view === v ? "" : "none";
    });
    // active nav highlight
    document.querySelectorAll("[data-nav]").forEach(a =>
      a.classList.toggle("active", a.dataset.nav === v));
    window.scrollTo(0, 0);
  }

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("twa-theme", next);
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", function () {
    const t = localStorage.getItem("twa-theme");
    if (t) document.documentElement.setAttribute("data-theme", t);
    document.querySelectorAll("[data-setrole]").forEach(b =>
      b.addEventListener("click", () => setRole(b.dataset.setrole)));
    document.querySelectorAll("[data-theme-toggle]").forEach(b =>
      b.addEventListener("click", toggleTheme));
    if (!location.hash) location.hash = "#/catalog";
    applyRole();
    route();
  });

  window.TWA = { setRole, toggleTheme };
})();
