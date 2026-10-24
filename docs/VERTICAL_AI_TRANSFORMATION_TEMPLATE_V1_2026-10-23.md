# ITSFeierabend — Universal Vertical AI Transformation Template v1

**Stand:** 23. Oktober 2026  
**Status:** Interner Methodenentwurf / verwendbares Pilot-Template. Keine Behauptung über abgeschlossene Piloten, Einsparungen, Aufträge oder produktive Automationen.  
**Projekt:** itsfeierabend.ch (nicht feierabendservices.ch)  
**Methode:** Record → Map → Automate → Measure → Scale  
**Source of Truth:** Asana für operative Aufgaben; Git für Quellcode und Testbelege; bestätigte Kundenquellen für Ist-Prozesse und Resultate.

## 1. Geschäftsmaschine und Definitionsgrenzen

Referenzbetrieb → Prozesse aufnehmen → Ist-KPIs erheben → Abläufe priorisieren → Automationen bauen → Shadow Mode → kontrollierter Live-Betrieb → Vorher/Nachher messen → freigegebene Case Study → Industry Playbook → ähnliche Unternehmen öffentlich analysieren → personalisierter AI Opportunity Brief → bezahlter Audit → Automation Sprint → AI Operating System → Retainer → Library verbessern.

| Begriff | Bedeutung | Gastro-Beispiel |
|---|---|---|
| Vertical | Hauptbranche | Gastronomie |
| Subvertical | Geschäftsmodell | Take-away, Foodtruck, Catering |
| Referenzbetrieb | echte Test-/Implementierungsumgebung | The Forge |
| Case Study | dokumentiertes, belegtes Ergebnis | The-Forge-Transformation |
| Workflow | End-to-End-Geschäftsablauf | Catering-Anfrage bis Wiederbuchung |
| Use Case | einzelner Nutzen / automatisierbarer Abschnitt | Offerte aus Eventdaten vorbereiten |
| Industry Playbook | getestete Prozess-, Integrations- und Messbibliothek | Gastro AI Playbook |
| Produkt | wiederverwendbares Leistungsbündel | Gastro AI Operating System |
| Kundenkonfiguration | Regeln, Systeme und Daten des Zielkunden | Preise, Menü, Schichten, Lieferanten |

Ein technischer Release, ein Pilot oder ein Dokument ist **keine** gemessene Zeit-/Umsatzersparnis. Leistungsclaims sind nur mit überprüfbarer Baseline, Vergleich und Freigabe zulässig.

## 2. Drei wiederverwendbare Ebenen

**Core Method** (alle Kunden): Intake, Systeminventar, Process Cards, Evidenz-Taxonomie, Automationspriorisierung, Sicherheits-/Freigabe-Matrix, KPI-Baseline, Testfälle, Shadow-Mode-Protokoll, ROI, Go-live/Monitoring, Case-Study-Freigabe, Report.

**Industry Module** (pro Vertical): typische Workflow-Ketten, Branchenregeln, Datenschemas, Schnittstellen, Fachrisiken, Templates und Testbibliotheken.

**Client Configuration** (pro Betrieb): konkrete Produkte/Leistungen, Personen, Rollen, Preise, Vorlagen, Tools, Freigabegrenzen, Ausnahmen, Branding und Datenspeicher. Geheime Werte nie in öffentliche Repositories, Reports oder Prompts kopieren.

Jedes Element erhält eine Versionsnummer, Owner, Quellenbeleg, letzten Prüftermin und Gültigkeitsstatus. Ändert sich eine Quelle oder Branchenregel, wird das betroffene Playbook gezielt neu getestet.

## 3. Process Card — Pflichtschema

Für **jeden** wiederkehrenden Prozess eine Karte (unbelegte Werte bleiben `UNKNOWN`, keine Beispielzahlen in die Produktion übernehmen).

| Feld | Erfassung |
|---|---|
| process_id / version | Eindeutiger stabiler Schlüssel; Revision |
| Vertical / Subvertical / Betrieb | Geschäftsmodell, Organisation |
| Prozess / Ziel | Verständlicher Name und erwartetes Ergebnis |
| Auslöser / Ende | Ereignis, das startet; überprüfbarer Abschluss |
| Owner / Freigabe-Owner | Fachverantwortliche und zeichnungsberechtigte Person |
| Frequenz / Volumen | Fälle pro Zeitraum, Erfassungsperiode, Quelle |
| Aktive Dauer / Wartezeit | Getrennt gemessene Minuten mit Fallzahl |
| Eingänge | Daten, Kanäle, Unterlagen, Datenqualität |
| Systeme / Zugänge | Postfach, CRM, Kalender, Dateien, API etc. |
| Schrittfolge | Wer tut was, warum, in welchem System? |
| Entscheidungsregeln | Kriterien, die ein Mensch tatsächlich anwendet |
| Ausnahmen | Fehlende Daten, Sonderfälle, Eskalation |
| Ausgänge | Datensatz, Dokument, Zahlung, Nachricht oder Aufgabe |
| Manuelle Übergaben | Medienbrüche, doppelte Erfassung, Blocker |
| Fehler / Nacharbeit | Belegbare Fehlerarten und Häufigkeiten |
| Datenschutzklasse | Öffentlichkeit, intern, vertraulich, besonders schützenswert |
| Automationsmodus | Assistiert, Vorschlag mit Freigabe, vollautomatisch zulässig, nicht automatisieren |
| KPI / Baseline | Einheit, Messquelle, Zeitraum, N, Qualitätscheck |
| Zielwert | Hypothese, ausdrücklich nicht als Ergebnis darstellen |
| Testfälle / Rollback | Normalfall, Ausnahmen, Fehlermodi, Wiederherstellung |
| Status / Evidenz | OBSERVED, INFERRED, UNKNOWN, CONFLICT; Quell-ID |

Prozesskarten verlinken auf Belegmaterial; personenbezogene Originaldaten bleiben in freigegebenen Kundensystemen, nicht im öffentlichen Projekt-Git.

## 4. Aufnahmeprotokoll (Record)

1. Prozess- und Aufzeichnungsfreigabe des Unternehmens dokumentieren; Mitarbeitende informieren; private Daten, Passwörter, Gesundheits- und besonders schützenswerte Daten minimieren.
2. Rollen-/Systeminventar erstellen: Anbieter, Hostingregionen, Zugriff, Aufbewahrung, Löschen, Backup, bestehende Prozesse.
3. Reale Fälle mit Think-aloud begleiten: **Was** wird gemacht, **warum**, **wann**, **wer** entscheidet, **was** passiert bei Fehlern?
4. Für jede Session: Datum, Process ID, verantwortliche Person, freigegebener Speicherort, anonymisierte Fall-IDs, Start/Ende, Sonderfälle.
5. Arbeitszeit und Wartezeit trennen; mindestens Zeitraum, Stichprobengrösse, Messart und Quellenqualität dokumentieren.
6. Nach jeder Aufnahme eine Process Card vervollständigen und vom Fach-Owner bestätigen lassen. Fehlendes Wissen offen markieren.

Bildschirmvideos allein sind keine Prozesswahrheit. Fachliche Entscheidungen und Ausnahmen müssen zusätzlich erklärt werden.

## 5. Opportunity Scoring (Map & Prioritize)

**Workflow-Priorisierung ist NICHT der öffentliche Website-Scanner-Score.** Der Website-Scanner bleibt deterministisch und hat einen getrennten, freizugebenden Bewertungsvertrag.

Jeder Prozess wird intern auf einer dokumentierten 1–5-Skala eingeschätzt für:
- Zeit-/Werthebel (belegte Frequenz × aktive Dauer × wertschöpfende Verwendbarkeit)
- Datenverfügbarkeit und Prozessstabilität
- Standardisierbarkeit / Ausnahmeanteil
- Integrationsaufwand / Betriebskosten
- Fehlerfolgen / Datenschutz- und Fachrisiko
- notwendige menschliche Freigaben

Vor einer Rangfolge sind harte Ausschlusskriterien zu prüfen: ungeklärte Datennutzung, fehlender Owner, fehlende Fachfreigabe, unbeherrschbare Fehlerfolgen, fehlender sicherer Rückfallweg. Diese führen zu `HOLD`, nicht zu einem geschönten Gesamtscore.

Bevorzugter erster Sprint: **ein Prozess, ein Verantwortlicher, ein klarer Start-/Endpunkt, ein messbarer KPI, maximal begrenzte Integrationen.**

## 6. Baseline- und Messregister (Measure)

Pflicht pro KPI: `metric_id, process_id, cohort, unit, definition, start/end, N, source, quality, baseline, after, owner, measured_at`.

| KPI | Messregel |
|---|---|
| Bearbeitungszeit | Aktive Minuten pro vergleichbarem Fall, vorher/nachher |
| Antwortzeit | Eingang bis erste fachlich verantwortete Aktion; Zeitzonen beachten |
| Angebotsdauer | vollständige Anfrage bis fachlich geprüfte Offerte |
| Fehler/Nacharbeit | Anzahl mit definierter Fehlerklasse je N Fälle |
| Follow-up-Verlust | fällige Fälle ohne dokumentierten nächsten Schritt |
| Durchsatz | abgeschlossene vergleichbare Fälle pro Zeitraum |
| Personalbindung | gemessene Administrationsstunden pro Woche |
| Qualität | fachliche Prüf-/Korrekturquote; verbindliche Kriterien |
| Geschäftseffekt | realisierte Abschlüsse und Deckungsbeitrag nur mit Zuordnung |

Vergleich: möglichst identische Tätigkeit, Volumen, Team und Kanal, dokumentierter Zeitraum; bei kleiner Stichprobe als **Pilotindikation**, nicht als allgemeiner Durchschnitt kommunizieren.

**ROI (drei Szenarien):**
- konservativ: wirtschaftlich nutzbare Zeitersparnis und tatsächlich vermiedene Fehlerkosten, ohne doppelte Zählung;
- erwartet: zusätzlich zurechenbarer Deckungsbeitrag bei plausibler Kapazitätsnutzung;
- Potenzial: weitere freigegebene Automationen und zusätzliche Kapazität, getrennt von gemessenen Resultaten.

`Nettonutzen/Jahr = zurechenbarer Nutzen - laufende Tool-/Betriebs-/Betreuungskosten`. `Payback-Monate = einmalige Implementierungskosten / positiver monatlicher Nettonutzen` (nur bei belastbarer Grundlage). Eingesparte Zeit ist nicht automatisch zusätzliche Kassenliquidität oder Umsatz.

## 7. 90-Tage-Pilot mit Gates

| Phase | Zeitraum | Nachweis / Exit-Gate |
|---|---|---|
| Observe & Baseline | Tage 1–14 | Systeminventar, freigegebene Aufnahmen, Process Cards, KPI-Register |
| Map & Prioritize | Tage 15–30 | bestätigte Prozesslandkarte, Risiko-/ROI-Rangfolge, drei priorisierte Kandidaten |
| Build | Tage 31–60 | kleiner funktionsfähiger Workflow, Testdaten, Idempotenz, Logging, dokumentierte Freigaben |
| Shadow Mode | Tage 61–75 | KI-Vorschläge gegen menschliche Arbeit vergleichen; Fehlermuster protokollieren |
| Live & Measure | Tage 76–90 | kontrolliertes Go-live nach Fach- und Sicherheitsfreigabe, Messung, Rollback, Case-Evidence-Paket |

Dies ist ein Zielplan, **keine** Behauptung über tatsächlich gestartete oder erfüllte Phasen. In Betrieben mit eingeschränktem Zugang oder Einsätzen auf Abruf erfolgt der Start erst nach konkretem Mandat, Prozess-Owner und Datenfreigabe.

## 8. Industrie-Module v1 und Referenzsysteme

| Referenz | Vertical | Flagship-Workflow | Status der Business-Outcome-Evidenz |
|---|---|---|---|
| Schadstoffcheck.ch | Bau, Inspektion, Berichte | Anfrage → Objekt-/Terminvorbereitung → Bericht → Rechnung | Keine veröffentlichungsreife Vorher/Nachher-Messung belegt; externer Goldstandard-Pilot geplant |
| The Forge | Restaurant, Take-away, Catering | Catering Lead → Quote → Einkauf → Produktion → Event → Review/Repeat | Keine vollständige Workflow-ROI-Messung belegt |
| Feierabend Services | Umzug, Räumung, Field Service | Anfrage → Besichtigung → Offerte → Einsatz → Abnahme | Technische Einzelimplementierungen, keine branchentaugliche End-to-End-ROI-Case |
| Umzugscheck.ch | Plattform, Marktplatz, Lead-Matching | Acquisition → Anfrage → Qualification → Matching → Handover | Technische Funnel-Belege, keine allgemeine Kundenersparnis |
| reride.ch | Werkstätten, Reparatur | Anfrage → Diagnose → Kostenvoranschlag → Teile → Übergabe | Referenzsystem noch zu validieren |
| gentlehands.ch | Terminbasierte persönliche Services | Anfrage → Termin → Reminder → Leistung → Rebooking | Referenzsystem noch zu validieren |

**Gastro-Fachgate:** Allergene und verbindliche Preise werden fachlich geprüft.  
**Bau-Fachgate:** Prüfberichte und sicherheitsrelevante Feststellungen werden von qualifizierten Verantwortlichen freigegeben.  
**Allgemeine Human Gates:** Geld, Verträge, Löschungen, externe verbindliche Kommunikation und kritische Datenfreigaben.

## 9. Case Study — Evidence Package

Jede spätere veröffentlichbare Case Study benötigt:
1. Ausgangslage / Ist-Prozess mit anonymisierter Quelle;
2. Ziel und Scope;
3. genaue implementierte Änderungen (Version/PR/Release);
4. fachliche und technische Testbelege;
5. Baseline mit Zeitraum, N und Messmethode;
6. Nachher-Messung mit gleichem Definitionsvertrag;
7. Kosten und Kundenaufwand;
8. Einschränkungen und offene Fragen;
9. Freigabe von Case-Nennung, Kennzahlen, Screenshots und Testimonial durch den Kunden.

Vier Belegzustände: `VERIFIED` (Quellen), `IMPLEMENTED` (gebaut, Wirkung noch nicht belegt), `OPEN` (zu validieren), `DO NOT CLAIM` (ohne Nachweis nicht vermarkten).

## 10. AI Opportunity Brief (extern, 4–8 Seiten)

**Ziel:** ausgewählten KMU einen personalisierten, gedruckten Gesprächsanlass geben.

1. Titelseite mit Name, Datum, Analysegrenzen und klar als Schätzung markierten Potenzialen.
2. Executive Summary mit 1–3 priorisierten Chancen.
3. Branchen-Case-Study nur mit freigegebenem, konkretem Nachweis.
4. Sichtbarer Ist-Zustand: Website, Leistungen, Kontaktwege, sichtbare Funnel-Schritte, Bewertungen/Tools, soweit rechtmässig öffentlich verfügbar.
5. Opportunity Map: `VERIFIZIERT`, `ABGELEITET`, `ZU VALIDIEREN`; Quellen pro Befund.
6. Drei mögliche Startprojekte mit Voraussetzungen, menschlichem Gate, Zeit- und Preisband (keine verbindliche Offerte).
7. Konservatives/erwartetes/Potenzial-Szenario; Annahmen separat.
8. Klarer nächster Schritt: interner Audit / Discovery; persönliche Begleitung durch ITSFeierabend.

**Wichtige Grenze:** Ein externer Scan untersucht nicht das komplette Innenleben eines Betriebs. Zeiten, interne Kosten und Abläufe werden als Hypothese oder UNKNOWN ausgewiesen.

## 11. Full AI Business Transformation Blueprint (intern, 15–40 Seiten)

Nach Gespräch, Prozessaufnahme und Datenfreigabe: bestätigte Unternehmens-/Rollen-/Systemkarte, vollständige Prozesskarten, KPI-Baseline, Zugangsmatrix, Risiko-/Freigabepunkte, Integrationsdiagramm, priorisierte Roadmap (30/60/90 Tage), Scope/Leistung, Kosten, Annahmen, Mess- und Rollbackplan, kundenseitige Verantwortliche.

Die kostenlose Voranalyse verkauft den Audit. Der Audit verkauft den begrenzten Sprint. Der Sprint kann ein verbundenes AI Operating System und betreuten Betrieb begründen; keine automatische Anschlussverpflichtung.

## 12. Branchen-Playbook — Definition of Done

Ein Vertical ist vertriebsreif, wenn mindestens vorhanden:
- ein sauber eingegrenzter Referenzbetrieb mit bestätigtem Mandat;
- fachlich bestätigte Process Cards und dokumentierte Ausnahmen;
- mindestens ein live abgenommener, rücksetzbarer Workflow;
- belastbare Vorher/Nachher-KPIs oder explizit unbewiesener Outcome-Status;
- freigegebene Case Study / Demo und zulässige Claims;
- getestete Integrationen/Skills/Agents mit Versionen und Checklisten;
- standardisiertes Angebot, Kundenvorbereitung, Aufwand, Preisannahmen;
- Opportunity-Brief-Vorlage für neue, öffentlich analysierte Zielaccounts;
- Support-, Monitoring-, Datenschutz- und Freigabevertrag.

Vorher ist die Vertical-Bibliothek `DRAFT`, nicht `PROVEN`.

## 13. Unmittelbare Reihenfolge (23. Oktober 2026)

**P0 Plattform:** Laut kanonischem Asana-Status stimmt der GitHub-/Lovable-Inhalt überein, aber produktive Supabase-Migrationen/RPCs fehlen; PR3-Rate-Limit-Hardening und DB/RLS-Tests fehlen im aktuellen main. Vor einem Live-Cutover zuerst aktuelles Runtime-Contract-Reconciliation-PR, komplette CI, separater freigegebener Migrations-/Edge-/Rollback-Plan. Keine Veröffentlichung oder Migration durch dieses Dokument.

**P1 Bau-Pilot:** Schadstoffcheck als erster externer Methodenpilot, falls konkreter Einsatz, Prozessaufnahme und Freigaben vereinbart sind; zuerst Prozessinventar und Messblatt, nicht unkontrollierte «alles aufnehmen»-Datensammlung.

**P1 Gastro-Pilot:** The Forge Catering-Anfrage-bis-Wiederbuchung als End-to-End-Test, erst Baseline und Fachgates, dann Automation.

**P2 Produkt / Vertrieb:** Zwei Report-Templates, Case-Library und CRM-Routing bereitstellen; zuerst fünf warme Bau-KMU-Einführungen nach belastbarem Proof. Keine erfundenen Einsparungen, Kundenabschlüsse, Preise oder freigegebenen Testimonials.

### Qualitätscheck vor Weitergabe

- [ ] Alle Kundendaten und Beispiele anonymisiert oder freigegeben
- [ ] Jede gewichtige Aussage belegt oder als Hypothese gekennzeichnet
- [ ] Fachliche/Geld-/Lösch-/Vertragsfreigaben definiert
- [ ] Kein Website-Scanner-Score mit Workflow-Priorisierung vermischt
- [ ] Keine nicht gemessenen Outcomes in öffentlichen Claims
- [ ] Playbook-Version, Owner, Referenzbetrieb, Quelle und Messdatum vorhanden
- [ ] Datenschutz, Reversibilität und Fehlerfall dokumentiert
