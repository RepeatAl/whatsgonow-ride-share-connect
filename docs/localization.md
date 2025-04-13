# Localization & Internationalization

Diese Datei beschreibt das Lokalisierungskonzept für die Whatsgonow-Plattform. Ziel ist es, das Produkt für verschiedene Märkte sprachlich und kulturell zugänglich zu machen.

---

## 🌍 Unterstützte Sprachen im MVP

- Deutsch (de)
- Englisch (en)

---

## 📁 Sprachressourcen

Alle Texte sind ausgelagert in JSON-Dateien nach folgendem Schema:

```json
{
  "login": {
    "title": "Anmeldung",
    "email": "E-Mail-Adresse",
    "password": "Passwort",
    "submit": "Einloggen"
  }
}
```

Diese Dateien liegen in `/locales/{lang}/translation.json`.

---

## 🌐 Technischer Ansatz

- Verwendung von [i18next](https://www.i18next.com/) mit `react-i18next` Integration
- Sprache wird anhand der Browsersprache erkannt (Fallback: `de`)
- Dynamisches Nachladen von Sprachdateien bei Routenwechsel
- Unterstützung für Pluralisierung, Formatierung, Platzhalter

---

## 🧪 Teststrategie

- Manuelle Tests in deutscher und englischer Oberfläche
- Unit-Tests für Sprachumschaltung
- Cypress-Tests mit Sprachumschaltung über UI

---

## 📌 To-Do für Post-MVP

- Unterstützung für weitere Sprachen (z. B. Polnisch, Französisch, Spanisch)
- Übersetzung von E-Mails und Push-Nachrichten
- Kontextuelle Übersetzung von Systemtexten basierend auf User-Rolle

