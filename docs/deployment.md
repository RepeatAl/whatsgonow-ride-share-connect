
# Deployment Strategy – Whatsgonow

Dieses Dokument beschreibt die geplante Deployment-Strategie für die Crowd-Logistikplattform Whatsgonow. Ziel ist ein sicheres, automatisiertes und skalierbares Ausrollen der Anwendung in der Cloud, beginnend mit dem MVP und erweitert im Rahmen der Post-MVP-Roadmap.

---

## 1. Hosting-Infrastruktur

**Primärplattform:** Amazon Web Services (AWS)  
**Region:** `eu-central-1` (Frankfurt)

**Verwendete Dienste:**
- **Elastic Beanstalk (Node.js Umgebung)** – für die Bereitstellung des Frontends
- **S3 + CloudFront** – für statische Assets und schnelle Auslieferung
- **RDS (PostgreSQL)** – relationale Datenbank (Alternative: Supabase Hosting)
- **Route 53** – Domainmanagement (`whatsgonow.com`)
- **IAM & Secrets Manager** – Zugriffssteuerung, Tokens, Secrets

---

## 2. Deployment-Stufen

| Stage      | Beschreibung                                 | URL                           |
|------------|----------------------------------------------|--------------------------------|
| **Dev**    | Interne Tests, neue Features                 | dev.whatsgonow.com            |
| **Staging**| Feature-Freeze, QS-Tests, Pre-Launch         | staging.whatsgonow.com        |
| **Prod**   | Live-System für Endnutzer                    | www.whatsgonow.com            |

---

## 3. CI/CD Pipeline

**Genutzt wird GitHub Actions + AWS CodePipeline**

### Schritte:
1. **Push auf `main`** → Trigger für Build & Tests
2. **Linting / Type Checking** (z. B. ESLint, TypeScript)
3. **Build** (Next.js oder Vite Build)
4. **Deployment zu Elastic Beanstalk**
5. **Slack/Discord-Notification** bei Erfolg oder Fehler

---

## 4. Secrets & Umgebungsvariablen

Umgebungsvariablen werden **nicht im Code gespeichert**, sondern:
- lokal in `.env` Dateien für Dev
- über Elastic Beanstalk Environment Config für Prod/Staging
- verwaltet in AWS Secrets Manager

Beispiele:
```env
SUPABASE_URL=https://xyz.supabase.co  
SUPABASE_ANON_KEY=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
```

---

## 5. Rollback & Recovery

- **Blue/Green Deployment** optional für Production
- **Snapshot-basiertes Backup** der Datenbank täglich (RDS)
- Monitoring via Supabase + UptimeRobot

---

## 6. Monitoring & Logging

- **Supabase Performance Monitoring**
- **AWS CloudWatch** (optional)
- **Custom Logs per Endpoint**
- Ladezeiten-Ziel: < 1.5 Sekunden

---

## 7. DSGVO & rechtliche Anforderungen

- Hosting in der EU (Frankfurt)
- TLS-Verschlüsselung bei allen Verbindungen
- Log- und Metrikdaten DSGVO-konform gespeichert
- automatische Datenlöschung nach Inaktivität (geplant via Supabase RLS)

---

## 8. Weiterentwicklung

In Phase 7 („Go Beyond") folgt:
- Containerisierung mit Docker
- Migration zu Kubernetes (EKS)
- Infrastruktur als Code (Terraform/CloudFormation)

---

## 9. Dependency Management & CI/CD

### 9.1 Package-Validierung

- Automatische Prüfung der Synchronisation zwischen `package.json` und `package-lock.json` via GitHub Actions
- Pre-Commit-Hooks mit Husky und lint-staged zur Validierung von Änderungen
- Post-Merge-Hook für automatische Dependency-Installation bei package.json-Änderungen

### 9.2 Dependabot-Integration

- Wöchentliche Prüfung auf Aktualisierungen von npm-Paketen
- Automatische Pull Requests für Paket-Updates
- Gruppierung von Updates, um die Anzahl der PRs zu reduzieren

### 9.3 Best Practices

- Verwende `npm ci` in CI/CD-Umgebungen für reproduzierbare Builds
- Validiere immer die Synchronität von package.json und package-lock.json
- Integriere Sicherheitschecks für Abhängigkeiten in den CI-Workflow
