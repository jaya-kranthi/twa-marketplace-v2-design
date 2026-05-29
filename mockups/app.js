// twa-marketplace-v2 mockup SPA — hash router + role switcher + theme. Pure JS, no build.
(function () {
  "use strict";

  // ---- which views live in the auth shell vs app shell ----
  var AUTH = ["signin","apply","verify","reset","invite","pending"];

  // ---- nav per role (route, label) ----
  var NAV = {
    user: [
      ["Discover", [["catalog","Catalog"],["dashboard","Dashboard"]]],
      ["Me",       [["activity","Activity"],["settings","Settings"]]]
    ],
    admin: [
      ["Discover",     [["catalog","Catalog"],["dashboard","Dashboard"]]],
      ["Organization", [["members","Members"],["subscription","Subscription"]]],
      ["Me",           [["activity","Activity"],["settings","Settings"]]]
    ],
    super: [
      ["Discover", [["catalog","Catalog"],["dashboard","Dashboard"]]],
      ["Platform", [["dataproducts","Data Products"],["approvals","Approvals"],["plans","Plans"],["orgs","Organizations"]]],
      ["Me",       [["activity","Activity"],["settings","Settings"]]]
    ]
  };

  // routes only reachable by certain roles (app shell)
  var GATED = {
    subscription:["admin","super"], members:["admin","super"],
    dataproducts:["super"], approvals:["super"], plans:["super"], orgs:["super"]
  };

  // ---- dashboard tiles per role ----
  var TILES = {
    user:[["My Downloads","18","this month"],["Available Datasets","42","entitled + new"]],
    admin:[["Org Usage","134","downloads · 24 members"],["Subscription","Growth","renews 2026-12-31"],["Pending Invites","1","awaiting accept"]],
    super:[["Platform Ingestions","27","✓25 ⚠1 ✗1"],["Pending Approvals","2","1 org · 1 plan"],["Active Subscriptions","38","across tiers"],["Data Products","14","published"]]
  };

  function role(){ return document.body.getAttribute("data-role") || "user"; }

  function currentView(){
    var h = (location.hash || "#/signin").replace(/^#\//,"");
    return h.split("/")[0] || "signin";
  }

  function renderSidebar(){
    var nav = document.getElementById("sidebar"); if(!nav) return;
    var r = role(), html = "";
    NAV[r].forEach(function(sec){
      html += '<div class="navsection">'+sec[0]+'</div>';
      sec[1].forEach(function(item){
        html += '<a class="navlink" data-route="'+item[0]+'" href="#/'+item[0]+'">'+item[1]+'</a>';
      });
    });
    nav.innerHTML = html;
  }

  function renderDash(){
    var box = document.getElementById("dashTiles"); if(!box) return;
    var r = role();
    document.getElementById("dashSub").textContent =
      r==="super" ? "Platform health at a glance." : r==="admin" ? "Your organization at a glance." : "Your activity at a glance.";
    box.innerHTML = TILES[r].map(function(t){
      return '<div class="tile"><div class="ttl">'+t[0]+'</div><div class="val">'+t[1]+'</div><div class="asof">'+t[2]+' · data as of 14:00</div></div>';
    }).join("");
  }

  // toggle admin-only UI bits (API Keys tab, share button)
  function applyRoleVisibility(){
    var r = role(), adminish = (r==="admin"||r==="super");
    document.querySelectorAll("[data-admin]").forEach(function(el){ el.style.display = adminish ? "" : "none"; });
    document.querySelectorAll("[data-adminonly]").forEach(function(el){ el.style.display = (r==="admin") ? "" : "none"; });
  }

  function route(){
    var v = currentView();
    var isAuth = AUTH.indexOf(v) >= 0;

    // gating: if a gated app route isn't allowed for this role, redirect to catalog
    if(!isAuth && GATED[v] && GATED[v].indexOf(role())<0){ location.hash="#/catalog"; return; }

    document.getElementById("auth-shell").style.display = isAuth ? "block" : "none";
    document.getElementById("app-shell").style.display  = isAuth ? "none"  : "block";

    // show only the matching section
    document.querySelectorAll("[data-view]").forEach(function(s){
      s.style.display = (s.getAttribute("data-view")===v) ? "" : "none";
    });

    // active nav
    document.querySelectorAll(".navlink").forEach(function(a){
      a.classList.toggle("active", a.getAttribute("data-route")===v);
    });

    if(v==="dashboard") renderDash();
    applyRoleVisibility();
    window.scrollTo(0,0);
  }

  // ---- role switcher ----
  document.querySelectorAll("[data-role-btn]").forEach(function(btn){
    btn.addEventListener("click", function(){
      document.querySelectorAll("[data-role-btn]").forEach(function(b){ b.setAttribute("aria-pressed","false"); });
      btn.setAttribute("aria-pressed","true");
      document.body.setAttribute("data-role", btn.getAttribute("data-role-btn"));
      renderSidebar(); route();
    });
  });

  // ---- theme toggle (persist) ----
  var saved = localStorage.getItem("twa-theme");
  if(saved) document.documentElement.setAttribute("data-theme", saved);
  var tt = document.getElementById("themeToggle");
  if(tt) tt.addEventListener("click", function(){
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur==="dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("twa-theme", next);
  });

  // ---- Settings tabs ----
  document.addEventListener("click", function(e){
    var tab = e.target.closest("#settingsTabs .tab");
    if(tab){
      document.querySelectorAll("#settingsTabs .tab").forEach(function(t){ t.classList.remove("on"); });
      tab.classList.add("on");
      var name = tab.getAttribute("data-tab");
      document.querySelectorAll("[data-tabpane]").forEach(function(p){
        p.style.display = (p.getAttribute("data-tabpane")===name) ? "" : "none";
      });
    }
    var atab = e.target.closest("#apprTabs .tab");
    if(atab){
      document.querySelectorAll("#apprTabs .tab").forEach(function(t){ t.classList.remove("on"); });
      atab.classList.add("on");
      var an = atab.getAttribute("data-atab");
      document.querySelectorAll("[data-apane]").forEach(function(p){
        p.style.display = (p.getAttribute("data-apane")===an) ? "" : "none";
      });
    }
  });

  window.addEventListener("hashchange", route);
  renderSidebar();
  if(!location.hash) location.hash = "#/signin";
  route();
})();
