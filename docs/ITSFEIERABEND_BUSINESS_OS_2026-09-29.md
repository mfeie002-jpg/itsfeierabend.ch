# itsfeierabend — Business OS Baseline

**Stand:** 2026-09-29  
**Status:** DRAFT / SAFE COMMERCIAL PREP — keine Merge-, Deploy-, Datenbank- oder Produktionsfreigabe  
**Kanonische Asana-Aufgabe:** `1218976882548897`  
**Dokumentationspaket:** PR #4, Branch `docs/offer-system-20260929`

## 1. Evidenzregeln

- **CONFIRMED:** durch aktuelle Asana-, Git-, Lovable- oder Quellcode-Evidenz belegt.
- **ASSUMPTION:** sinnvolle Arbeitshypothese, die Founder- oder Geschäftsevidenz benötigt.
- **UNKNOWN:** derzeit kein belastbarer Wert oder keine eindeutige Quelle.
- **CONFLICT:** aktive Quellen widersprechen sich oder eine öffentliche Aussage ist nicht durch Evidenz gedeckt.

Diese Baseline ist ein Geschäftsbetriebsmodell. Sie ändert keine Website, keine Preise, keine Datenbank, keine Berechtigungen und keine Produktion.

## 2. Aktuelle Quellenlage

| Quelle | Frischer Stand | Einordnung |
|---|---|---|
| Git `main` | `1ad59bdd8169ac911a5e04e59ebe1ed998686741` | CONFIRMED |
| Git `lovable-sync` | `dc02e6e827eaad6781d852a5ad9ec3c422badc94` | CONFIRMED |
| Lovable-Quelle | `b9b3a495107d8caee1334dedd635027dd798aad3` | CONFIRMED |
| Dokumentations-PR #4 vor diesem Dokument | `77d8d4e162b2903516586620c880e1e6a9bd13bb` | CONFIRMED |
| Source-Lineage | `main` und Lovable sind divergiert; Lovable `b9b3...` liegt 14 Commits hinter `lovable-sync` | CONFLICT |
| Supabase-Verwaltung | verknüpfte Dry-run-Identität hat zu wenig Projektmanagement-Rechte | CONFIRMED / BLOCKED |
| Lovable-Status | veröffentlicht, ready, letzter Edit 2026-09-18 | CONFIRMED |

Daraus folgt: Dokumentation und Commercial Prep können weitergehen. Ein Produktcode-Paket muss vor Umsetzung eine eindeutige Source-Lineage wählen; Merge, Publish und Berechtigungserweiterung bleiben geschützt.

## 3. Business Charter

### Identität und Rolle

- **CONFIRMED:** Die kanonische Asana-Aufgabe definiert itsfeierabend als B2B-AI-Transformation/Consulting.
- **CONFIRMED:** Das vorbereitete Offer-System positioniert itsfeierabend als AI-Transformation-Partner für Schweizer KMU mit der Methode **Record → Map → Automate → Measure → Scale**.
- **CONFLICT:** Der aktuelle Lovable-Quellstand beschreibt das Unternehmen weiterhin primär als KI-gestützte Digital-Marketing-Agentur für Schweizer Local Services mit SEO, SEA, Social Media, Brand und KI-Implementierung.
- **ASSUMPTION:** Portfoliorolle = Validierungs- und Wachstumsgeschäft, das aus internen Pilotprojekten eine wiederholbare, bezahlte Transformationsleistung entwickelt.
- **ASSUMPTION:** Geschäftsstufe = **VALIDATE**. Angebot und Pilot-Evidenz existieren; belastbare Pipeline-, Abschluss-, Delivery- und Margendaten fehlen.

### Zielkunden

- **CONFIRMED:** Die aktuelle Website adressiert Schweizer lokale Dienstleistungs-KMU.
- **ASSUMPTION:** Primärer Start-ICP sind inhabergeführte Schweizer Dienstleistungs-KMU mit wiederkehrender manueller Arbeit, mehreren Tools, langsamen Übergaben und einer klaren verantwortlichen Person.
- **ASSUMPTION:** Zweiter ICP sind KMU mit vorhandenem Marketing-/CRM-Stack, aber unklarer Attribution und fehlender Prozessautomatisierung.
- **UNKNOWN:** Branche, Unternehmensgrösse und Problemtyp mit höchster Zahlungsbereitschaft und kürzestem Sales Cycle.

### Customer Job

- **CONFIRMED:** Wiederkehrende Arbeit, Übergaben, Lead-Follow-up, Reporting und operative Abläufe sollen messbarer und kontrolliert automatisiert werden.
- **ASSUMPTION:** Kunden kaufen nicht „KI“, sondern weniger manuelle Übergaben, schnellere Bearbeitung, nachvollziehbare Entscheidungen und einen umsetzbaren Betriebsprozess.

## 4. Geschäftsmodell und Angebot

### Geplante Offer Ladder

| Stufe | Zweck | Dokumentierter Preisrahmen | Status |
|---|---|---:|---|
| Opportunity Brief | Qualifikation und Priorisierung | gratis oder CHF 290–790 | ASSUMPTION / Commercial Prep |
| AI / Automation Audit | Prozess-, Daten- und Chancenbild | CHF 2'900–9'900 | ASSUMPTION / Commercial Prep |
| Implementation Sprint | Ein produktiver Workflow | CHF 6'000–20'000 | ASSUMPTION / Commercial Prep |
| AI Operating System | Mehrere verbundene Workflows | CHF 20'000–75'000+ | ASSUMPTION / Commercial Prep |
| Continuous Improvement | Messung und Optimierung | CHF 1'500–6'000/Monat | ASSUMPTION / Commercial Prep |

- **CONFLICT:** Der aktuelle Lovable-Quellstand zeigt andere Pakete und Preise: Launch Sprint CHF 1'990, Growth Retainer ab CHF 3'900 und Scale Retainer ab CHF 6'900 plus Bonus.
- **UNKNOWN:** Welche Preisarchitektur tatsächlich verkauft, geliefert oder vom Markt akzeptiert wurde.
- **Entscheidungsregel:** Es darf nur eine aktuelle, Founder-bestätigte Preis- und Offer-Wahrheit geben, bevor neue öffentliche Copy vorbereitet oder veröffentlicht wird.

### Differenzierung

- **CONFIRMED:** Vorgesehen sind kleine, begrenzte Produktionsworkflows, klare Eigentümer, Evidenzartefakte und Human Gates.
- **ASSUMPTION:** Der glaubwürdige Vorteil ist die Kombination aus Prozessaufnahme, technischer Umsetzung, Messung und Governance auf den Systemen des Kunden.
- **UNKNOWN:** Welche Differenzierung Kunden tatsächlich als kaufentscheidend nennen.

## 5. Business Loop und Funnel

1. **Target Account:** ICP-Liste und konkretes Prozessproblem.
2. **Conversation:** Outreach, Referral, Content/SEO oder direkte Anfrage.
3. **Qualification:** Problem, Owner, Daten, Risiko, Wirtschaftlichkeit und Human Gates.
4. **Opportunity Brief:** kleinster sinnvoller Befund und klare Nicht-Automatisieren-Liste.
5. **Paid Audit:** Prozess-, Daten-, Tool- und Abhängigkeitskarte mit 90-Tage-Roadmap.
6. **Implementation Sprint:** ein begrenzter Workflow mit Acceptance-Evidenz.
7. **AI Operating System:** mehrere validierte Workflows verbinden.
8. **Retainer:** messen, reparieren, verbessern und gezielt erweitern.
9. **Evidence Loop:** akzeptierte Ergebnisse werden — nur mit Freigabe — zu Case Evidence, Referral und Expansion.

### Aktuelle Funnel-Grenzen

- **CONFIRMED:** Die öffentliche Website bietet Audit- und Call-Einstiege sowie DE/EN-Funnelrouten.
- **CONFIRMED:** Search Console zeigt bisher nur geringe Sichtbarkeit; dies ist keine Conversion- oder Pipeline-Evidenz.
- **CONFIRMED:** Semrush-Daten sind externe Marktschätzungen, nicht First-Party-Lead-Beweise.
- **UNKNOWN:** Anzahl echter Zielaccounts, Gespräche, qualifizierter Opportunities, Angebote, Abschlüsse und bezahlter Deliveries.
- **UNKNOWN:** Reaktionszeit, Sales-Cycle, Win Rate, durchschnittlicher Dealwert und Verlustgründe.

## 6. North Star und KPI-Baum

### North Star

- **ASSUMPTION:** **Realisierter Bruttogewinn aus abgeschlossenen, evidenzbasierten Kundenprojekten plus qualifizierte gewichtete Pipeline.**

Bis echte Kosten- und Pipeline-Daten vorliegen, ist dies eine Definition — kein gemessener Istwert.

| Ebene | KPI | Status |
|---|---|---|
| Zielmarkt | aktive ICP-Accounts / qualifizierte Kontakte | UNKNOWN |
| Nachfrage | relevante Inbound-Anfragen und Antwortquote auf Outreach | UNKNOWN |
| Qualifikation | Gespräche → qualifizierte Opportunity | UNKNOWN |
| Commercial | Opportunity → Brief/Audit-Angebot → Abschluss | UNKNOWN |
| Delivery | bezahlte Projekte gestartet/abgenommen | UNKNOWN |
| Geschwindigkeit | Tage bis Angebot, Kickoff und Acceptance | UNKNOWN |
| Ökonomie | Umsatz, direkte Stunden/Kosten, Bruttogewinn je Paket | UNKNOWN |
| Qualität | Abnahmequote, Nacharbeit, Incident-/Rollback-Rate | UNKNOWN |
| Retention | Audit→Sprint, Sprint→AI OS, Projekt→Retainer | UNKNOWN |
| Expansion | Folgeumsatz, Referral- und Case-Freigaberate | UNKNOWN |

## 7. Operating Playbook

### Wöchentlich: Go-to-Market

1. ICP-Liste nach Problem, Owner, vorhandener Datenbasis und Zahlungsfähigkeit priorisieren.
2. Pro Account nur einen konkreten Prozessengpass ansprechen.
3. Antworten und Gespräche mit einheitlichen Stufen und Verlustgründen erfassen.
4. Brief/Audit nur anbieten, wenn Owner, Source of Truth und messbares Ziel vorhanden sind.
5. Angebote mit Scope, Nicht-Scope, Daten-/Berechtigungsabhängigkeiten, Acceptance und Human Gates formulieren.

### Pro Delivery

1. Realen Workflow aufnehmen; keine Fantasieprozesse automatisieren.
2. Quellen, Eigentümer, Übergaben, Risiken und Freigaben dokumentieren.
3. Vorher-Baseline definieren, soweit belastbare Daten existieren.
4. Kleinsten produktiven Workflow implementieren und testen.
5. Acceptance-Artefakt und Owner-Handoff sichern.
6. Nachher-Evidenz erheben; fehlende Messung als UNKNOWN belassen.
7. Nur belegte Ergebnisse für Case Study oder öffentliche Claims verwenden.

### Monatlich

- Pipeline, Win/Loss, Delivery-Kapazität und Paketökonomie prüfen.
- Offene Berechtigungs-, Datenschutz- und Integrationsrisiken behandeln.
- Nur validierte Komponenten standardisieren.
- Retainer/Expansion aus akzeptierter Evidenz, nicht aus Tool-Neugier ableiten.

## 8. Aktuelle kritische Konflikte und Risiken

### P0 — Öffentliche Proof-Integrität

- **CONFLICT:** `src/config/site.ts` deaktiviert Proof-Zahlen ausdrücklich.
- **CONFLICT:** `src/pages/CaseStudiesPage.tsx` im aktuellen Lovable-Quellstand enthält gleichzeitig nicht belegte Firmennamen, Testimonials und Ergebniswerte wie Ranking-, Traffic-, ROAS-, Lead-, Conversion- und Kostenverbesserungen.
- **Auswirkung:** Vertrauens-, Marken- und potenzielles Rechtsrisiko. Die Aussagen dürfen nicht als verifizierte Kundenergebnisse behandelt werden.
- **Sicherer nächster Schritt:** exakten Live-/Source-Status der Route bestätigen, Source-Lineage reconciliieren und anschließend ein separates Removal/Replacement-Paket als Draft vorbereiten. Publish bleibt Human Gate.

### P0 — Source-Lineage

- **CONFLICT:** `main`, `lovable-sync` und Lovable zeigen unterschiedliche Stände.
- **Auswirkung:** Ein scheinbar kleiner Fix kann unbeabsichtigt andere Änderungen transportieren.
- **Regel:** Kein Code-Release, bevor Ziel-Base und exakt zu veröffentlichender Delta-Scope feststehen.

### P1 — Positionierung und Pricing

- **CONFLICT:** Aktuelle Website = Growth-/Marketing-Agentur für Local Services; neues Offer-System = AI-Transformation für breitere Schweizer KMU.
- **CONFLICT:** Aktuelle Website-Preise und vorbereitete Offer-Ladder unterscheiden sich erheblich.
- **Auswirkung:** Outreach, SEO, Calls und Angebote können verschiedene Firmen versprechen.

### P1 — Evidenz und Ökonomie

- **UNKNOWN:** echte Pipeline, abgeschlossene bezahlte Projekte, Auslastung, direkte Delivery-Kosten, Bruttogewinn und Retention.
- **Auswirkung:** Keine belastbare Skalierungs- oder Paid-Acquisition-Entscheidung.

### P1 — Supabase-Berechtigung

- **CONFIRMED:** Projektmanagementzugriff reicht für den vorgesehenen Dry-run nicht aus.
- **Regel:** Kein Direct-SQL-Bypass und keine Permission Expansion ohne exakte Founder-Freigabe.

## 9. 90-Tage-Ziel

- **ASSUMPTION:** Einen wiederholbaren, belegbaren Pfad von klar definiertem ICP-Problem über bezahlte Diagnose und begrenzte Umsetzung bis zur akzeptierten Kundenevidenz etablieren — mit bestätigter Positionierung, einer Preiswahrheit und nachvollziehbarer Projektökonomie.
- **Guardrail:** Keine erfundenen Erfolgswerte, keine ungeklärte Source-Lineage und kein Paid Spend vor belastbarer Conversion-/Delivery-Evidenz.

## 10. Maximal fünf aktive Initiativen

1. **Proof-Integrity-Correction:** unbelegte öffentliche Case Claims nach Source-Reconciliation entfernen oder durch echte Pilot-/Acceptance-Evidenz ersetzen.
2. **Positioning & Pricing Decision:** eine Founder-bestätigte Zielpositionierung, ICP-Definition und Offer-/Preisleiter festlegen.
3. **Pipeline Ledger:** Target Accounts, Gespräche, Opportunities, Angebote, Abschlüsse und Verlustgründe einheitlich erfassen.
4. **Paid Diagnostic Kit:** Opportunity Brief/Audit mit Scope, Interviewleitfaden, Evidenzschema, Deliverable und Acceptance standardisieren.
5. **Source/Permission Reconciliation:** Git/Lovable-Lineage und Supabase-Projektzugriff getrennt, ohne Bypass und mit exakten Gates klären.

## 11. Kleinster gebündelter Founder-/Geschäftsevidenzbedarf

- Eine verbindliche Wahl: **AI-Transformation für Schweizer KMU** oder **Growth-/Marketing-System für Local Services** — inklusive Übergangsregel, falls beides bleibt.
- Ein verbindlicher Primär-ICP für die nächsten 90 Tage.
- Eine aktuelle Offer-/Preisleiter; historische und öffentliche Alternativen danach als superseded markieren.
- Liste realer bezahlter/autorisiert nutzbarer Cases inklusive erlaubter Claims und Belege.
- Pipeline-/Auftragsdaten: letzte Gespräche, Angebote, Abschlüsse, Umsatz, direkte Delivery-Stunden/-kosten und offene Kapazität.

Personenbezogene oder kundensensitive Daten sollen minimiert oder pseudonymisiert werden.

## 12. Quellen

- Asana `1218976882548897` — kanonischer Business-OS-Bootstrap.
- Asana `1218797960114743` — Supabase-Projektmanagement-Blocker.
- PR #4 — Offer-System, Case-Evidence-Matrix und Semrush-Marktevidenz.
- Lovable-Projekt `ff1ee944-2315-457f-8a97-db2703924b0c`, Quelle `b9b3a495107d8caee1334dedd635027dd798aad3`.
- `src/config/site.ts`, `src/pages/HomePage.tsx`, `src/pages/PricingPage.tsx`, `src/pages/CaseStudiesPage.tsx`, `src/App.tsx`.
- Git `main@1ad59bdd8169ac911a5e04e59ebe1ed998686741`.
- Git `lovable-sync@dc02e6e827eaad6781d852a5ad9ec3c422badc94`.
