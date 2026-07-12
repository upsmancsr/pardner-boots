/* ============================================================
   Mobile nav drawer — hamburger toggle, scrim/Esc/link close
   ============================================================ */
(function () {
  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.querySelector(".drawer");

  function setOpen(open) {
    body.classList.toggle("drawer-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (drawer) drawer.setAttribute("aria-hidden", open ? "false" : "true");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setOpen(!body.classList.contains("drawer-open"));
    });
  }

  // scrim, close button, and any nav link inside the drawer close it
  document.querySelectorAll("[data-drawer-close]").forEach(function (el) {
    el.addEventListener("click", function () { setOpen(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  /* ---- floating header: hide on scroll down, reveal on scroll up ---- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var lastY = window.pageYOffset;
    var ticking = false;
    var SHOW_AT = 90; // px before the effect kicks in

    function update() {
      var y = window.pageYOffset;
      nav.classList.toggle("nav--floating", y > SHOW_AT);
      // never hide while the drawer is open
      if (body.classList.contains("drawer-open")) {
        nav.classList.remove("nav--hidden");
      } else if (y > lastY && y > SHOW_AT) {
        nav.classList.add("nav--hidden");   // scrolling down
      } else if (y < lastY) {
        nav.classList.remove("nav--hidden"); // scrolling up → float in
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }
})();
