# Gastro AI Playbook — The Forge / Happy Souls Pilot v1

**Stand:** 23.10.2026 | **Status:** DISCOVERY TEMPLATE / NICHT ALS GEMESSENE CASE STUDY VERKAUFEN.  
**Vertical:** Gastronomie; **Subvertical:** Restaurant, Take-away, Foodtruck, Catering.  
**Referenzbetrieb:** The Forge und verbundene Cateringaktivitäten von Happy Souls. Dies sind historische Projektangaben; gegen den aktuellen Geschäftsbetrieb verifizieren, bevor Integrationen oder Angebotsregeln implementiert werden.

## 1. Pilotziel und echte Definition des Produkts

**Catering AI Operating Workflow** verbindet Anfrage → strukturierte Eventdaten → Offertenvorbereitung → menschliche Freigabe → Auftrag/Anzahlung → Einkauf und Produktion → Event → Rechnung → Bewertung/Wiederbuchung. Ein Use Case ist **ein Modul**, nicht der gesamte Referenzbetrieb.

**Erste 30-Tage-Entscheidung:** Welcher kleinste sichere Abschnitt liefert am meisten beobachtbaren Nutzen? Standard-Kandidat `Anfrage bis geprüfte Offertenvorlage` mit klarer Chef-Freigabe. Kein autonomes Angebot, Allergenauskunft, Zahlungsversprechen, Lagerkauf oder Mitarbeiter-Disposition ohne Zustimmung.

## 2. Bekannte Quellen versus offene Betriebsannahmen

| Information | Stand / Quelle | Freigabe vor Bau |
|---|---|---|
| The Forge betreibt Lunch-Take-away mit WhatsApp-Bestellweg | Historischer Projektkontext, Stand Oktober 2026 | Aktueller Kanal, Öffnungszeiten, Bestellmengen prüfen |
| Catering / Events werden über Happy Souls angeboten | Historischer Projektkontext | Korrekter Rechtsträger, Angebotsfreigabe, Marke, Kontaktadresse |
| Foodtruck-/Catering-Konzepte umfassen Hotdogs, Peanut Butter Chicken, Bao Buns und Crêpes | Projektbriefing, keine aktuelle Waren-/Allergenliste | aktuelle Menüs, Zutaten, Rezeptstände, Allergene, Lieferanten |
| Geeignete Event-Zielgruppe: vor allem Firmen; Privatveranstaltungen ab etwa 50 Personen | frühere Angebotsplanung | Mindestgästezahl, Kapazität, Mindestumsatz und Liefergebiet bestätigen |
| Prozesszeiten, Conversion, Food Waste, Stundenersparnis | UNKNOWN | Originaldaten/Beobachtung; keine erfundenen Zahlen |

## 3. End-to-End Workflow-Library

| ID | Prozess / Trigger → Output | Typische Inputs (zu prüfen) | Automationsmodus | Fach-/Human Gate |
|---|---|---|---|---|
| G01 | Web/WhatsApp/E-Mail/Telefon Anfrage → kanonischer Lead | Kontakt, Eventdatum, Ort, Personen, Anlass | Extraktion / Entwurf | Datenschutzfreigabe und Lead-Owner |
| G02 | Fehlende Eventdetails → Rückfragen-Entwurf | Menüinteresse, Budget, Serviceart, Zeiten | Assistiert; freigegebene Regeln | Freigabe bei verbindlichen Zusagen |
| G03 | Gäste-/Portionsbedarf → Rechenblatt | Personen, Menü, Portionsregeln, Reserve | Deterministisch | Küchenchef bestätigt Portionen |
| G04 | Offerte → prüffähiges PDF/CRM-Angebot | Kalkulation, Zuschläge, Steuern, Lieferung | Vorbereiten | Geschäfts-/Preisfreigabe |
| G05 | Follow-up → Aufgaben und Entwürfe | offene Angebote, Fälligkeiten, Kanäle | Assistiert | Eskalation/Versandregeln |
| G06 | Event angenommen → Auftrag/Anzahlung | Angebot, AGB, Rechnungsadresse | Dokumententwurf | Verträge und Zahlung menschlich freigeben |
| G07 | Allergene/Sonderwünsche → geprüfte Spezifikation | Rezeptversion, Lieferantenangaben, Gästewünsche | Referenz-/Prüfassistenz | **Fachfreigabe Pflicht** |
| G08 | Menü → Einkaufsliste | freigegebene Rezepte, Gäste, Lager, Packungen | Deterministisch | Bestellung/ Budget human gate |
| G09 | Lager → Bedarf/Abweichung | Bestände, Chargen, Verfall, Ein-/Ausgang | Datenabgleich | Keine erfundenen Mengen |
| G10 | Einkauf → Lieferanten-Entwürfe | Preise, Mindestmengen, Termine | Assistiert | Einkaufsfreigabe |
| G11 | Küchenproduktion → Arbeits-/Zeitplan | Portionen, Geräte, Team, Vorlauf | Entwurf | Küchen-/Schichtfreigabe |
| G12 | Event → Aufbau/Transport-Check | Ort, Zufahrt, Geräte, Personal | Checklisten | Einsatzverantwortlicher |
| G13 | Eventabschluss → Rechnung/Belege | bestätigte Leistung, Zusatzkosten, Anzahlung | Rechnungsentwurf | finanzielle Freigabe |
| G14 | Zufriedenheit → Review-Anfrage | ausdrückliche Kundenerlaubnis, Kanal | freigegebene Vorlagen | DSG/Opt-out |
| G15 | Folgeevent → personalisierte Erinnerung | historische Aufträge und gültige Einwilligung | CRM-Aufgabe | Marketing-Freigabe |
| G16 | Marketing-Assets → Post/Bildentwurf | nur freigegebene Produkte/Fotos/Marke | Vorbereiten | Bild-/Rechte-/Faktenprüfung |

**Nicht automatisieren ohne fachlich bestätigte Regeln:** Allergenzuordnung, Lebensmittelsicherheit, verbindliche Preisfreigaben, Mitarbeitereinsatzentscheidungen, finanzielle Transaktionen und Löschung personenbezogener Daten.

## 4. Pilot-Aufnahme in der Praxis

- `process_id`, Variante (Lunch/Corporate-Catering/privates Event), Kanal, Start/Ende, Fall-ID, Zuständiger.
- Bei jedem Schritt: Live-Screen/Erklärung, warum entschieden wird, normale Regeln, Ausnahmen, Datenquellen, Medienbruch, Wiederholung, Kundenkontakt.
- Freigegebenen Musterfall von Anfrage bis Nachbearbeitung **mit allen beteiligten Rollen** rekonstruieren; keine privaten Kundennachrichten im öffentlichen Repository.
- Aktive Arbeitszeit separat von Wartezeit; bei fehlenden Zeitstempeln `UNKNOWN`.
- Vor Einführung vereinbarte Beispielzahlen, Preise, Zutaten/Allergene und Testadressen verwenden; nie realen Auftrag per Testbot abschicken.

## 5. KPI-Baseline-Register

| KPI | Definition | Istwert |
|---|---|---|
| Erstantwortzeit | Anfrageeingang bis erste verantwortete Antwort (Median + N) | UNKNOWN |
| Offertenerstellungszeit | aktive Minuten pro vollständiger Angebotsanfrage | UNKNOWN |
| Zeit bis geprüfte Offerte | vollständige Anfrage bis menschlicher Preisfreigabe | UNKNOWN |
| Vergessene Follow-ups | überfällige Angebote ohne Aufgabe / gültige Angebote | UNKNOWN |
| Abschlussquote | angenommene Angebote / entscheidungsreife Angebote | UNKNOWN |
| Durchschnittlicher Deckungsbeitrag | Umsatz minus direkt zurechenbare Eventkosten, je Auftrag | UNKNOWN |
| Einkaufsabweichung | geplante minus tatsächlich benötigte Mengen, mit Rezeptänderungen erklärt | UNKNOWN |
| Food Waste | gemessene entsorgte Menge relativ zur produzierten Menge | UNKNOWN |
| Produktionsplanungszeit | aktive Planung pro Event | UNKNOWN |
| Nachbetreuungsquote | berechtigt angefragte Bewertungen / geeignete abgeschlossene Events | UNKNOWN |
| Wiederbuchung | zweite Buchung pro reife Kundenkohorte, definiertes Fenster | UNKNOWN |

## 6. Erstes Umsetzungspaket (Vorschlag, kein Auftrag)

**Scope:** G01→G02→G04→G05, aber nur ein definierter Kanal (z. B. Catering-Mailbox), maximal eine Angebotsvorlage, ein approbierter menschlicher Reviewer.  
**Inputs:** 3–10 anonymisierte abgeschlossene Anfragen, Menü-/Preisstruktur, Freigaberegel, aktueller CRM-/E-Mail-Weg, 2–3 Sonderfälle.  
**Akzeptanz:** Pflichtfelder korrekt, keine Phantomallergene/Preise, fehlende Felder sichtbar, Versand ohne Freigabe blockiert, Duplikate werden erkannt, Fallback auf manuellen Ablauf funktioniert.  
**Messung:** neue aktive Minuten pro Anfrage gegen passende echte Baseline; Qualität/Fehler und Reviewer-Zeit getrennt; bei kleinem N = Pilotindikation.  
**Zweiter Sprint erst nach Befund:** Einkauf/Lager/Produktion G07–G11, wenn Datenqualität, fachliche Regeln und Budget passen.

## 7. Vertriebsreifer Branchenbeweis

Erst nach Live-Abnahme + Messung + Kundenfreigabe:
- vorherige Anfrage-/Offerten-/Planungszeit;
- welche Version tatsächlich eingeführt wurde;
- Bearbeitungszeit und Qualitätskorrekturen danach;
- echte Kosten / Kundenaufwand;
- Datenqualität, Fallmix und saisonale Einschränkungen;
- repräsentative Freigabe für Case-Nennung/Fotos/Testimonials.

**Bis dahin zulässig:** „Wir entwickeln und testen den zusammenhängenden Catering-Prozess in unserem Referenzbetrieb.“ **Nicht zulässig:** „Wir sparen jedem Restaurant X Stunden“, „100% vollautomatisch“ oder „Allergene KI-geprüft“.
