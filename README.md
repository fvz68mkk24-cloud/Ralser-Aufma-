# Ralser Aufmaß – Version 8

Diese Version basiert auf dem unveränderten GitHub-Stand `2052c0ce201316c611a74c01e10cb1bce88b1ef1` (Version 7). Die ursprüngliche HTML-Datei liegt als `index.v7.original.html` bei.

## Funktionen

- Kunden und getrennte Bauvorhaben. Nummerierung je Bauvorhaben; Positionsbuchstaben direkt eingeben, z. B. 1a.
- Alte Aufmaße zunächst unter „Altbestand – Bauvorhaben zuordnen“. Aufmaß öffnen und über „Aufmaß zuordnen“ einem neuen Bauvorhaben zuweisen.
- Alle sechs Originalmessungen bleiben gespeichert. Bei Innentüren werden Fertigmaße aus der kleinsten der jeweils drei Messungen berechnet; bei Haustüren aus der größten Höhe und größten Breite; unvollständige oder ungültige Werte ergeben keinen Fertigwert.
- Innentür-Höhe: Boden verlegt 3 mm, Holzboden geplant 17 mm, Vinyl geplant 7 mm oder benutzerdefinierter Gesamtabzug. Bei Altbeständen ohne Bodenaufbau bleibt die Fertighöhe offen, bis der Bodenaufbau gewählt wird.
- Pfostenstock-Breite: 3 mm Abzug; bei Futterstock kein automatischer Breitenabzug.
- Haustür: größte Höhe minus 3 mm (Messbezug Thermoholz) und größte Breite minus 3 mm.
- A4-Einzelblatt des geöffneten Formulars mit leerem Skizzenfeld. A4-Gesamttabelle quer der gespeicherten Aufmaße des ausgewählten Bauvorhabens. Alle sechs Originalmessungen in beiden Ausgaben.
- Druckdialog zum Speichern als PDF. A4 hoch / A4 quer werden per Druckstil vorgegeben; je nach Gerät im Druckdialog kontrollieren. Sehr lange Bemerkungen können zusätzliche Seiten beanspruchen.
- Keine externen Bibliotheken, Schriftarten oder Netzwerkdienste. Offline nach einmaligem vollständigem Laden über HTTPS (oder localhost).

## Sicherer Wechsel auf dem iPhone

1. In der bisherigen App „Sicherung exportieren“ wählen und die JSON-Datei in Dateien oder Dropbox ablegen.
2. Die vorhandene App und ihre Browserdaten vorerst behalten.
3. Version 8 unter derselben bisherigen HTTPS-Adresse veröffentlichen. Für das Update die bisherige App und ihre Tabs schließen, danach online neu öffnen; eventuell erneut schließen und öffnen, bis V8 im Kopf erscheint. Ab Version 8.4 werden vollständig geladene Offline-Dateien auch bei offenen Fenstern aktiviert. Geöffnete Formulare werden nicht automatisch neu geladen.
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


## Druckvorschau ab Version 8.2
Einzelblatt oder Gesamttabelle öffnen zunächst eine sichtbare Vorschau mit ausgefüllten Werten. Erst anschließend öffnet „Jetzt drucken / PDF“ den Druckdialog. „Zurück zum Aufmaß“ erhält den Formularinhalt. Die Vorschau wurde mit den Haustürmaßen 2309/2308/2309 und 1479/1480/1481 geprüft: Fertigmaß ab V8.3: 2306 x 1478 mm. Eine abschließende Prüfung im iPhone-Druckdialog steht aus.

## Updates ab Version 8.4
Die neue Offline-Version aktiviert sich nach erfolgreichem Download aller App-Dateien, auch wenn ein altes Fenster offen ist. Geöffnete Formulare bleiben unverändert, bis die App bewusst neu geöffnet wird. Der Button „App aktualisieren“ sucht nach Updates; nach dem Download heißt er „Neue Version öffnen“. Vor dem Öffnen bitte Änderungen speichern. Keine Browserdaten löschen. Der Update-Test `node update.test.cjs` prüft den Wechsel von V8.1 mit offenem Fenster, unveränderte Datenablagen, einen ungespeicherten Entwurf und einen Offline-Neustart.
