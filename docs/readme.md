# Whatsgonow – Crowd Logistics Platform

Whatsgonow ist eine innovative Crowd-Logistikplattform, die Auftraggeber und Fahrer für spontane und planbare Lieferungen zusammenbringt. Die Plattform ermöglicht dynamische Preisverhandlungen, Echtzeit-Tracking und eine gesicherte Zahlungsabwicklung über ein nutzerfreundliches Interface.

---

## 🔧 Projektstruktur

- **Frontend**: Next.js mit TailwindCSS (shadcn)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Mobile-Optimierung**: Responsive UI
- **APIs**: REST-basiert, dokumentiert in `docs/api.md`
- **Datenmodell**: Siehe `docs/db.md`
- **Roadmap**: Phasenweise Entwicklung, siehe `docs/roadmap.md`

---

## 🚀 Hauptfunktionen

- Nutzerregistrierung & Login mit Rollenverwaltung
- Auftragserstellung und intelligentes Matching
- Preisverhandlungen via Chat („Deal Mode“)
- GPS-Tracking und Statusverlauf
- Zahlung via PayPal + QR-Bestätigung
- Bewertungssystem mit Vertrauensbadges
- Community Management Tools

---

## 📂 Verzeichnisse

- `src/` – Quellcode der App (Pages, Components, Services)
- `public/` – Statische Assets (Bilder, Icons)
- `docs/` – Dokumentation (`api.md`, `db.md`, `roadmap.md`)
- `styles/` – Globale Styles (Tailwind + Custom)

---

## 🧪 Entwicklung starten

```bash
git clone https://github.com/RepeatAl/whatsgonow-ride-share-connect.git
cd whatsgonow-ride-share-connect
npm install
npm run dev
```

---

## ✅ Anforderungen

- Node.js >= 18
- Supabase Projekt mit DB-Schema (siehe `db.md`)
- GitHub Repository mit aktiviertem CI/CD
- Optional: Vercel Deployment

---

## 📄 Lizenz

MIT License – frei für private & kommerzielle Nutzung.

---

## 🤝 Kontakt

Website: [whatsgonow.com](https://whatsgonow.com)  
Kontakt: [admin@whatsgonow.com](mailto:admin@whatsgonow.com)
