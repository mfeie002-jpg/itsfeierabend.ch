# ITSFeierabend — Full AI Business Transformation Blueprint v1

**Typ:** vertraulicher Kundenbericht nach Discovery / bezahltem Operations Audit (typisch 15–40 Seiten). **Nicht** aus einer externen Website-Analyse allein generieren.  
**Status:** Vorlage, kein Kunde oder Auftrag bestätigt. Angebotsannahmen nicht als abgeschlossenen Vertrag darstellen.

## Eingangsvoraussetzungen / Vertragsgrenze
Kunden-Owner, Zweck, Scope/Nicht-Scope, zulässiger Zugriff, Aufzeichnungs-/Mitarbeiterinformation, Datentrennung, IT-Provider, Drittland-Transfers, Speicher-/Löschregeln und Veröffentlichungssperre vereinbart. Bei fehlender Freigabe STOP/UNKNOWN, keine geheimen Daten einsammeln.

## Pflichtgliederung (jedes Kapitel mit Owner, Version, Quelle, offenen Punkten)

1. **Executive Decision:** Ist-Lage, drei Prioritäten, Investitionsentscheid, Unbekannte und explizite Non-Goals.
2. **Mandat und Betriebsmodell:** Rechtsträger, Standorte, Teams, Entscheider, Kundenarten, Ausnahmeregeln; fachlich bestätigt statt öffentlich vermutet.
3. **Zielbild:** Leistungsfähigkeit, Qualität, messbare Resultate, Schwellen für Stop/Weiter.
4. **Process Inventory:** `process_id`, Frequenz, Varianten, Owner, Inputs/Outputs, aktive Zeit, Wartezeit, Fehler, Handoffs.
5. **Process Cards:** vollständige versionierte Karten; Bildschirmvideos und Kundendaten nur im dafür freigegebenen Speicher.
6. **Datenlandkarte:** primäre Datenquellen, Schemata, Genauigkeit, Rückmeldungen, Quellen der Wahrheit.
7. **System-/Toollandkarte:** Software/Version/Lizenz, Schnittstellen, Exportmöglichkeit, kritische Abhängigkeiten, Berechtigungseigner.
8. **Rollen und Human Gates:** RACI / einzelne Entscheidungen, Betragsgrenzen, fachliche Freigaben, Eskalation.
9. **Datenschutz, IT-Sicherheit und Compliance:** Klassifizierung, Zweck, Zugriff, Löschung, Backup, Aufzeichnung, Protokollierung, Vendor Register und Notfall.
10. **Baseline und Messdesign:** Definition je KPI, Zeitraum, Stichprobe, Fallmix, Datenqualität, Messverantwortlicher.
11. **Opportunity Backlog:** Hypothesen vs bestätigte Prozesse, Erwartungsnutzen, Implementierungsrisiko, Komplexität, Abhängigkeiten.
12. **Automationsarchitektur:** Agentenrollen, APIs, Skills, Workflow-Orchestrierung, Trigger, Idempotenz, Audit Trail, Retry, Queue, Permissions.
13. **Drei Sprint-Alternativen:** Scope, Risiko, Aufwand, Zeitfenster, Messwert, Abnahme und Abbruchbedingung.
14. **Future-State Journey:** Ereigniskette von Trigger bis Abschluss; Normalfall/Fehlermodus/Übersteuerung.
15. **Pilot- und Shadow-Testplan:** Testdatensätze, Musterfälle, parallel geführte menschliche Bearbeitung, Abweichungsdiagnose.
16. **Rollout-/Rollback-Plan:** Voraussetzungen, Datenmigration, Backup, Eigentümer, Support, reversible und irreversible Schritte.
17. **Business Case:** konservativ, erwartet, Potenzial, Vollkosten, Deckungsbeitrag, Investition, laufende Kosten und Annahmen.
18. **30/60/90 Roadmap:** Owner, Abhängigkeiten, externe Freigaben, Akzeptanzkriterien, Change-Management.
19. **Schulung und Übergabe:** Mitarbeitende, praktische Anleitungen, Zuständigkeiten, Dokumentationsstand, Wissenstransfer.
20. **Betriebs- und Verbesserungsvertrag:** SLA-/Monitoring-Vorschlag, Modell-/Toolwechsel, Kostenlimits, Periodenreporting, Retainer-Scope.
21. **Entscheidungsprotokoll:** ACCEPT / REWORK / HOLD / REJECT je Sprint und fachlichem Gate.
22. **Anhang:** Datenwörterbuch, Quellen-/Aufzeichnungsregister, Testbelege, Screenshots nur mit Einwilligung, Begriffsglossar.

## Process Card Pflichtfelder
`process_id, client_id, name, trigger, end_condition, owner, reviewer, frequency, volume_window, active_minutes, wait_minutes, source_ref, system_ids, input_contract, output_contract, decision_rules, exceptions, failure_modes, privacy_class, human_gate, suggested_automation_mode, baseline_metrics, acceptance_tests, rollback_plan, observed_at, verified_by`.

Nur `VERIFIZIERT` + Quelle als Ist-Fakt; `ABGELEITET` / `ZU VALIDIEREN` / `UNKNOWN` im gesamten Blueprint durchtragen. `UNKNOWN` ist kein Nullwert.

## Vergleich vor/nach der Umsetzung
KPI-Messung auf gleicher Grain/Periode/Falltyp. Zeiteinsparungen nur für tatsächlich nicht mehr nötige Schritte; monetären Nutzen nur bei verwertbarer Kapazität. Kommunikations- und fachliche Freigaben vor Go-live separat abnehmen. Nachher-Werte werden nie vorweg in das Dokument eingetragen.

## Freigabeformular
- Kunde / verantwortliche Person: `{{...}}`
- Scope und Nicht-Scope akzeptiert: `{{...}}`
- Fachliche/Datenschutz-Freigaben: `{{...}}`
- Baseline bestätigt: `{{...}}`
- Entscheidung zu Sprint 1: `{{ACCEPT / REWORK / HOLD}}`
- Datum / Version / Signatur: `{{...}}`

**Vertriebsgrenze:** Dieser Blueprint wird erst nach bezahltem oder gesondert vereinbartem Audit geliefert. Der 4–8-seitige öffentliche Brief darf keine interne Tiefenanalyse vortäuschen.
