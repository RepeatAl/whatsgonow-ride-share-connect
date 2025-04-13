# Testing Strategy – Whatsgonow

Diese Datei beschreibt den vollständigen Testansatz für die Whatsgonow-Plattform, einschließlich manueller und automatisierter Tests.

---

## 🔍 1. Testarten

### ✅ Unit Tests
- Testen einzelne Funktionen oder Komponenten
- Tools: Vitest, Jest
- Beispiel: Validierung von Nutzerrollen, Matching-Algorithmen

### 🧪 Integration Tests
- Testen Zusammenspiel mehrerer Module (z. B. Deal-Flow + Zahlung)
- Tools: Playwright, Supertest (bei API)
- Beispiel: Einreichung eines Angebots + Freigabe durch den Auftraggeber

### 🧭 End-to-End (E2E) Tests
- Testen gesamte Nutzerreise
- Tools: Playwright
- Beispiel: Registrierung → Auftrag erstellen → Angebot erhalten → Zahlung → Bewertung

### 👤 Manuelle Tests
- Mobile Usability Checks
- Testfälle aus UX-Sicht (First Use, Missverständnisse, Edge Cases)
- Bug Reproduction durch Community Manager

---

## 🧷 2. Testdaten & Setup

- Supabase-Staging-Instanz
- Dummy-Nutzer mit klaren Rollen (Gast, Fahrer, Auftraggeber, Admin, CM)
- Testaufträge mit verschiedenen Gewichtungen, Regionen, Preisverhandlungen

---

## 🛠️ 3. Tools

| Tool        | Zweck                         |
|-------------|-------------------------------|
| Vitest      | Unit Testing                  |
| Playwright  | E2E Testing + Mobile Emulation|
| Supabase    | Testdaten & Auth-Provider     |
| GitHub CI   | Automatisierte Testpipelines  |

---

## 🚦 4. Automatisierte Testpipeline

1. Push auf `main` oder `release/*`
2. Linter & Type Check
3. Unit Tests
4. Integration & E2E Tests (staging)
5. Deployment (nur bei Erfolg)

---

## 🧑‍💻 5. Verantwortlichkeiten

| Rolle             | Zuständig für                              |
|-------------------|---------------------------------------------|
| Entwickler        | Unit Tests + Komponententests               |
| QA Engineer       | Integration, E2E, Regressionstests          |
| CM (Testregionen) | Manuelle Tests + Feedbackdokumentation      |
| Projektowner      | Freigabe nach Testrunden & Go-Live-Abnahme  |

---

## 🗓️ 6. Release-Qualitätsstufen

- **Alpha:** Nur Dev-Team intern, viele experimentelle Features
- **Beta:** In Testregionen mit echten Nutzern (CM Feedback aktiv)
- **Stable:** Öffentlich nutzbar, DSGVO-konform, automatisiert geprüft

---

## 🧾 7. Anmerkungen

- Alle Fehler, die in Beta-Tests entdeckt werden, erhalten GitHub-Issue-Tags mit `severity` & `module`
- Feedback von Community Managern wird dokumentiert und fließt ins nächste Release ein
