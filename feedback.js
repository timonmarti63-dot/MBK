// MBKCAD Feedback - PROVISORISCH: ohne Server; die Rueckmeldung wird als fertige Mail im Mailprogramm des Besuchers geoeffnet.
// Spaeter: Formular an einen Server / Formular-Dienst senden. Empfaenger hier eintragen:
"use strict";
const FEEDBACK_AN = (window.MBK_SHOP && window.MBK_SHOP.feedbackMail) || "feedback@mbkcad.ch";   // shop-config.js

const fb = document.getElementById("fb");
const STERNE = { 1: "schlecht", 2: "eher schlecht", 3: "geht so", 4: "gut", 5: "sehr gut" };

function art() { return fb.querySelector('input[name="art"]:checked').value; }
function sterne() { const s = fb.querySelector('input[name="sterne"]:checked'); return s ? +s.value : 0; }
function wert(id) { return document.getElementById(id).value.trim(); }

// Fehlerteil nur bei Fehler / Normwert zeigen
function artGeaendert() { fb.classList.toggle("ist-fehler", /Fehler|Norm/.test(art())); }
fb.querySelectorAll('input[name="art"]').forEach(r => r.addEventListener("change", artGeaendert));
artGeaendert();
fb.querySelectorAll('input[name="sterne"]').forEach(r => r.addEventListener("change", () => {
  document.getElementById("sterntext").textContent = `${sterne()} von 5 – ${STERNE[sterne()]}`;
}));

fb.addEventListener("submit", ev => {
  ev.preventDefault();
  const hinweis = document.getElementById("fbfehler");
  if (!wert("titel") || !wert("text")) { hinweis.textContent = "Bitte Zusammenfassung und Beschreibung ausfüllen."; return; }
  const mail = document.getElementById("mail");
  if (wert("mail") && !mail.checkValidity()) { hinweis.textContent = "Die E-Mail-Adresse sieht nicht richtig aus."; return; }
  hinweis.textContent = "";

  const zeilen = [
    `Art: ${art()}`,
    `Bereich: ${wert("bereich")}`,
    `Bewertung: ${sterne() ? sterne() + " von 5 (" + STERNE[sterne()] + ")" : "keine"}`,
    `AutoCAD: ${wert("acad")}`,
    `MBKCAD: 1.2`,
    "",
    `Zusammenfassung: ${wert("titel")}`,
    "",
    "Beschreibung:",
    wert("text")
  ];
  if (fb.classList.contains("ist-fehler")) {
    if (wert("schritte")) zeilen.push("", "Was gemacht:", wert("schritte"));
    if (wert("erwartet")) zeilen.push("", "Erwartet:", wert("erwartet"));
    if (wert("norm")) zeilen.push("", `Norm / Quelle: ${wert("norm")}`);
  }
  zeilen.push("", "---",
    `Name: ${wert("name") || "-"}`,
    `E-Mail: ${wert("mail") || "-"}`,
    `Kontakt erlaubt: ${document.getElementById("kontakt").checked ? "ja" : "nein"}`);
  const text = zeilen.join("\n");
  const betreff = `MBKCAD Feedback – ${art()} – ${wert("bereich")}: ${wert("titel")}`;
  const link = `mailto:${FEEDBACK_AN}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;

  document.getElementById("fbtext").textContent = `An: ${FEEDBACK_AN}\nBetreff: ${betreff}\n\n${text}`;
  document.getElementById("fbadresse").textContent = FEEDBACK_AN;
  document.getElementById("fbmailto").href = link;
  document.getElementById("fbok").classList.add("zeigen");
  document.getElementById("fbok").scrollIntoView({ behavior: "smooth" });
  window.location.href = link;
});

document.getElementById("fbkopieren").addEventListener("click", ev => {
  navigator.clipboard.writeText(document.getElementById("fbtext").textContent)
    .then(() => { ev.target.textContent = "Kopiert ✓"; })
    .catch(() => { ev.target.textContent = "Bitte Text markieren und kopieren"; });
});
