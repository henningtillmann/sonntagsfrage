# Changelog

## 2.0.3
4. Mai 2024
- Bugfix: Bei den Tendenzpfeilen gab es ein Problem. Bei der Bundestagswahl wurde als Referenz nicht die letzte Umfrage des selben Instituts verwendet, sondern die letzte Umfrage überhaupt (unabhängig von dem Institut). Eine sehr bekannte Spitzenpolitikerin hat mich auf den Fehler hingewiesen. Fehler ist nun behoben. Danke!

## 2.0.2
15. Januar 2024
- BSW-Partei hinzugefügt
- Zukünftig werden neue Parteien, auch wenn sie noch nicht im Skript vermerkt sind, angezeigt und erzeugen keinen Fehler (Farbe ist allerdings immer grau)
- Bugfix: 5 Parteien und Sonstige werden nun korrekt dargestellt (danke @Metal-Snake)

## 2.0.1
5. Januar 2022
- Bugfix: Falsches Institut / Auftraggeber bei Nicht-Bundestagswahl-Umfragen wurde angezeigt. Es wurden die Daten der vorherigen Umfrage, nicht der aktuellen angezeigt.

## 2.0.0
12. Januar 2021
- Vergleichswerte: Zeige einen Pfeil neben dem aktuellen Wert, der anzeigt, ob Ergebnis gleich/ähnlich (+/- 0,5), leicht besser/schlechter (bis zu +/- 1.5), besser/schlechter (bis zu +/. 3.0) oder stark besser/schlechter (mehr als +/- 3.0) ist. Vergleichswerte können auch deaktiviert werden.
  - Einzelumfrage Bundestag: Verwende vorherige Umfrage vom selben Institut für Vergleichswert.
  - Einzelumfrage Sonstige: Verwende vorherige Umfrage von beliebigen Institut für Vergleichswert.
  - Mittelwert Bundestag: Berechne weiteren Mittelwert für Zeitfenster gleicher Länge vor dem aktuellen Zeitfenster. In den erweiterten Einstellungen kann definiert werden, ob nur die selben Institute zur Berechnung des Vergleichsmittelwerts verwendet werden sollen. Alternativ werden auch andere Institute einbezogen.
- Zeige im Widget-Titel ein Durschnittszeichen, falls es sich um die Berechnung des Mittelwerts handelt.
- Verbesserung der Darstellung beim kleinen Widget.
- Mittleres / Großes Widget: Bei Mittelwert wird aus optischen Gründen immer eine Dezimalstelle angezeigt (16.0 statt 16).
- Standardeinstellung: Update-Zeite von 8 auf 6 Stunden verkürzt.

## 1.0.1
29. November 2020
- Verwende anderen API-Endpunkt, der kleinere Datei ausgibt.
