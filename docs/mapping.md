
# HERE Mapping – Public Routing, Sichtbarkeit & Kartenlogik

Kurze Beschreibung: Mapping-Regeln, Sichtbarkeitslogik, PublicRoute-Prüfungen und DSGVO-Konformität der HERE-Kartenansicht für Whatsgonow.

## ✅ CTO-Checkliste zur Task-Absicherung durch Lovable
Jede Zeile muss von Lovable technisch nachweislich geprüft und umgesetzt werden. Diese Liste dient als Done-Matrix, um sicherzustellen, dass alle Mapping-Komponenten, PublicRoute-Konflikte und Karten-Features korrekt funktionieren.

### 🔁 1. Routing & Public Access
| ✅ | Task |
|---|---|
| ☐ | Ist /de, / und /here-maps-demo in publicRoutes.ts korrekt eingetragen? |
| ☐ | Wird PublicRoute in MCPRouter.tsx für diese Routen korrekt verwendet? |
| ☐ | Greift isPublicRoute() vor jeder Redirect-Logik im AuthContext? |
| ☐ | Wird keine öffentliche Route mehr durch SimpleAuthContext oder AuthGuard blockiert? |
| ☐ | Sind die Lade- und Redirect-Zustände bei null-Session stabil (kein Loop, kein White Screen)? |

### 🗺️ 2. Sichtbarkeit der HERE Map auf Landing Page
| ✅ | Task |
|---|---|
| ☐ | Existiert nur eine autoritative Datei für die Landing Page mit Karte (src/components/Landing.tsx)? |
| ☐ | src/pages/Home.tsx nutzt exakt diese Datei? |
| ☐ | src/pages/Landing.tsx ist gelöscht oder synchronisiert, kein Shadowing-Konflikt? |
| ☐ | Die Karte zeigt ohne Login Mock-Daten korrekt an (nach Standortfreigabe/IP)? |
| ☐ | Auf Mobile ist das Pop-up-Verhalten korrekt (Tap, schließen mit X)? |

### 🧩 3. Funktion der Pins & Filter
| ✅ | Task |
|---|---|
| ☐ | Grüne, orange und rote Pins korrekt dargestellt gemäß currency_thresholds? |
| ☐ | Hover (Desktop) und Tap (Mobile) zeigen Pop-up mit korrekten Infos (Name, Rating, Bild etc.)? |
| ☐ | Filterkomponente zeigt kombinierbare Filter: Fahrzeug, Preis, Ziel, Zeit/Abweichung etc.? |
| ☐ | Filter funktionieren auch bei Items ohne Fahrzeugangabe? |
| ☐ | Filterlogik wurde serverseitig (API/DB) validiert (nicht nur clientseitig)? |

### 🔐 4. DSGVO & Opt-in Geolocation
| ✅ | Task |
|---|---|
| ☐ | IP-basierte Standortbestimmung ist Standard ohne Freigabe? |
| ☐ | Geolocation via navigator.geolocation nur nach Opt-in? |
| ☐ | Keine persönlichen Daten sichtbar ohne Deal-Status (z. B. kein Klarname, kein Foto)? |
| ☐ | Logging der Standortanfrage und Zustimmung erfolgt? |

### 🧪 5. Tests & Sichtprüfung
| ✅ | Task |
|---|---|
| ☐ | /de, /, /here-maps-demo funktionieren öffentlich in allen Sprachen |
| ☐ | Karte lädt korrekt mit Mock-Daten, zeigt Filter und Pins |
| ☐ | Keine Weiterleitung zur Login-Maske bei öffentlichen Routen |
| ☐ | AuthContext-Logs zeigen saubere Sessionprüfung mit Unterscheidung von PublicRoute |
| ☐ | Keine doppelten Routen-Dateien, kein Shadowing mehr in pages/ |

## Implementierungsrichtlinien

### Public Routes Konfiguration
- Alle Kartenrouten müssen in `publicRoutes.ts` gelistet sein
- `isPublicRoute()` Funktion muss vor Auth-Redirects greifen
- Sprachpräfixe müssen korrekt behandelt werden

### Map Integration
- HereMapComponent auf Landing Page zwischen HowItWorks und Benefits
- Demo-Route unter `/here-maps-demo` für erweiterte Tests
- Mock-Daten aus `mockData.ts` für konsistente Demo-Inhalte

### DSGVO Compliance
- Keine Geolocation ohne explizite Zustimmung
- Mock-Daten verwenden anonymisierte Beispielinhalte
- Logging aller Standortanfragen für Audit-Zwecke

### Filter & Interaktion
- Farbkodierte Pins basierend auf Preiskategorien
- Responsive Pop-ups für Mobile und Desktop
- Filterlogik sowohl client- als auch serverseitig validiert
