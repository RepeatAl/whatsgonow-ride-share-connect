
# Nutzer-Markierung für Community Manager - Benutzerhandbuch

Dieses Handbuch erklärt, wie Community Manager das Flagging-System nutzen können, um auffällige oder kritische Nutzerkonten zu markieren und zu verwalten.

## Inhaltsverzeichnis

1. [Einführung](#einführung)
2. [Zugriff auf das CM Dashboard](#zugriff-auf-das-cm-dashboard)
3. [Nutzer markieren](#nutzer-markieren)
4. [Nutzer entmarkieren](#nutzer-entmarkieren)
5. [Flagging-Historie einsehen](#flagging-historie-einsehen)
6. [Filtern und Sortieren](#filtern-und-sortieren)
7. [Systemempfehlungen](#systemempfehlungen)
8. [Häufige Fragen](#häufige-fragen)

## Einführung

Das Flagging-System ermöglicht es Community Managern, bestimmte Nutzerkonten als "kritisch" zu markieren, um potenzielle Probleme zu kennzeichnen und die Überwachung zu verbessern. Markierte Nutzer werden im Dashboard hervorgehoben und können einfacher nachverfolgt werden.

**Wichtig:** Die Markierung eines Nutzers hat keine direkten Auswirkungen auf dessen Konto oder Nutzererfahrung. Es handelt sich um ein internes Tool für Community Manager.

## Zugriff auf das CM Dashboard

1. Melden Sie sich mit Ihrem Community Manager Account an
2. Navigieren Sie zum "Community Manager Dashboard"
3. Im Dashboard sehen Sie die Liste aller Nutzer in Ihrer Region

## Nutzer markieren

1. Finden Sie den betreffenden Nutzer in der Nutzerliste
2. Klicken Sie auf das Plus-Symbol "+" neben dem Nutzernamen, um Details anzuzeigen
3. Im erweiterten Bereich finden Sie einen Schalter zum Markieren des Nutzers
4. Bei Aktivierung des Schalters öffnet sich ein Dialog
5. Geben Sie eine **Begründung** für die Markierung ein (z.B. "Mehrfache Beschwerden", "Verdacht auf Betrug")
6. Bestätigen Sie mit "Nutzer markieren"

![Nutzer markieren](https://example.com/images/flag_user.png)

**Wichtig:** Eine Begründung ist obligatorisch und hilft anderen Community Managern, den Kontext zu verstehen.

## Nutzer entmarkieren

1. Finden Sie den markierten Nutzer in der Liste (markierte Nutzer haben eine rote Markierung)
2. Öffnen Sie die Nutzerdetails durch Klick auf das Auge-Symbol
3. Deaktivieren Sie den Schalter "Markiert"
4. Die Entmarkierung wird sofort wirksam, kein Dialog erscheint

## Flagging-Historie einsehen

1. Öffnen Sie die Nutzerdetails eines Nutzers
2. Klicken Sie auf den Button "Flagging-Verlauf anzeigen"
3. Ein Dialog öffnet sich mit dem chronologischen Verlauf aller Markierungen und Entmarkierungen
4. Jeder Eintrag zeigt:
   - Datum und Uhrzeit
   - Art der Aktion (🚩 Markierung oder ✅ Entmarkierung)
   - Name des CM, der die Aktion ausgeführt hat
   - Bei Markierungen: die angegebene Begründung

![Flagging-Historie](https://example.com/images/flag_history.png)

## Filtern und Sortieren

Das Dashboard bietet verschiedene Möglichkeiten zum Filtern und Sortieren:

1. **Filter "Nur markierte Nutzer anzeigen"**:
   - Aktivieren Sie diesen Filter, um ausschließlich markierte Nutzer zu sehen

2. **Sortierung nach Markierungsdatum**:
   - Klicken Sie auf die Spaltenüberschrift, um markierte Nutzer prioritär anzuzeigen

## Systemempfehlungen

Das System kann automatisch Empfehlungen zur Markierung von Nutzern geben:

1. **Nutzer mit kritischem Trust Score**:
   - Nutzer mit einem Trust Score unter 50 werden automatisch mit einem gelben Warndreieck markiert
   - Dies ist nur eine Empfehlung, keine automatische Markierung

2. **Nutzer mit drastischem Vertrauensverlust**:
   - Wenn der Trust Score eines Nutzers kürzlich stark gesunken ist, erscheint ebenfalls eine Warnung
   - Prüfen Sie in solchen Fällen den Vertrauensverlauf durch Klick auf "Vertrauensverlauf"

## Häufige Fragen

**F: Kann ein Nutzer sehen, dass er markiert wurde?**  
A: Nein, die Markierung ist nur für Community Manager und Admins sichtbar.

**F: Soll ich jeden Nutzer mit kritischem Trust Score markieren?**  
A: Nicht unbedingt. Die Markierung sollte auf Ihrer Einschätzung basieren. Der Trust Score ist nur ein Indikator.

**F: Was passiert mit markierten Nutzern?**  
A: Markierte Nutzer werden im System hervorgehoben und können leichter überwacht werden. In Phase 6 wird es ein Eskalationsverfahren für wiederholt markierte Nutzer geben.

**F: Wer kann die Flagging-Historie einsehen?**  
A: Alle Community Manager, Admins und Super-Admins können die vollständige Historie einsehen.

**F: Werden gelöschte Markierungen auch protokolliert?**  
A: Ja, sowohl Markierungen als auch Entmarkierungen werden in der Historie gespeichert und bleiben auch nach Löschung des Flags sichtbar.
