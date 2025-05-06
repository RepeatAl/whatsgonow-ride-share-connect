
# Authentifizierung und Autorisierung

Diese Dokumentation beschreibt die Authentifizierungs- und Autorisierungskonzepte in der Anwendung.

## Überblick
Die Anwendung nutzt Supabase für die Authentifizierung mit JWT-Token-basiertem Ansatz. Die Autorisierung erfolgt rollenbasiert.

## Authentifizierung
- Nutzerverwaltung über Supabase Auth
- Token-Handling über `supabase.auth.getSession()` und `onAuthStateChange`
- Session-Management im AuthContext

## Voranmeldeprozess
Die Voranmeldung (Pre-Registration) erlaubt Nutzern, Interesse an verschiedenen Rollen anzumelden:
- Fahrer (wants_driver)
- Community Manager (wants_cm)
- Sender (wants_sender)

Der Prozess umfasst:
1. Erfassung persönlicher Daten
2. Rollenauswahl
3. Fahrzeugtyp-Auswahl (für Fahrer)
4. DSGVO-Einwilligung
5. Bestätigungsseite nach erfolgreicher Anmeldung

## Öffentliche vs. geschützte Routen
- Öffentliche Routen (z.B. Login, Registrierung, Voranmeldung) sind ohne Authentifizierung zugänglich
- Geschützte Routen erfordern eine gültige Authentifizierung
- Die Routenkonfiguration in `routes.tsx` definiert den Zugriff mittels `public` und `protected` Flags
