// MBKCAD Lizenzseite: Lizenz waehlen, Bedingungen bestaetigen, zum Zahlungslink bzw. "Benachrichtigen lassen".
// Es werden hier KEINE Lizenzen erzeugt - das geschieht nach der Zahlung auf dem Lizenz-Server (siehe Dokumentation).
// Einstellungen (Zahlungslinks, Download, Mailadressen): shop-config.js
"use strict";
const SHOP = window.MBK_SHOP || { aktiv: false, kaufLinks: {}, downloadUrl: "", feedbackMail: "", kontaktMail: "" };
const NAMEN = { M: "Monat", J: "Jahr", L: "Lebenslang" };
const LIZENZ = { M: "Monatslizenz", J: "Jahreslizenz", L: "lebenslange Lizenz" };
const ABO = { M: "verlängert sich automatisch jeden Monat, jederzeit auf Ende der Laufzeit kündbar",
              J: "verlängert sich automatisch jedes Jahr, jederzeit auf Ende der Laufzeit kündbar",
              L: "einmalige Zahlung, keine Verlängerung" };

let gewaehlt = document.querySelector(".preis.gewaehlt");
const knopf = document.getElementById("kaufen"), status = document.getElementById("kaufstatus");
const agb = document.getElementById("agb"), norm = document.getElementById("norm");

function chf(p) { return `CHF ${p}.–`; }
function aktualisieren() {
  const typ = gewaehlt.dataset.typ, preis = gewaehlt.dataset.preis, link = (SHOP.kaufLinks || {})[typ];
  document.getElementById("wahl").textContent = NAMEN[typ];
  document.getElementById("betrag").textContent = chf(preis) + (typ === "M" ? " / Monat" : typ === "J" ? " / Jahr" : "");
  document.getElementById("abohinweis").textContent = ABO[typ];
  const verkauf = SHOP.aktiv && link;
  if (!verkauf) {   // Verkauf noch nicht gestartet: Vormerkung per Mail
    const betreff = encodeURIComponent(`MBKCAD ${LIZENZ[typ]} – bitte benachrichtigen`);
    const text = encodeURIComponent(`Guten Tag\n\nBitte benachrichtigen Sie mich, sobald MBKCAD (${LIZENZ[typ]}, ${chf(preis)}) erhältlich ist.\n\nName:\nFirma (optional):\nAutoCAD-Version:\n`);
    knopf.textContent = "Benachrichtigen lassen";
    knopf.href = `mailto:${SHOP.kontaktMail || SHOP.feedbackMail}?subject=${betreff}&body=${text}`;
    knopf.classList.remove("gesperrt"); knopf.removeAttribute("aria-disabled");
    status.textContent = "Der Verkauf startet in Kürze. Schreiben Sie uns kurz – wir melden uns, sobald Sie MBKCAD kaufen können.";
  } else {
    const ok = agb.checked && norm.checked;
    knopf.textContent = `Jetzt kaufen – ${chf(preis)}`;
    knopf.href = link;
    knopf.classList.toggle("gesperrt", !ok); knopf.setAttribute("aria-disabled", String(!ok));
    status.textContent = ok ? "Sie werden zur sicheren Bezahlseite weitergeleitet (TWINT, Karte …)." : "Bitte zuerst die beiden Bestätigungen oben anklicken.";
  }
}
document.querySelectorAll(".preis").forEach(p => p.addEventListener("click", () => {
  gewaehlt.classList.remove("gewaehlt"); p.classList.add("gewaehlt"); gewaehlt = p; aktualisieren();
}));
[agb, norm].forEach(c => c.addEventListener("change", aktualisieren));
knopf.addEventListener("click", ev => { if (knopf.classList.contains("gesperrt")) { ev.preventDefault(); status.textContent = "Bitte zuerst die beiden Bestätigungen oben anklicken."; } });
document.getElementById("preishinweis").textContent = SHOP.preisHinweis || "";
aktualisieren();

// ---------- Download ----------
// Aus der installierten Kopie (…\MBKCAD\Webseite\) geoeffnet: Setup liegt eine Ebene hoeher im MBKCAD-Ordner.
const installiert = location.protocol === "file:" && /\/MBKCAD\/Webseite\//i.test(decodeURIComponent(location.pathname));
const dlHref = installiert ? "../MBKCAD_Setup.exe" : (SHOP.downloadUrl || "");
const dlKnoepfe = document.getElementById("dl-knoepfe");
if (dlHref) {
  document.querySelectorAll(".dl-link").forEach(a => { a.setAttribute("href", dlHref); a.removeAttribute("hidden"); });
  if (installiert) document.getElementById("dl-installiert").hidden = false;
} else {   // noch kein oeffentliches Setup
  document.querySelectorAll(".dl-link").forEach(a => a.remove());
  const m = encodeURIComponent("MBKCAD Beta-Zugang");
  dlKnoepfe.insertAdjacentHTML("afterbegin", `<a class="knopf primaer" href="mailto:${SHOP.kontaktMail || SHOP.feedbackMail}?subject=${m}">Beta-Zugang anfragen</a>`);
  document.getElementById("dl-hinweis").hidden = false;
}
if (window.MBK_DOWNLOAD) {   // setup-info.js schreibt installer_bauen.ps1 bei jedem Bau
  const d = window.MBK_DOWNLOAD;
  document.getElementById("dl-version").textContent = d.version;
  document.getElementById("dl-groesse").textContent = d.groesse;
  document.getElementById("dl-datum").textContent = " · Stand " + d.datum;
  document.getElementById("dl-sha").textContent = d.sha256;
  document.getElementById("dl-pruef").hidden = false;
}
