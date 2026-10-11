# itsfeierabend — Pilotpaket: Ein Workflow, eine klare Entscheidung

**Stand:** 11. Oktober 2026  
**Status:** Interner, lieferbereiter Angebotsentwurf. Noch kein versandtes Angebot, Kundenauftrag oder öffentlich aktivierter Preis.  
**Paket:** `ITS-PAID-PILOT-PACKAGE-20261011`  
**Operativer Auftrag:** [Business OS — itsfeierabend](https://app.asana.com/0/0/1218976882548897/f)  
**Dokumentationslinie:** bestehender [PR #4](https://github.com/mfeie002-jpg/itsfeierabend.ch/pull/4), ergänzt um dieses Dokument. Die fünf Dokumente vom 29. September bleiben als datierte Grundlagen erhalten.

## 1. Das konkrete Angebot

### Workflow-Check für Schweizer Dienstleistungs-KMU

**Sie zeigen uns einen wiederkehrenden Ablauf. Sie erhalten eine nachvollziehbare Entscheidung, welchen Schritt Sie vereinfachen oder automatisieren sollten — mit Umfang, Abnahmekriterien und den dafür nötigen Voraussetzungen.**

Der erste Pilot betrachtet die Übergabe **von einer eingehenden Anfrage bis zum zugewiesenen nächsten Schritt**. Das ist bewusst ein kleines Stück des Geschäfts: Wer nimmt die Anfrage entgegen? Welche Angaben fehlen? Wer übernimmt sie? Wo wird der nächste Schritt festgehalten?

**Zielkunde als Arbeitshypothese:** inhabergeführtes Schweizer Dienstleistungs-KMU mit wiederkehrenden Anfragen, manuellen Übergaben zwischen Postfach, Dokumenten und Aufgabenliste sowie einer verantwortlichen Person, die den Ablauf und die Abnahme kennt. Zahlungsbereitschaft und Branchenpriorität müssen durch echte Gespräche bestätigt werden. Es ist noch kein Pilotkunde benannt.

**Ergebnis:** ein kompakter Entscheidungsbericht, ein belegter Ist-Ablauf und ein umsetzbarer erster Änderungsvorschlag. Die Entscheidung kann auch lauten, den Ablauf manuell zu lassen oder zuerst fehlende Daten zu erfassen. Eine zusätzliche Software ist kein Lieferziel.

| Enthalten | Begrenzung für diesen Pilot |
|---|---|
| Betrachteter Ablauf | Ein benannter Anfrageweg, vom Eingang bis zur verantworteten nächsten Aktion |
| Beteiligte | Ein Prozess- und Abnahmeverantwortlicher; höchstens eine weitere Auskunftsperson |
| Quellen | Bis zu drei bestehende Systeme oder gleichwertige Exporte; bis zu fünf anonymisierte abgeschlossene Beispiele |
| Zusammenarbeit | Ein 45-minütiges Aufnahmegespräch, ein 30-minütiges Ergebnisgespräch, eine gebündelte sachliche Korrekturrunde |
| Lieferung | Vorschlag: innerhalb von fünf Arbeitstagen nach vollständigen vereinbarten Inputs und bestätigtem Start |
| Entscheidung | Vereinfachen, begrenzten Umsetzungsschritt vorbereiten, Datenlücke schliessen oder stoppen |

Die Termine und Grenzen sind das vorgeschlagene Pilotdesign. Ein Kundentermin oder eine Kapazitätszusage ist damit nicht vereinbart. Mehrere Anfragewege, Teams oder zusätzliche Systeme werden als eigener Folgescope behandelt.

## 2. Was der Kunde bereitstellt

Vor dem Start müssen diese fünf Inputs vorliegen. Vorhandene anonymisierte Exporte und eine Bildschirmführung reichen aus; neue Administrationsrechte sind dafür keine Voraussetzung.

1. **Ein Ablauf in einem Satz:** „Eine Anfrage kommt über … herein und ist abgeschlossen, sobald …“.
2. **Eine verantwortliche Person:** Name und Rolle für Rückfragen, Prozessentscheidung und Abnahme; eine Person kann alle Rollen übernehmen.
3. **Drei bis fünf abgeschlossene Beispiele:** Eingang, Bearbeitungsschritte und Ergebnis, soweit vorhanden mit Zeitpunkten. Mindestens drei nutzbare Beispiele sind die Startbasis dieses Pilots. Namen, Adressen und Kontaktdaten werden für die Analyse entfernt.
4. **Bestehende Arbeitsmittel:** relevante Vorlage, Checkliste, Aufgabenansicht oder Export; pro Quelle wird festgehalten, was sie zuverlässig belegt.
5. **Ein beobachtbarer Engpass:** zum Beispiel doppelte Erfassung, ungeklärte Zuständigkeit, Rückfragen wegen fehlender Angaben oder Wartezeit bis zur ersten Aktion. Keine bereits erreichte Verbesserung wird vorausgesetzt.

Fehlen auswertbare Beispiele, wird die kleine Erfassungsvorlage unten vorbereitet und der Lieferstart verschoben. Ein Interview allein wird nicht zu einer gemessenen Baseline umetikettiert. Bei sensiblen Daten wird zuerst ein freigegebener, minimierter Ausschnitt gewählt; Originalkundendaten gehören nicht in dieses öffentliche Git-Dokument.

## 3. Ablauf und Arbeitsaufteilung

| Zeitpunkt ab bestätigtem Start | Tätigkeit | Sichtbarer Output |
|---|---|---|
| Tag 1 | Inputs abgleichen; 45 Minuten Ist-Ablauf aufnehmen | Scope, Quelle je Schritt, Owner und maximal drei Kernfragen festgehalten |
| Tag 2 | Beispiele entlang derselben Schritte prüfen | Belegter Ablauf und Lückenregister; Zählwerte mit Stichprobe und Zeitraum |
| Tag 3 | Bis zu drei Verbesserungen vergleichen | Priorisierte Chancen und eine begründete Empfehlung |
| Tag 4 | Einen Änderungsvorschlag als Ablauf, Checkliste oder ausgefülltes Muster durchspielen | Soll-Ablauf, Ausnahmefälle, Abnahme und Rückfall auf den bisherigen Prozess |
| Tag 5 | 30 Minuten Ergebnisbesprechung; nächste Entscheidung festhalten | Entscheidungsbericht und Abnahmeprotokoll; sachliche Korrekturen gesammelt |

**itsfeierabend übernimmt:** Strukturierung, Quellenabgleich, Analyse, Entwurf und Ergebnisbericht; KI kann nach geklärter Datenfreigabe bei dieser Arbeit unterstützen. Der Founder prüft die geschäftliche Empfehlung und führt die Ergebnisbesprechung. **Der Kunde übernimmt:** Quellenfreigabe, Tatsachenkorrekturen, Prozessentscheidung und Abnahme. Eine vollautomatisierte itsfeierabend-Backend-Plattform ist für diese manuell unterstützte Lieferung nicht erforderlich.

Ein produktiver Bot, eine CRM-Integration oder automatisch versandte Antwort ist nicht Bestandteil dieses Diagnosepilots. Der exemplarische Durchlauf arbeitet mit anonymisierten Beispielen und verändert den Kundenbetrieb nicht.

## 4. Die vier Liefergegenstände

### A. Entscheidungsbericht, höchstens drei Seiten

- Welcher Engpass wurde tatsächlich beobachtet?
- Welche Beispiele und Quellen belegen ihn, und was bleibt unbekannt?
- Welche der bis zu drei Verbesserungen hat unter den bekannten Bedingungen Vorrang?
- Welcher einzelne nächste Schritt ist sinnvoll, wer übernimmt ihn und wodurch gilt er als gelungen?
- Entscheidung: **manuell verbessern / Umsetzungsscope vorbereiten / erst Evidenz ergänzen / stoppen**.

### B. Ist- und Soll-Ablauf

Eine Tabelle zeigt Trigger, Schritte, Zuständigkeit, Quelle, Ausgabe und Ausnahmen. Der Soll-Ablauf kann zunächst eine bessere Checkliste oder klare Übergabe sein. Jede spätere Automatisierung bekommt einen konkreten menschlichen Eskalationspunkt.

### C. Evidenz- und Messblatt

Die folgenden Felder sind direkt verwendbar. Es werden keine fehlenden Zeitstempel geschätzt und als Messung ausgegeben.

| Fall-ID | Eingang | Erste verantwortete Aktion | Rückfragen wegen fehlender Angaben | Übergaben | Ergebnis | Quellenstatus |
|---|---|---|---|---|---|---|
| Beispiel 01–05 | Zeitpunkt oder UNKNOWN | Zeitpunkt oder UNKNOWN | Anzahl oder UNKNOWN | Anzahl oder UNKNOWN | Belegter Endzustand | Quelle / Datum / Einschränkung |

**Baseline-Regel:** Wartezeit nur aus passenden tatsächlichen Zeitstempeln berechnen; aktive Bearbeitungszeit nur aus Beobachtung oder vorhandenem Zeitnachweis. Zeitraum und Stichprobengrösse werden mitgeführt. Drei bis fünf Fälle zeigen mögliche Fehler und Übergaben, aber keinen repräsentativen Durchschnitt für den ganzen Betrieb. Einsparung, Umsatzwirkung und Conversion-Uplift bleiben ohne geeigneten Vorher/Nachher-Nachweis offen.

### D. Ein umsetzbarer erster Arbeitsschritt

Die Empfehlung enthält Start- und Endpunkt, Owner, benötigte Inputs, betroffene Systeme, normale Fälle, mindestens einen relevanten Ausnahmefall, Abnahmeschritte und den Rückfall auf den bisherigen Ablauf. Falls keine Änderung sinnvoll ist, enthält sie stattdessen die begründete Stop-Entscheidung oder einen begrenzten Messauftrag.

## 5. Abnahme, die man tatsächlich prüfen kann

| Kriterium | Nachweis bei Übergabe |
|---|---|
| Umfang stimmt | Ein Anfrageweg; Start, Ende und ausgeschlossene Arbeit sind festgehalten |
| Tatsachen sind nachvollziehbar | Jede entscheidende Aussage hat Quelle/Beispiel oder die Kennzeichnung ASSUMPTION, UNKNOWN oder CONFLICT |
| Ist-Ablauf stimmt | Prozessverantwortlicher hat Schritte und Zuständigkeiten bestätigt oder konkrete Korrekturen benannt |
| Empfehlung ist entscheidbar | Bis zu drei Optionen; eine priorisierte Empfehlung mit Abhängigkeiten und Nicht-Automatisieren-Fällen |
| Erster Schritt ist prüfbar | Normalfall und Ausnahmefall am Muster nachvollzogen; beobachtbares Akzeptanzkriterium und Rückfallweg vorhanden |
| Wirkung ist ehrlich abgegrenzt | Beobachtete Befunde, Zielwerte und noch ungemessene Wirkung sind getrennt |
| Übergabe ist vollständig | Bericht, Ablauf, Evidenzblatt und erster Arbeitsschritt liegen beim vereinbarten Abnehmer |

Der Kunde kann **abgenommen**, **sachliche Korrektur erforderlich** oder **Entscheidung ausstehend** festhalten. Schweigen wird nicht als Abnahme behandelt. Die vereinbarte Korrekturrunde behebt sachliche Fehler im selben Scope; ein zusätzlicher Prozess startet keine stillschweigende Erweiterung.

## 6. Preisentscheidung und Paketökonomie

**Interne Empfehlung: CHF 790 als fester Pilotpreis.** Das liegt am oberen Ende des bereits dokumentierten Opportunity-Brief-Rahmens von CHF 290–790. Der eng begrenzte Fallumfang, zwei kurze Gespräche und ein einzelner Entscheidungsvorschlag sollen eine erste bezahlte Diagnose praktikabel machen. Das ist eine zu testende Angebotsentscheidung, kein Nachweis der Zahlungsbereitschaft und noch keine Preiszusage.

| Entscheidung | Vorschlag / offener Punkt |
|---|---|
| Pilotpreis | CHF 790; vor dem Versand in der konkreten Offerte bestätigen |
| Rechnungssteller und Steuerbehandlung | In der konkreten Offerte eindeutig ausfüllen; hier noch UNKNOWN |
| Zahlungsziel, Termin und Kunde | Vor Versand festlegen; nicht aus diesem internen Dokument ableiten |
| Folgearbeit | Eigenständig anbieten; keine automatische Buchung, Verrechnung, Verlängerung oder Sprintpflicht |
| Grössere Diagnose | Separater Audit, falls mehrere Prozesse/Teams oder tiefere Datenanalyse erforderlich sind; bestehender interner Rahmen CHF 2'900–9'900, ohne jetzige Preiszusage |

**Interne Aufwandshypothese:** höchstens fünf direkte Arbeitsstunden inklusive Vorbereitung, Gesprächen, Bericht und Korrekturrunde. Bei CHF 790 entspräche das CHF 158 Umsatz je direkter Stunde vor Kosten und Steuern; bei acht Stunden rund CHF 99. Das sind Szenarien, keine Marge. Erfasste Ist-Stunden und direkte Kosten entscheiden nach dem ersten Pilot über Beibehalten, engeren Scope oder höheren Preis.

Der kleinste nächste kommerzielle Schritt ist eine konkrete Offerte für einen identifizierten, qualifizierten Kunden. Versand unter Founder-Identität, Vertragsabschluss und Kundentermin sind separate, tatsächlich auszuführende Handlungen. Dieses Paket wurde weder versandt noch verkauft.

## 7. Umzugscheck als belegtes Arbeitsbeispiel

**Interne Referenz, kein Beleg eines zahlenden externen Pilotkunden.** Als aktueller Methodenbeleg eignet sich der am 10. Oktober dokumentierte Übergang vom kombinierten Umzug/Reinigung-Inhalt in den bestehenden Offertenprozess. [Der versionierte Release-Nachweis](https://github.com/mfeie002-jpg/umzugscheck.ch/blob/a219ed2e23f1125052f121f9d8a9fdb9137c5967/docs/seo/production-20261010/continuation-release.json) enthält die genaue Quellversion, Funktionsprüfungen und öffentliche Desktop-/Mobilprüfungen.

| Belegter Befund | Was er aussagt |
|---|---|
| PR #76, Kandidat `10d7adb093004cc15205234bcffb9ae572966274`, Merge `186d9015d09f1921babe71f0158bde29c4ed426b` | Der geprüfte Änderungsscope ist versioniert und integriert |
| Zwölf öffentliche CTA-Fälle mit leeren, vorhandenen und ungültigen gespeicherten Angaben; Status PASS | Der Übergang wählt Reinigung und erhält gültige bestehende Zusatzleistungen/Anfragedaten, während alter Kontakt und Consent nicht übernommen werden |
| Zwei zusätzliche mobile Routenprüfungen; Status PASS | Die im Nachweis beschriebenen Mobilansichten waren ohne horizontalen Seitenüberlauf |
| `noLeadSubmitted: true` und Geschäftswirkung ausdrücklich offen | Diese Tests belegen keinen echten Lead, keine Zeitersparnis und keinen Umsatz |

**Verwendbare kurze Fallbeschreibung nach Freigabe der externen Nutzung:**

> Bei unserem eigenen Projekt Umzugscheck haben wir eine konkrete Übergabe zwischen Angebotsinhalt und Anfrageformular verbessert. Die Änderung wurde versioniert, anhand unterschiedlicher Ausgangssituationen geprüft und auf der öffentlichen Website kontrolliert. Der Nachweis zeigt, welches Verhalten funktioniert. Zusätzliche Anfragen oder Umsatz schreiben wir dieser Änderung ohne entsprechende Messung nicht zu.

Die ältere Case-Matrix vom 29. September bleibt eine historische Grundlage. Ihre damaligen offenen Release- und Trackingstände werden nicht als heutiger Gesamtstatus übernommen. Dieses Paket nennt keine weiteren Kunden oder Testimonials.

## 8. Operativer Handoff

- **Erledigt mit diesem Dokument:** die bestehenden fünf Grundlagen zu einem begrenzten, lieferbaren Pilotpaket verdichtet; Preisvorschlag, Arbeitsmittel, Abnahme und belegtes Methodenbeispiel vorbereitet.
- **Noch offen:** identifizierter Pilotkunde, konkrete Anfrage/Einwilligung, auswertbare Beispiele, Offerte mit Rechnungssteller/Steuerbehandlung/Zahlungsziel und vereinbartem Start; anschliessend tatsächliche Lieferung und Abnahme.
- **Nächste eigene Arbeit:** aus einem realen qualifizierten Kontakt die Felder vervollständigen und die Offerte als Entwurf vorbereiten. Den Kontakt oder sein Interesse nicht erfinden. Bis dahin bleibt das Paket intern nutzbar.
- **Messziel nach dem Pilot:** bezahlter und abgenommener Diagnoseauftrag, tatsächliche Stunden/Kosten sowie begründete Folgeentscheidung. Einen bezahlten Sprint als Erfolg des Diagnosepilots vorauszusetzen würde die Beratung verzerren.
- **Systeme:** Asana führt Auftrag, Owner und nächsten Schritt. Dieser PR enthält das dauerhafte interne Paket. Kundensensitive Falldaten bleiben in der konkret vereinbarten, berechtigten Kundenablage.

## 9. Quellen und zeitliche Einordnung

1. [Business OS, Aufgabe 1218976882548897](https://app.asana.com/0/0/1218976882548897/f), operativer Stand 10. Oktober, am 11. Oktober gelesen: VALIDATE, Pilotpaket bis 13. Oktober, keine bestätigte Pipeline; Backend-Cutover getrennt.
2. [Offer System vom 29. September](OFFER_SYSTEM_2026-09-29.md): Opportunity Brief und kommerzielle Preisrahmen.
3. [Paid Diagnostic Kit vom 29. September](PAID_DIAGNOSTIC_KIT_2026-09-29.md): Aufnahme, Evidenzschema, Priorisierung und Abnahme.
4. [Business OS Baseline vom 29. September](ITSFEIERABEND_BUSINESS_OS_2026-09-29.md): Zielkundenthese, Geschäftsloop und offene Preiswahrheit; zeitgebundene technische Befunde sind historisch.
5. [Case Evidence Matrix vom 29. September](CASE_EVIDENCE_MATRIX_2026-09-29.md): Trennung zwischen Umsetzung, Abnahme und Geschäftswirkung.
6. [Semrush CH Evidence vom 29. September](SEMRUSH_CH_MARKET_EVIDENCE_2026-09-29.md): historischer, externer Suchmarkt-Kontext; in diesem Pilot weder Nachfragebeweis noch Umsatzprognose.
7. [Umzugscheck Release-Nachweis, Quellstand `a219ed2e`](https://github.com/mfeie002-jpg/umzugscheck.ch/blob/a219ed2e23f1125052f121f9d8a9fdb9137c5967/docs/seo/production-20261010/continuation-release.json): am 11. Oktober erneut gelesen; genutzte Prüfergebnisse wurden am 10. Oktober aufgezeichnet.

**Produktlinie:** Am 11. Oktober frisch gelesenes `lovable-sync` zeigt `37d56dca40b75ff1a0087c50f9d8562abdd80d16`. PR #4 bleibt auf der bestehenden Dokumentationslinie `main` und verändert diese Produktlinie nicht. Die Supabase-Zugriffsfrage aus Aufgabe `1218797960114743` wird hier nicht erneut getestet oder umgangen.
