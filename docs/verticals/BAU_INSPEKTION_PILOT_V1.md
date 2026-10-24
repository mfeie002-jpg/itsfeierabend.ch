# Bau-/Inspektions-KMU AI Playbook — Schadstoffcheck Pilot v1

**Stand:** 23.10.2026 | **Status:** VORBEREITUNG / BETRIEBLICH PARKIERT.  
**Referenzbetrieb:** schadstoffcheck.ch; potenzieller erster *externer* Methodenpilot.  
**Wichtige aktuelle Scope-Grenze:** Asana-Status vom 10.10.2026: keine laufende Transformationszusammenarbeit, nur tatsächlich vereinbarte Einsätze auf Abruf. **Keine Aufzeichnung, Systemzugriffe, Akquise oder Datensammlung ohne ausdrückliche Vereinbarung mit Giuseppe.** Zielbild und bestehende Unterlagen sind nicht gleich ein aktiver Kundenauftrag.

## 1. Ziel des Pilots

Die **universelle ITSFeierabend-Transformationsmethode** bei einem echten inhabergeführten Bau-/Inspektions-KMU testen, nicht nur ein einzelnes Tool installieren. Erfassungsregel: *So vollständig wie sinnvoll, aber geordnet, zweckgebunden und zugelassen.* Dazu zählen Auslöser, Systeme, Entscheidungen, Ausnahmen, Fachprüfung, Datenflüsse, Abhängigkeiten, Kosten und echte Zeiten.

**Goldstandard-Ergebnis:** bestätigte Process Cards, Versionen, Baseline, kontrollierte Automationen, Shadow-Mode-Abweichungen, fachlich akzeptierte Resultate, nachher gemessene KPIs, Kundenfreigabe, Bau-KMU Case Study und Branchen-Playbook.

## 2. Domänenannahmen, vor Aufnahme zu validieren

Die folgende Prozessbibliothek beschreibt **mögliche** Abläufe eines Bau-/Inspektionsdienstleisters. Sie ist **keine Behauptung**, Giuseppe nutze genau diese Programme, Mengen oder Regeln.

| ID | Möglicher Prozess | Trigger → Output | Standardisierbarer Abschnitt | Human Gate |
|---|---|---|---|---|
| B01 | Anfrageannahme | E-Mail/Telefon/Formular → Dossier/Owner | Daten extrahieren / fehlende Angaben flaggen | Kundenkommunikation |
| B02 | Objekt-/Adressdaten | Anfrage → geprüfter Objektkontext | öffentliches Objektwissen strukturiert zusammentragen | Fachinterpretation |
| B03 | Angebot/Triage | Leistungswunsch → Offertenvorlage | Bausteine, Pflichtangaben, Kalkulationsfelder | Preis/Leistungszusage |
| B04 | Termin-/Einsatzplanung | Auftrag → bestätigter Termin | Kalenderabgleich, Zeitfenster | Mitarbeiter-/Kundenzusage |
| B05 | Unterlagenbeschaffung | Objekt → Dokumentenpaket | Checkliste, Dossierordnung | Daten- und Quellenqualität |
| B06 | Orts-/Fotoprotokoll | Besichtigung → geordnetes Evidenzregister | Dateibenennung, Vollständigkeit | tatsächliche Vor-Ort-Beobachtung |
| B07 | Probenkette | Entnahme → Laborkette / Nachweis | Formularvorbereitung, Tracking | Fach-/Laborfreigabe |
| B08 | Berichtserstellung | bestätigte Befunde → Berichtsentwurf | Felder, Vorlagen, Quellen und Versionen | qualifizierte fachliche Freigabe |
| B09 | Bericht-QA | Entwurf → geprüfter Bericht | Pflichtfelder, Nachweise, Inkonsistenzen | Endunterzeichnung |
| B10 | Kundenauslieferung | freigegebener Bericht → Versand | Zustell- und Versionierungscheck | verbindliche Auslieferung |
| B11 | Rechnung | Abnahme → Rechnungsvorschlag | Positionen und Zuordnung vorbereiten | finanzielle Freigabe |
| B12 | Mahnung/Follow-up | fällige Aktion → Aufgabe/Vorlage | Termin- und Statushinweise | Tonalität/extern |
| B13 | Lieferanten/Labor | benötigte Dienstleistung → Bestellung/Resultat | Aufgaben und Fristen | externes Labor / Budget |
| B14 | Wissensbibliothek | neuer Sonderfall → geprüfte SOP | anonymisierte Muster / Checklisten | Fach-Owner genehmigt |
| B15 | Vertretbarkeit | Abwesenheit → geordnete Übergabe | Prozessstatus, zuständiger Owner | Zugriffsberechtigung |
| B16 | Management-Reporting | abgeschlossene Fälle → KPI-Blatt | aggregierte Kennzahlen | Abnahme / Datenschutz |

**Keine autonome Entscheidung** über Schadstoffrisiken, Asbestbefunde, Probeninterpretation, Schutzmassnahmen, rechtliche Pflicht oder fachlich verbindliche Berichte. Ein qualifizierter Mensch ist fachlich verantwortlich.

## 3. Aufnahme- und Datenschutzstandard

**Vor dem ersten konkreten Einsatz:** kurzer Scopevertrag, welche Tätigkeit beobachtet werden darf, Mitarbeitenden-/Kundeninformationen, Aufzeichnungsfreigabe, Speicherung, Aufbewahrungsfrist, Datenminimierung, fachliche Zuständigkeit, Veröffentlichung von Case/Namen getrennt regeln.

Für jede tatsächlich beobachtete Tätigkeit:
1. Prozess-ID und Falltyp erfassen, Start- und Endzustand notieren.
2. Bildschirm/Ablauf nur nach vorheriger Freigabe aufzeichnen; passwortgeschützte/nicht erforderliche Daten maskieren.
3. Think-aloud: **warum** Schritt, welche Fachregel, Entscheidung, Ausnahme und möglicher Fehler?
4. Systeme, Datenquellen, Vorlagen, Kopieren, Übergaben, Rückfragen und Wartezeiten dokumentieren.
5. Aktive Minuten, Wartezeit, Häufigkeit und Fehlerrate mit Einheit, Zeitraum, N und Quelle messen; wo nicht zugänglich UNKNOWN.
6. Fachliche Durchsicht der Process Card und Freigabe durch Prozess-Owner.
7. Danach sichere Testfälle aus minimierten, freigegebenen Beispielen bilden und im Shadow Mode gegen menschliche Arbeit vergleichen.

Aufnahmen gehören in einen vom Kunden genehmigten privaten Speicher mit Berechtigungen, nicht in öffentliche GitHub-Issues, Chat-Prompts oder Sales-Reports.

## 4. Baseline und Startkandidaten (HYPOTHESEN)

| KPI | Definition | Ist |
|---|---|---|
| Anfrage bis erste verantwortete Reaktion | Median Stunden, Stichprobe und Messfenster dokumentieren | UNKNOWN |
| Aktive Terminvorbereitungszeit | Minuten je vergleichbarem Objekt/Einsatz | UNKNOWN |
| Berichtsentwurf | aktive Minuten zwischen bestätigtem Befund und prüffähigem Entwurf | UNKNOWN |
| Bericht-Nacharbeit | Korrekturen je fachlich überprüftem Bericht | UNKNOWN |
| Administrationszeit | Stunden/Woche aus konkretem Zeitnachweis | UNKNOWN |
| Übertragungen | manuelle Kopier-/Systemwechsel je Fall | UNKNOWN |
| Offertendauer | vollständige Anfrage bis geprüfte Offerte | UNKNOWN |
| Abrechnungslatenz | abgeschlossener Einsatz bis Fakturafreigabe | UNKNOWN |
| Auftragserfüllung | Fälle je Periode, nach Auftragsarten | UNKNOWN |

**Mögliche erste Sprintreihenfolge:** B01 Eingang/Zuordnung → B05 Dokumentendossier → B08 Berichtsvorlage, je nach echter Häufigkeit, Verfügbarkeit und fachlichem Risiko. Die tatsächliche Auswahl folgt erst auf bestätigte Prozesskarte und Baseline.

## 5. 90-Tage-Methodenpilot (nur nach Mandatsfreigabe)

| Zeitraum ab vereinbartem Start | Aktivität | Entscheidungsbeleg |
|---|---|---|
| Tage 1–14 | Observe / Baseline | Systeminventar, freigegebene Sessions, Process Cards, messbare Istwerte |
| 15–30 | Map / Prioritize | fachliche Prozesslandkarte, Risiko-, Machbarkeits- und ROI-Ranking |
| 31–60 | Build | erster begrenzter Workflow, Tests, Audit Trail, Recovery |
| 61–75 | Shadow Mode | menschliche Bearbeitung gegen KI-Vorschläge, Fehler- und Ausnahmeprotokoll |
| 76–90 | Live & Measure | fachlich freigegebener Rollout, echte Nachherdaten und Case-Paket |

Ein Einsatz auf Abruf ist **nicht** automatisch Beginn dieser Frist. 90 Tage sind eine Planungsstruktur, keine behauptete vertragliche Laufzeit.

## 6. Kundenreferenz und Bau-KMU-Vertrieb

**Case-Zulassung** erst nach belegter Implementierung, vergleichbaren Messungen und Giuseppes Freigabe für Name, Zahlen, Zitate, Fotos und Nutzung.

**Warmkontakt-Pfad:** erst fünf ausgewählte Firmen aus Giuseppes Netzwerk, individuell analysierter 4–8-seitiger Opportunity Brief, persönliches Gespräch und enger bezahlter Audit/Sprint. Kontaktdaten/Namen werden erst nach Einwilligung und konkretem Intro im CRM geführt. Keine 1'000 Kontakte kalt abarbeiten.

**Vertriebsclaim bis zum Proof:** „Wir entwickeln die Methode anhand eines Bau-/Inspektions-Referenzbetriebs. Konkrete Einsparungen werden erst nach der Umsetzung gemessen.“ **Nicht:** „Bei Schadstoffcheck haben wir X Stunden gespart“ ohne Messbeleg.
