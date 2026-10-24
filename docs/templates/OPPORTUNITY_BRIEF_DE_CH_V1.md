# ITSFeierabend — Personalisierter AI Opportunity Brief v1 (DE-CH)

**Zielprodukt:** aus öffentlich überprüfbaren Quellen (plus ausdrücklich freigegebenen Kundenaussagen) ein **gedrucktes Chef-Paket von 4–8 A4-Seiten** erzeugen. Quelle und Evidenzstufe bleiben prüfbar. Keine Analyse interner Abläufe vortäuschen.

**Status:** Wiederverwendbare Druck-/Engine-Vorlage, noch **keine freigegebene Kunden-Case-Study**. `{{...}}` sind Pflichtplatzhalter oder unterdrückbare Sektionen, **keine Daten**. Endgültige PDF-Layout- und Versandfreigabe separat.

### Pflicht-Metadaten und Qualitätsschleuse
- Bericht-ID/Version: `{{report_id}}` / `{{schema_version}}`.
- Zielunternehmen: `{{verified_company_name}}`, Website `{{website_url}}`, Branche / Subvertical `{{vertical}}` / `{{subvertical}}`, Region `{{region_or_UNKNOWN}}`.
- Analysezeitraum `{{observed_from}}` bis `{{observed_to}}`; erstellt `{{generated_at}}`; geprüft `{{reviewer}}`.
- Quellenliste `{{source_registry}}` (URL/Archiv-ID, Titel, Abrufdatum, erlaubte Nutzung, Fundstelle, Qualität).
- Jede Erkenntnis: `VERIFIZIERT`, `ABGELEITET`, `ZU VALIDIEREN` oder `NICHT VERFÜGBAR`; keine leeren Quellen bei `VERIFIZIERT`.
- Jede Zeit-/Kosten-/Nutzenzahl hat Einheit, Zeitraum, Annahme, Rechenweg und Szenario; wenn nicht belegbar: **nicht als Zahl anzeigen**.
- Keine vertraulichen Kontaktdaten, privaten Bewertungsprofile, Report-Token oder unfreigegebenen Kundenzitate im Druck.
- Personalisiertes Briefing enthält **keine** Behauptung, man habe interne Prozesse vollständig geprüft.

---

## SEITE 1 — Titelseite und Executive Brief

**KI-POTENZIALANALYSE FÜR {{company_name}}**

*Ihr persönlicher KI-Partner für nachvollziehbare, messbare Verbesserungen.*

**Unsere vorläufige Einschätzung:** `{{summary_3_sentences}}`.

**Drei erste Chancen** (nur belegt oder explizit als Hypothese):
1. `{{priority_1_title}}` — `{{why_it_matters}}`
2. `{{priority_2_title}}` — `{{why_it_matters}}`
3. `{{priority_3_title}}` — `{{why_it_matters}}`

**Potenzial-Aussage:** `{{conservative_value_band_or_no_estimate}}` `{{unit_period}}`. Wenn nur hypothetisch: *Modellrechnung, noch keine gemessene Einsparung*. Bei unbrauchbarer Baseline keine fingierten Stunden oder Prozentsätze.

**Startempfehlung:** `{{first_bounded_workflow}}` (unter Vorbehalt bestätigter Daten/Systeme/Owner).  
**Was wir von Ihnen brauchen:** `{{initial_customer_inputs}}`.  
**Nächste Entscheidung:** `{{discovery_or_paid_audit}}`.

*Diese Voranalyse basiert auf öffentlich sichtbaren Informationen vom {{date}}. Interne Arbeitszeiten, Kosten, Zugriffe und Ausnahmefälle müssen wir im Gespräch validieren.*

## SEITE 2 — Wie wir Ihr Geschäft von aussen erleben

**Verifizierte öffentliche Kundenreise:** `{{observed_customer_journey}}` mit URLs/Belegen.

| Station | Sichtbares Signal / konkrete Quelle | Einstufung | Mögliche Folge |
|---|---|---|---|
| Gefunden werden | `{{discovery_source}}` | `{{evidence_state}}` | `{{effect_not_assumed}}` |
| Kontakt / Anfrage | `{{contact_source}}` | `{{evidence_state}}` | `{{...}}` |
| Termin / Bestellung / Offerte | `{{transaction_source}}` | `{{evidence_state}}` | `{{...}}` |
| Nachbetreuung | `{{followup_source}}` | `{{evidence_state}}` | `{{...}}` |

**Wichtig:** Ein nicht sichtbarer Prozess ist nicht automatisch ein *fehlender* Prozess. Kennzeichnung `ZU VALIDIEREN` statt Negativbehauptung.

**Drei konkrete Beobachtungen:** `{{findings_with_evidence_ids}}`.

## SEITE 3 — Branchenbeweis, ohne Erfolgsfantasie

**Vergleichbarer Referenzbetrieb:** `{{case_study_name_or_demo_disclosure}}` · `{{vertical_match}}`.

**Vorher:** `{{verified_baseline_or_unknown}}`.  
**Umgesetzt:** `{{actual_versioned_implementation}}`.  
**Nachher:** `{{measured_results_or_not_measured}}`.  
**Kundenaufwand:** `{{measured_effort_or_unknown}}`.  
**Grenzen:** `{{differences_and_confounds}}`.  
**Quelle / Freigabe:** `{{case_evidence_id}}` / `{{public_release_approval}}`.

**Darstellungsregel:** Ein nicht abgeschlossenes Referenzprojekt erscheint als *Pilot/Implementierungsbeispiel* und **niemals** als bewiesenes Einsparungsbeispiel. Ohne freigegebene Referenz: Methode anhand eines eindeutig bezeichneten DEMOS zeigen oder diesen Abschnitt durch das Vorgehensmodell ersetzen.

## SEITE 4 — Ihre AI Opportunity Map

| Prio | Prozess / Hypothese | Sichtbarer Beleg | Noch zu prüfen | Nutzenart | Risiko | Aufwand |
|---|---|---|---|---|---|---|
| 1 | `{{opportunity_1}}` | `{{evidence_ids}}` | `{{unknowns}}` | `{{time_or_quality}}` | `{{risk}}` | `{{effort_band}}` |
| 2 | `{{opportunity_2}}` | `{{evidence_ids}}` | `{{unknowns}}` | `{{...}}` | `{{...}}` | `{{...}}` |
| 3 | `{{opportunity_3}}` | `{{evidence_ids}}` | `{{unknowns}}` | `{{...}}` | `{{...}}` | `{{...}}` |

**Was nicht autonom werden sollte:** `{{human_approval_and_do_not_automate}}`.  
**Daten-/Sicherheitsfragen:** `{{private_data_access_and_unknowns}}`.

## SEITE 5 — Drei Startprojekte

Für **jedes** Startprojekt (maximal drei, nach Priorität):

**{{project_n_name}}**
- **Heute sichtbar / vermutet:** `{{current_state_and_source_or_qualifier}}`
- **Zielprozess:** `{{step_by_step_future_workflow}}`
- **Integrationen / Daten:** `{{tools_data_assumptions}}`
- **Menschliche Entscheidungen:** `{{approval_owners}}`
- **Definition of Done:** `{{measurable_acceptance_condition}}`
- **Einstieg und Zeitraum:** `{{time_range_as_estimate}}`, abhängig von `{{dependencies}}`
- **Investitionsrahmen:** `{{indicative_chf_range_or_quote_pending}}` (keine verbindliche Offerte)
- **Ihr Aufwand:** `{{customer_effort_scope}}`

## SEITE 6 — 30-/60-/90-Tage-Umsetzungsplan

| Zeitpunkt | ITSFeierabend macht | Kunde bestätigt | Nachweis |
|---|---|---|---|
| 0–30 | Record → Map → Baseline → erster Sprint-Scope | Prozess-/Dateneigner, Zugriff, Priorität | bestätigte Process Cards und KPI-Baseline |
| 31–60 | Automationsbau und Shadow Mode | Entscheidungen, Ausnahmefälle, Abnahme | Test-/Abweichungsprotokoll |
| 61–90 | Kontrollierte Einführung und Messung | Fachfreigabe und Feedback | erste Vergleichsmessung, Monitoring, Rückfallplan |

*Beispiel-Roadmap, kein zugesicherter Termin ohne geklärte Voraussetzungen.*

## SEITE 7 — Business Case, transparent gerechnet

| Szenario | Nutzenbasis | Jährlicher Nutzen | Laufende Kosten | Ergebnis |
|---|---|---|---|---|
| Konservativ | belegbar nutzbare Zeit und vermiedene Fehler | `{{value_or_unknown}}` | `{{running_costs}}` | `{{net_or_not_calculable}}` |
| Erwartet | konservativ plus zuordenbarer Deckungsbeitrag | `{{value_or_unknown}}` | `{{running_costs}}` | `{{net_or_not_calculable}}` |
| Potenzial | zusätzliche genehmigte Prozesse/Kapazität | `{{illustrative_only}}` | `{{running_costs}}` | `{{not_a_promise}}` |

Formel mit geprüften Grössen: `wirtschaftlich nutzbare Stunden × Vollkosten pro Stunde` plus **inkrementeller Deckungsbeitrag** plus **vermiedene Fehlerkosten** minus Betriebskosten. Freigewordene Zeit nicht ohne Kapazitätsannahme als Cash-Ersparnis verbuchen. `Payback` nur bei positivem, belegbarem monatlichem Nettonutzen berechnen.

**Eingaben, die der Chef bestätigen muss:** `{{monthly_volume}}`, `{{active_minutes_per_case}}`, `{{people_cost}}`, `{{usable_share}}`, `{{current_conversion}}`, `{{gross_margin}}`, `{{direct_costs}}`.

## SEITE 8 — Vertrauen und persönlicher nächster Schritt

**Wer begleitet Sie?** ITSFeierabend, persönlicher KI-Transformations- und Implementierungspartner.  
**Arbeitsweise:** Record → Map → Automate → Measure → Scale.  
**Erfahrung / Awards:** `{{verified_awards_and_references_only}}` (kein unverifiziertes Siegel oder Testimonial).

**Sie zeigen uns einen repräsentativen Ablauf. Wir analysieren, bauen, testen und messen persönlich.** Das 5–8-Stunden-Kundenmitwirkungsziel gilt ausschliesslich für einen klar abgegrenzten Sprint, nicht für jede Unternehmenstransformation.

**Nächster Schritt:** `{{specific_nonbinding_meeting_CTA}}`.  
**Kontakt:** `{{confirmed_business_contact}}`.  
**Datenschutzhinweis:** `{{approved_short_notice}}`.

---

## Render- und Freigaberegeln

1. Vollständige Quellenliste als Anhang/QR (nur wenn QR zuvor tatsächlich getestet; keine privaten Tokens).
2. Fehlt eine Schätzung, Abschnitt mit klarer `UNKNOWN`-Erklärung ersetzen, nicht mit Beispieldaten befüllen.
3. Vor Druck automatische Konsistenzprüfung auf ungültige `{{...}}`-Slots, unbelegte `VERIFIZIERT`-Claims, fehlende Zeiträume und Währungs-/Mehrwertsteuerangaben.
4. Ein interner Reviewer validiert jede finanzielle Zahl und den referenzierten Branchenbeweis.
5. Gedruckter Report ist ein vorläufiger *Opportunity Brief*. Der bezahlte Audit beginnt erst nach Termin, Scope, Rechtsträger und Freigabe.
