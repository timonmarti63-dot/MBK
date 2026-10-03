// MBKCAD Webseite - gemeinsame Helfer: Bild gross, Menueband-Reiter, Bildergalerien, Inhaltsverzeichnis
"use strict";

// ---------- Vorschau-Banner (shop-config.js: vorschau) ----------
if (window.MBK_SHOP && window.MBK_SHOP.vorschau === false) document.querySelectorAll(".provisorisch").forEach(e => e.remove());

// ---------- Bild gross (Klick auf ein Bild mit data-gross oder in .zoom) ----------
const lb = document.createElement("div");
lb.className = "lb";
lb.innerHTML = '<button type="button">Schliessen ✕</button><img alt=""><div class="unter"></div>';
document.body.appendChild(lb);
const lbBild = lb.querySelector("img"), lbText = lb.querySelector(".unter");
function gross(src, text) {
  lbBild.src = src; lbBild.alt = text || ""; lbText.textContent = text || "";
  lb.classList.add("offen"); lb.querySelector("button").focus();
}
function zu() { lb.classList.remove("offen"); lbBild.removeAttribute("src"); }
lb.addEventListener("click", e => { if (e.target !== lbBild) zu(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && lb.classList.contains("offen")) zu(); });
document.addEventListener("click", e => {
  const z = e.target.closest("[data-gross], .zoom");
  if (!z || lb.contains(z)) return;
  const img = z.tagName === "IMG" ? z : z.querySelector("img");
  if (!img) return;
  e.preventDefault();
  gross(z.dataset.gross || img.currentSrc || img.src, z.dataset.text || img.alt);
});

// ---------- Menueband: Reiter wie in AutoCAD ----------
document.querySelectorAll(".band").forEach(band => {
  const knoepfe = band.querySelectorAll(".reiter button"), bild = band.querySelector(".bild img"), text = band.querySelector(".text");
  knoepfe.forEach(k => k.addEventListener("click", () => {
    knoepfe.forEach(x => { x.classList.toggle("an", x === k); x.setAttribute("aria-selected", x === k); });
    bild.src = k.dataset.bild; bild.alt = "Menüband " + k.textContent;
    text.innerHTML = k.dataset.text;
  }));
});

// ---------- Bildergalerie je Kapitel ----------
document.querySelectorAll(".galerie").forEach(gal => {
  const grossImg = gal.querySelector(".gross img"), cap = gal.querySelector(".gross figcaption"), daumen = gal.querySelectorAll(".daumen button");
  daumen.forEach(d => d.addEventListener("click", () => {
    const img = d.querySelector("img");
    grossImg.src = img.src; grossImg.alt = img.alt; if (cap) cap.textContent = img.alt;
    daumen.forEach(x => x.classList.toggle("an", x === d));
  }));
});

// ---------- Inhaltsverzeichnis: aktuelles Kapitel markieren ----------
const links = [...document.querySelectorAll(".inhalt a")];
if (links.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(eintraege => {
    eintraege.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("an", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll(".kapitel[id]").forEach(k => io.observe(k));
}
