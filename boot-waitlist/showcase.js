/* ============================================================
   Scrolly boot showcase — pinned boot with a pointing dot, a
   text panel + progress that update per feature, image swaps
   per step. Progressive enhancement: without IntersectionObserver
   it simply shows the first feature.
   ============================================================ */
(function () {
  var track = document.getElementById("boot-showcase");
  if (!track) return;

  // which image each step shows
  var STEPS = ["birdseye", "side", "birdseye", "side"];

  var imgs = track.querySelectorAll(".s-img");
  var callouts = track.querySelectorAll(".s-callout");
  var prints = track.querySelectorAll(".s-print");
  var sentinels = track.querySelectorAll(".s-sent");
  var caption = track.querySelector(".showcase-caption");

  function setActive(i) {
    track.dataset.active = i;
    var want = STEPS[i];
    imgs.forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-img") === want);
    });
    callouts.forEach(function (el) {
      el.classList.toggle("active", Number(el.getAttribute("data-step")) === i);
    });
    // footprints fill in as a trail up to the current step
    prints.forEach(function (el) {
      el.classList.toggle("active", Number(el.getAttribute("data-step")) <= i);
    });
    if (caption) {
      var lbl = callouts[i].querySelector(".s-label");
      if (lbl) caption.innerHTML = lbl.innerHTML;
    }
  }

  // fill the first feature on load (also the no-JS-observer fallback state)
  setActive(0);

  if (!("IntersectionObserver" in window)) return;

  // enable the tall scroll track only once JS is driving it
  track.classList.add("ready");

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(Number(e.target.getAttribute("data-step")));
      });
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
  );
  sentinels.forEach(function (s) { io.observe(s); });
})();
