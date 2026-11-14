(function () {
  "use strict";

  var PHOTO_DIR = "assets/photos/";
  var FALLBACK_DIR = "assets/img/";

  /* Фотографии: пробуем jpg из assets/photos, при отсутствии берём заглушку. */
  function loadPhotos() {
    var nodes = document.querySelectorAll("[data-photo]");
    Array.prototype.forEach.call(nodes, function (el) {
      var img = el.tagName === "IMG" ? el : el.querySelector("img");
      if (!img) return;
      var name = el.getAttribute("data-photo");
      img.addEventListener("error", function onErr() {
        img.removeEventListener("error", onErr);
        img.src = FALLBACK_DIR + name + ".svg";
      });
      img.src = PHOTO_DIR + name + ".jpg";
    });
  }

  /* Мобильное меню. */
  function initMenu() {
    var burger = document.querySelector(".burger");
    var nav = document.getElementById("nav");
    if (!burger || !nav) return;

    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Просмотр фотографии на весь экран. */
  function initLightbox() {
    var box = document.getElementById("lightbox");
    if (!box) return;
    var big = box.querySelector("img");
    var close = box.querySelector(".lightbox__close");

    function open(src, alt) {
      big.src = src;
      big.alt = alt || "";
      box.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function hide() {
      box.hidden = true;
      big.src = "";
      document.body.style.overflow = "";
    }

    document.addEventListener("click", function (e) {
      var fig = e.target.closest(".photo");
      var shot = e.target.closest(".doc__shot");
      var node = fig || shot;
      if (!node) return;
      var img = node.querySelector("img");
      if (img && img.src) open(img.src, img.alt);
    });

    close.addEventListener("click", hide);
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target === close) hide();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !box.hidden) hide();
    });
  }

  /* Фильтр фотографий по категориям. */
  function initTabs() {
    var box = document.querySelector("[data-tabs]");
    if (!box) return;
    var grid = document.querySelector(box.getAttribute("data-tabs"));
    if (!grid) return;
    var more = document.querySelector(".more");
    var buttons = box.querySelectorAll("[data-filter]");

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        Array.prototype.forEach.call(buttons, function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        Array.prototype.forEach.call(grid.children, function (fig) {
          var cat = fig.getAttribute("data-cat");
          fig.hidden = !(f === "all" || cat === f);
        });
        if (f === "all") {
          grid.classList.add("is-collapsed");
          if (more) more.hidden = false;
          var mb = document.querySelector("[data-more]");
          if (mb) mb.textContent = "Показать все фото";
        } else {
          grid.classList.remove("is-collapsed");
          if (more) more.hidden = true;
        }
      });
    });
  }

  /* Кнопка «показать все фото». */
  function initMore() {
    var btn = document.querySelector("[data-more]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var grid = document.querySelector(btn.getAttribute("data-more"));
      if (!grid) return;
      var collapsed = grid.classList.toggle("is-collapsed");
      btn.textContent = collapsed ? "Показать все фото" : "Свернуть";
      btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
  }

  /* Кнопка «наверх». */
  function initBackTop() {
    var btn = document.querySelector(".back-top");
    if (!btn) return;
    function check() {
      btn.hidden = window.scrollY < 600;
    }
    window.addEventListener("scroll", check, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    check();
  }

  /* Мягкое появление блоков при прокрутке. */
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    var targets = document.querySelectorAll(
      ".hero__text, .hero__photo, .tile, .card, .photo, .stat, .contact, " +
      ".table-block, .about__text, .about__facts, .project, .doc"
    );
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadPhotos();
    initMenu();
    initLightbox();
    initTabs();
    initMore();
    initBackTop();
    initReveal();
    initYear();
  });
})();
