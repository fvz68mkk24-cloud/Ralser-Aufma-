# Ralser Aufmaß – Version 8

Diese Version basiert auf dem unveränderten GitHub-Stand `2052c0ce201316c611a74c01e10cb1bce88b1ef1` (Version 7). Die ursprüngliche HTML-Datei liegt als `index.v7.original.html` bei.

## Funktionen

- Kunden und getrennte Bauvorhaben. Nummerierung je Bauvorhaben; Positionsbuchstaben direkt eingeben, z. B. 1a.
- Alte Aufmaße zunächst unter „Altbestand – Bauvorhaben zuordnen“. Aufmaß öffnen und über „Aufmaß zuordnen“ einem neuen Bauvorhaben zuweisen.
- Alle sechs Originalmessungen bleiben gespeichert. Fertigmaße werden separat aus der kleinsten der jeweils drei Messungen berechnet; unvollständige oder ungültige Werte ergeben keinen Fertigwert.
- Innentür-Höhe: Boden verlegt 3 mm, Holzboden geplant 17 mm, Vinyl geplant 7 mm oder benutzerdefinierter Gesamtabzug. Bei Altbeständen ohne Bodenaufbau bleibt die Fertighöhe offen, bis der Bodenaufbau gewählt wird.
- Pfostenstock-Breite: 3 mm Abzug; bei anderen Türarten kein automatischer Breitenabzug.
- Haustür-Höhe: immer 3 mm Abzug, Messbezug Thermoholz.
- A4-Einzelblatt des geöffneten Formulars mit leerem Skizzenfeld. A4-Gesamttabelle quer der gespeicherten Aufmaße des ausgewählten Bauvorhabens. Alle sechs Originalmessungen in beiden Ausgaben.
- Druckdialog zum Speichern als PDF. A4 hoch / A4 quer werden per Druckstil vorgegeben; je nach Gerät im Druckdialog kontrollieren. Sehr lange Bemerkungen können zusätzliche Seiten beanspruchen.
- Keine externen Bibliotheken, Schriftarten oder Netzwerkdienste. Offline nach einmaligem vollständigem Laden über HTTPS (oder localhost).

## Sicherer Wechsel auf dem iPhone

1. In der bisherigen App „Sicherung exportieren“ wählen und die JSON-Datei in Dateien oder Dropbox ablegen.
2. Die vorhandene App und ihre Browserdaten vorerst behalten.
3. Version 8 unter derselben bisherigen HTTPS-Adresse veröffentlichen. Für das Update die bisherige App und ihre Tabs schließen, danach online neu öffnen; eventuell erneut schließen und öffnen, bis V8 im Kopf erscheint. Neue Offline-Dateien aktivieren erst nach Schließen der alten App.
4. Bei gleicher Browser-Datenablage wird Version 7 automatisch übernommen. Die App behält `ralser_aufmasse` unverändert und legt zusätzlich `ralser_v7_original_backup` sowie die neue Ablage `ralser_aufmass_v8` an.
5. Falls die Aufmaße fehlen (z. B. andere Adresse, anderer Browser oder separate iPhone-App-Ablage), die JSON-Sicherung importieren. Vorhandene Aufmaße bleiben erhalten; abweichende Einträge mit gleicher Kennung werden zusätzlich abgelegt.
6. Kunden, Anzahl der Aufmaße und sämtliche sechs Messungen stichprobenartig vergleichen, Bauvorhaben zuordnen und eine neue V8-Sicherung exportieren. Danach im Flugmodus neu öffnen und ein Testaufmaß prüfen.
7. Alte iPhone-Versionen erst nach diesem erfolgreichen Vergleich und einer extern abgelegten Sicherung entfernen. Das Entfernen einer Web-App oder von Browserdaten kann lokale Daten betreffen. Die neue Version ersetzt kein externes Backup.

Die automatische Übernahme wurde mit Testdaten geprüft. Echte iPhone-Daten liegen diesem Arbeitsordner nicht vor; eine Übernahme dieser Daten kann erst auf dem Gerät oder anhand einer hochgeladenen Sicherung geprüft werden.

## Dateien zum Veröffentlichen

Nur `index.html`, `app.js`, `model.js`, `sw.js` und `manifest.webmanifest` gemeinsam am bestehenden Web-App-Pfad ersetzen. Das ZIP `Ralser-Aufmass-V8.zip` enthält diese fünf Dateien und diese Anleitung. Veröffentlichung ändert die lokale Datenablage nicht direkt; die Migration erfolgt erst beim Öffnen der neuen App.

## Prüfung

`node model.test.cjs` prüft Migration, Originalfelder, Höhen- und Breitenabzüge, ungültige Werte und Importkonflikte. `node browser.test.cjs` prüft die Bedienung einschließlich Migration, Zuordnung, Speicherung, PDF-Druckseiten, mobile Breite und Offline-Neustart mit Chrome und Playwright. Der Pfad zu Playwright muss auf anderen Rechnern gegebenenfalls angepasst werden.

Ein weiterer Schutz verhindert, dass ein veraltetes App-Fenster Änderungen eines anderen Fensters überschreibt. Defekte oder unbekannte Daten werden nicht durch einen leeren Bestand ersetzt; in diesem Fall bietet die App eine Rohsicherung an.

