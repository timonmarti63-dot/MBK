// MBKCAD Webseite - Shop-Einstellungen. Hier (und nur hier) wird umgestellt, wenn der Verkauf startet.
// Diese Datei enthaelt KEINE Geheimnisse (nur oeffentliche Links) - sie liegt im oeffentlichen Repository.
window.MBK_SHOP = {
  vorschau: true,          // true = Banner "Provisorische Vorschau" anzeigen; vor dem Livegang auf false
  aktiv: false,            // false = Verkauf noch nicht gestartet (Knopf "Benachrichtigen lassen"); true = Kaufknoepfe aktiv
  kaufLinks: {             // Zahlungslinks je Lizenztyp (z.B. Stripe Payment Links); leer = nicht verkaeuflich
    M: "",                 // Monat (Abo)
    J: "",                 // Jahr (Abo)
    L: ""                  // Lebenslang (Einmalkauf)
  },
  downloadUrl: "",         // Link auf das signierte Setup (z.B. GitHub-Release); leer = Download noch nicht verfuegbar
  feedbackMail: "feedback@mbkcad.ch",   // PLATZHALTER - echte Adresse eintragen
  kontaktMail: "info@mbkcad.ch",        // PLATZHALTER - echte Adresse eintragen
  preisHinweis: "Preise in CHF. [MWST-Hinweis bei Verkaufsstart eintragen: «inkl. MWST» bzw. «nicht MWST-pflichtig»]"
};
