export type Language = 'de' | 'en';

export interface LocalizedText {
  de: string;
  en: string;
}

export interface PlatformPageDefinition {
  slug: string;
  slugEn: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
  deliverablesTitle: LocalizedText;
  deliverables: LocalizedText[];
  processTitle: LocalizedText;
  process: Array<{
    title: LocalizedText;
    text: LocalizedText;
  }>;
  audienceTitle: LocalizedText;
  audiences: LocalizedText[];
  evidenceNote: LocalizedText;
  faq: Array<{
    question: LocalizedText;
    answer: LocalizedText;
  }>;
  primaryCta: LocalizedText;
  primaryPath: string;
  primaryPathEn: string;
  secondaryCta?: LocalizedText;
  secondaryPath?: string;
  secondaryPathEn?: string;
  inquiryType?: 'contact' | 'partner';
  serviceSchema?: boolean;
}

const sharedAuditFaq = [
  {
    question: {
      de: 'Welche Rolle spielt KI bei der Analyse?',
      en: 'What role does AI play in the analysis?',
    },
    answer: {
      de: 'Der Quick Audit bewertet öffentlich erreichbare Website-Signale regelbasiert. KI- oder Experteneinordnung ist erst Teil eines separat vereinbarten vertieften Audits und verändert keine Messwerte.',
      en: 'The Quick Audit scores publicly accessible website signals by rule. AI or expert interpretation is reserved for a separately scoped deep audit and never changes measured values.',
    },
  },
  {
    question: {
      de: 'Ist das Ergebnis eine definitive Unternehmensbewertung?',
      en: 'Is the result a definitive company assessment?',
    },
    answer: {
      de: 'Nein. Der kostenlose Check ist eine vorläufige digitale Standortbestimmung. Nicht automatisch prüfbare Punkte werden klar als Selbstangabe, Schätzung oder manuell zu prüfen gekennzeichnet.',
      en: 'No. The free check is a preliminary digital baseline. Anything that cannot be verified automatically is labelled as user-stated, estimated, or requiring expert review.',
    },
  },
];

export const platformPages: Record<string, PlatformPageDefinition> = {
  'ai-business-audit': {
    slug: '/ai-business-audit',
    slugEn: '/en/ai-business-audit',
    eyebrow: { de: 'Zentrale Diagnose', en: 'Core diagnostic' },
    title: {
      de: 'AI Business Audit für Schweizer KMU',
      en: 'AI Business Audit for Swiss SMEs',
    },
    description: {
      de: 'Regelbasierter Homepage-Quick-Check für technische Basis, Inhalte, Vertrauen, Conversion-Signale und maschinenlesbare Auffindbarkeit – ergänzt um separat erfassten Geschäftskontext.',
      en: 'A rule-based homepage Quick Check for technical foundations, content, trust, conversion signals and machine-readable discovery, with business context captured separately.',
    },
    intro: {
      de: 'Der kostenlose Audit bewertet statische, öffentlich erreichbare Homepage-Signale. Branche, Region, Ziel und Systeme werden für die spätere Einordnung gespeichert, aber nicht in den automatischen Score eingerechnet.',
      en: 'The free audit scores static, publicly accessible homepage signals. Industry, region, goals and systems are stored for later scoping but are not included in the automated score.',
    },
    deliverablesTitle: { de: 'Was Sie erhalten', en: 'What you receive' },
    deliverables: [
      { de: 'nachvollziehbarer Reifegrad mit Evidenz je Signal', en: 'an explainable maturity score with evidence per signal' },
      { de: 'belegte Stärken und sichtbare Website-Risiken', en: 'evidence-backed strengths and visible website risks' },
      { de: 'drei bis fünf priorisierte Massnahmen', en: 'three to five prioritized actions' },
      { de: 'klare Kennzeichnung von Messung, HTML-Heuristik und nicht verfügbarer Evidenz', en: 'clear labels for measurements, HTML heuristics and unavailable evidence' },
      { de: 'nächster sinnvoller Schritt ohne Kaufzwang', en: 'a sensible next step without a purchase obligation' },
    ],
    processTitle: { de: 'So entsteht der Audit', en: 'How the audit is produced' },
    process: [
      { title: { de: 'Erfassen', en: 'Collect' }, text: { de: 'Öffentliche Website-Signale und Ihr Geschäftskontext werden getrennt aufgenommen.', en: 'Public website signals and your business context are collected separately.' } },
      { title: { de: 'Normalisieren', en: 'Normalize' }, text: { de: 'Signale erhalten Quelle, Konfidenz und einen definierten Bewertungsbereich.', en: 'Every signal receives a source, confidence and defined scoring range.' } },
      { title: { de: 'Bewerten', en: 'Score' }, text: { de: 'Deterministische Regeln berechnen Kategorie- und Gesamtscore.', en: 'Deterministic rules calculate category and overall scores.' } },
      { title: { de: 'Priorisieren', en: 'Prioritize' }, text: { de: 'Dokumentierte Gewichte ordnen die grössten Website-Lücken. Eine geschäftliche Priorisierung folgt erst im vertieften Audit.', en: 'Documented weights rank the largest website gaps. Commercial prioritization follows only in a deep audit.' } },
    ],
    audienceTitle: { de: 'Geeignet für', en: 'Best suited for' },
    audiences: [
      { de: 'etablierte, inhabergeführte Schweizer Dienstleistungs- und B2B-KMU', en: 'established, owner-led Swiss service and B2B SMEs' },
      { de: 'Unternehmen mit wertvollen Leads, aber schwacher Messung oder Nachbearbeitung', en: 'companies with valuable leads but weak measurement or follow-up' },
      { de: 'Teams, die zuerst wissen wollen, welcher digitale Hebel wirklich zählt', en: 'teams that want to identify the right digital lever before investing' },
    ],
    evidenceNote: {
      de: 'Ein Quick Audit kann nur öffentlich erreichbare und freiwillig angegebene Daten verwenden. Für Analytics-, CRM- oder Search-Console-Befunde ist ein vertiefter Audit mit freigegebenem Zugriff nötig.',
      en: 'A quick audit can only use public and voluntarily supplied data. Analytics, CRM or Search Console findings require a deeper audit with approved access.',
    },
    faq: [
      ...sharedAuditFaq,
      {
        question: { de: 'Was kostet der vertiefte Audit?', en: 'What does the deeper audit cost?' },
        answer: {
          de: 'Umfang und Preis richten sich nach Systemlandschaft, Datenzugängen und Fragestellung. Sie erhalten zuerst eine klar abgegrenzte Offerte; auf der Website werden ohne Freigabe keine Preise veröffentlicht.',
          en: 'Scope and price depend on systems, data access and the question being investigated. You receive a clearly scoped proposal first; no unapproved prices are published on the website.',
        },
      },
    ],
    primaryCta: { de: 'Kostenlosen Business Audit starten', en: 'Start the free Business Audit' },
    primaryPath: '/audit',
    primaryPathEn: '/en/audit',
    secondaryCta: { de: 'Methodik ansehen', en: 'See the methodology' },
    secondaryPath: '/ueber-uns',
    secondaryPathEn: '/en/about',
    serviceSchema: true,
  },
  'website-audit': {
    slug: '/website-audit',
    slugEn: '/en/website-audit',
    eyebrow: { de: 'Website-Analyse', en: 'Website analysis' },
    title: { de: 'Website Audit: Wo verliert Ihre Website Anfragen?', en: 'Website Audit: Where does your website lose enquiries?' },
    description: {
      de: 'Website-Analyse für Schweizer Unternehmen: Technik, Mobile UX, Botschaft, Vertrauen und Conversion werden mit nachvollziehbarer Evidenz geprüft.',
      en: 'Website analysis for Swiss companies covering technical health, mobile UX, messaging, trust and conversion with explainable evidence.',
    },
    intro: {
      de: 'Eine Website kann technisch online und geschäftlich trotzdem unsichtbar sein. Der Audit zeigt, welche Hürden zwischen Besuch, Vertrauen und Anfrage liegen.',
      en: 'A website can be technically online while remaining commercially invisible. The audit identifies friction between visit, trust and enquiry.',
    },
    deliverablesTitle: { de: 'Prüfbereiche', en: 'What is checked' },
    deliverables: [
      { de: 'Erreichbarkeit, Indexierbarkeit, Metadaten und technische Basis', en: 'availability, indexability, metadata and technical foundations' },
      { de: 'Mobile Bedienbarkeit, Navigation und Formularhürden', en: 'mobile usability, navigation and form friction' },
      { de: 'Klarheit von Positionierung, Angebot und nächstem Schritt', en: 'clarity of positioning, offer and next action' },
      { de: 'Trust-Signale, rechtliche Grundlagen und überprüfbarer Proof', en: 'trust signals, legal basics and verifiable proof' },
      { de: 'Conversion-Pfade und messbare Quick Wins', en: 'conversion paths and measurable quick wins' },
    ],
    processTitle: { de: 'Von der URL zur Priorität', en: 'From URL to priority' },
    process: [
      { title: { de: 'Scan', en: 'Scan' }, text: { de: 'Öffentlich erreichbare Seiten und technische Signale werden geprüft.', en: 'Public pages and technical signals are checked.' } },
      { title: { de: 'Kontext', en: 'Context' }, text: { de: 'Branche, Region und Geschäftsziel werden separat erfasst und erst in einer vertieften Einordnung verwendet.', en: 'Industry, region and business goal are captured separately and used only when scoping a deeper review.' } },
      { title: { de: 'Befund', en: 'Findings' }, text: { de: 'Jeder Befund erhält Evidenz, Risiko und nächste Massnahme.', en: 'Every finding receives evidence, risk and a next action.' } },
    ],
    audienceTitle: { de: 'Typische Ausgangslagen', en: 'Typical starting points' },
    audiences: [
      { de: 'Die Website erhält Traffic, aber zu wenige qualifizierte Anfragen.', en: 'The website gets traffic but too few qualified enquiries.' },
      { de: 'Mobile Nutzer brechen vor dem Formular ab.', en: 'Mobile users drop out before the form.' },
      { de: 'Angebot und Differenzierung sind nicht in wenigen Sekunden verständlich.', en: 'The offer and differentiation are not clear within seconds.' },
    ],
    evidenceNote: {
      de: 'Der Quick Scan misst öffentlich zugängliche Signale. Aussagen zu realer Conversion oder Umsatzwirkung benötigen Analytics- und CRM-Daten.',
      en: 'The quick scan measures public signals. Claims about actual conversion or revenue impact require analytics and CRM data.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'Kostenlosen Website Audit starten', en: 'Start the free Website Audit' },
    primaryPath: '/audit?type=website',
    primaryPathEn: '/en/audit?type=website',
    secondaryCta: { de: 'Leistungen ansehen', en: 'View services' },
    secondaryPath: '/leistungen',
    secondaryPathEn: '/en/services',
    serviceSchema: true,
  },
  'seo-analyse': {
    slug: '/seo-analyse',
    slugEn: '/en/seo-analysis',
    eyebrow: { de: 'SEO-Analyse', en: 'SEO analysis' },
    title: { de: 'SEO-Analyse für Sichtbarkeit mit Geschäftswert', en: 'SEO analysis focused on commercially valuable visibility' },
    description: {
      de: 'SEO Audit für Schweizer KMU: technische Indexierung, Suchintention, Seitenarchitektur, lokale Sichtbarkeit und Content-Lücken – ohne Ranking-Garantien.',
      en: 'SEO audit for Swiss SMEs covering indexation, search intent, site architecture, local visibility and content gaps—without ranking guarantees.',
    },
    intro: {
      de: 'Mehr Rankings sind nicht automatisch mehr Geschäft. Die Analyse verbindet Suchnachfrage mit Angebot, Conversion-Pfad und realistischer Priorität.',
      en: 'More rankings do not automatically mean more business. The analysis links search demand with offer, conversion path and realistic priority.',
    },
    deliverablesTitle: { de: 'SEO-Befunde', en: 'SEO findings' },
    deliverables: [
      { de: 'Indexierung, Canonicals, Sitemap, robots.txt und technische Signale', en: 'indexation, canonicals, sitemap, robots.txt and technical signals' },
      { de: 'Keyword-zu-Seite-Mapping ohne Kannibalisierung', en: 'keyword-to-page mapping without cannibalization' },
      { de: 'Suchintention und Message Match je Hauptseite', en: 'search intent and message match for key pages' },
      { de: 'lokale und B2B-Chancen für die Schweiz', en: 'local and B2B opportunities in Switzerland' },
      { de: 'priorisierte Content- und Authority-Lücken', en: 'prioritized content and authority gaps' },
    ],
    processTitle: { de: 'Entscheidungslogik', en: 'Decision logic' },
    process: [
      { title: { de: 'Nachfrage', en: 'Demand' }, text: { de: 'Suchbegriffe werden nur mit belastbarer Quelle bewertet; fehlende Tooldaten bleiben offen.', en: 'Search terms are only assessed with a reliable source; unavailable tool data remains explicitly open.' } },
      { title: { de: 'Relevanz', en: 'Relevance' }, text: { de: 'Intent, Angebot und Zielgruppe müssen zusammenpassen.', en: 'Intent, offer and audience must align.' } },
      { title: { de: 'Wirkung', en: 'Impact' }, text: { de: 'Priorisiert wird nach Lead-Wert, Umsetzbarkeit und Messbarkeit.', en: 'Priorities reflect lead value, feasibility and measurability.' } },
    ],
    audienceTitle: { de: 'Geeignet für', en: 'Best suited for' },
    audiences: [
      { de: 'KMU mit organischem Potenzial, aber unklarer Seitenarchitektur', en: 'SMEs with organic potential but unclear site architecture' },
      { de: 'lokale Dienstleister mit schwacher regionaler Auffindbarkeit', en: 'local service businesses with weak regional visibility' },
      { de: 'B2B-Anbieter mit langen, wertvollen Entscheidungswegen', en: 'B2B providers with long, high-value decision journeys' },
    ],
    evidenceNote: {
      de: 'Suchvolumen, Keyword Difficulty und CPC werden nur gezeigt, wenn die verbundene Datenquelle sie tatsächlich liefert. Rankings oder Sichtbarkeit in Google werden nicht garantiert.',
      en: 'Search volume, keyword difficulty and CPC are only shown when the connected source actually provides them. Google rankings or visibility are never guaranteed.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'SEO-Analyse anfragen', en: 'Request an SEO analysis' },
    primaryPath: '/kontakt?topic=seo',
    primaryPathEn: '/en/contact?topic=seo',
    secondaryCta: { de: 'Quick Audit starten', en: 'Start the Quick Audit' },
    secondaryPath: '/audit?type=seo',
    secondaryPathEn: '/en/audit?type=seo',
    serviceSchema: true,
  },
  'ai-visibility': {
    slug: '/ai-visibility',
    slugEn: '/en/ai-visibility',
    eyebrow: { de: 'AI Search Visibility', en: 'AI Search Visibility' },
    title: { de: 'In AI-Antworten verständlich und zitierfähig werden', en: 'Become understandable and citable in AI-generated answers' },
    description: {
      de: 'AI-Visibility-Analyse für Schweizer Unternehmen: Entity-Klarheit, semantische Abdeckung, Quellen, strukturierte Antworten und technische Zugänglichkeit.',
      en: 'AI visibility analysis for Swiss businesses covering entity clarity, semantic coverage, sources, structured answers and technical accessibility.',
    },
    intro: {
      de: 'AI Visibility ist kein geheimer Ranking-Schalter. Sie entsteht, wenn eine Marke, ihre Leistungen und ihre überprüfbaren Aussagen im Web konsistent, zugänglich und eindeutig beschrieben sind.',
      en: 'AI visibility is not a hidden ranking switch. It grows when a brand, its services and its verifiable claims are described consistently, accessibly and clearly across the web.',
    },
    deliverablesTitle: { de: 'Was geprüft wird', en: 'What is assessed' },
    deliverables: [
      { de: 'eindeutige Marken- und Entity-Definition', en: 'clear brand and entity definition' },
      { de: 'Leistungen, Zielgruppen, Methodik und Verantwortlichkeit', en: 'services, audiences, methodology and accountability' },
      { de: 'strukturierte Antworten, FAQs und zitierfähige Fakten', en: 'structured answers, FAQs and citable facts' },
      { de: 'Schema, interne Verlinkung und technische Zugänglichkeit', en: 'schema, internal linking and technical accessibility' },
      { de: 'Quellen- und Authority-Lücken', en: 'source and authority gaps' },
    ],
    processTitle: { de: 'Nachvollziehbare Optimierung', en: 'Explainable optimization' },
    process: [
      { title: { de: 'Entity', en: 'Entity' }, text: { de: 'Name, Angebot, Ort und Beziehung zu anderen Projekten werden eindeutig.', en: 'Name, offer, location and relationship to other projects become unambiguous.' } },
      { title: { de: 'Antworten', en: 'Answers' }, text: { de: 'Wichtige Fragen erhalten klare, belegbare Antworten statt Marketingfloskeln.', en: 'Important questions receive clear, supportable answers rather than marketing slogans.' } },
      { title: { de: 'Autorität', en: 'Authority' }, text: { de: 'Eigene Evidenz, Fachinhalte und externe Quellen werden systematisch aufgebaut.', en: 'First-party evidence, expertise and external sources are developed systematically.' } },
    ],
    audienceTitle: { de: 'Geeignet für', en: 'Best suited for' },
    audiences: [
      { de: 'Unternehmen, deren Angebot online schwer eindeutig einzuordnen ist', en: 'companies whose offer is hard to classify online' },
      { de: 'B2B-Anbieter mit erklärungsbedürftigen Leistungen', en: 'B2B providers with complex services' },
      { de: 'Marken, die in Google, ChatGPT und anderen Antwortsystemen konsistenter erscheinen möchten', en: 'brands seeking more consistent representation in Google, ChatGPT and other answer systems' },
    ],
    evidenceNote: {
      de: 'Kein Anbieter kann eine Nennung oder Platzierung in ChatGPT, Google AI Overviews oder anderen generativen Systemen garantieren. Gemessen werden umsetzbare Grundlagen und beobachtbare Erwähnungen.',
      en: 'No provider can guarantee a mention or placement in ChatGPT, Google AI Overviews or other generative systems. We measure actionable foundations and observable mentions.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'AI-Visibility-Analyse anfragen', en: 'Request an AI visibility analysis' },
    primaryPath: '/kontakt?topic=ai-visibility',
    primaryPathEn: '/en/contact?topic=ai-visibility',
    secondaryCta: { de: 'Methodik ansehen', en: 'See the methodology' },
    secondaryPath: '/ueber-uns',
    secondaryPathEn: '/en/about',
    serviceSchema: true,
  },
  automation: {
    slug: '/automation',
    slugEn: '/en/automation',
    eyebrow: { de: 'CRM & Automatisierung', en: 'CRM & automation' },
    title: { de: 'Repetitive Arbeit reduzieren. KI sinnvoll einsetzen.', en: 'Reduce repetitive work. Make AI useful.' },
    description: {
      de: 'Wir beobachten Ihre tatsächlichen Arbeitsabläufe, dokumentieren Daten und Entscheidungen und setzen passende KI-Automationen mit menschlichen Freigaben um.',
      en: 'We observe your real workflows, document data and decisions, and implement suitable AI automations with explicit human approvals.',
    },
    intro: {
      de: 'Von der Anfrage bis zur Übergabe: Wir nehmen echte Arbeitsschritte auf, messen Engpässe und bauen zuerst den kleinsten sicheren Ablauf. Erst bestätigte Module werden zu einem KI-Betriebssystem verbunden.',
      en: 'From enquiry to handoff, we observe real work, measure constraints and build the smallest safe workflow first. Only validated modules become a connected AI operating system.',
    },
    deliverablesTitle: { de: 'Prüfbereiche', en: 'What is assessed' },
    deliverables: [
      { de: 'Prozesskarten mit Auslösern, Rollen, Entscheidungen und Ausnahmen', en: 'process cards with triggers, owners, decisions and exceptions' },
      { de: 'Datenquellen, Systeme, Berechtigungen und manuelle Übergaben', en: 'data sources, tools, permissions and manual handoffs' },
      { de: 'Erster Automation Sprint mit klarer menschlicher Freigabe', en: 'first automation sprint with explicit human approval' },
      { de: 'Shadow Mode, Testfälle, Fehlerbehandlung und Rückfallweg', en: 'shadow mode, test cases, error handling and rollback' },
      { de: 'Vorher/Nachher-Kennzahlen, Dokumentation und laufende Verbesserung', en: 'before/after metrics, documentation and ongoing improvement' },
    ],
    processTitle: { de: 'Vom Prozess zur Automation', en: 'From process to automation' },
    process: [
      { title: { de: 'Abbilden', en: 'Map' }, text: { de: 'Der reale Lead-Weg wird als Status- und Übergabekette dokumentiert.', en: 'The real lead journey is documented as a lifecycle and handoff chain.' } },
      { title: { de: 'Bereinigen', en: 'Clean' }, text: { de: 'Datenmodell, Pflichtfelder und Verantwortungen werden geklärt.', en: 'Data model, required fields and ownership are clarified.' } },
      { title: { de: 'Automatisieren', en: 'Automate' }, text: { de: 'Nur stabile, messbare Schritte werden automatisiert.', en: 'Only stable, measurable steps are automated.' } },
    ],
    audienceTitle: { de: 'Typische Signale', en: 'Typical signals' },
    audiences: [
      { de: 'Anfragen liegen in Postfächern, Tabellen und mehreren Tools.', en: 'Enquiries are scattered across inboxes, spreadsheets and tools.' },
      { de: 'Niemand kann Lead-Quelle und Umsatz zuverlässig verbinden.', en: 'No one can reliably connect lead source with revenue.' },
      { de: 'Follow-ups hängen von einzelnen Personen ab.', en: 'Follow-up depends on individual memory.' },
    ],
    evidenceNote: {
      de: 'Wir arbeiten mit zweckgebundenen Zugängen. Preise, Verträge, Zahlungen, Löschungen und fachlich kritische Inhalte bleiben menschlich freigegeben. Keine automatisierten Ergebnisse ohne echte Abnahme.',
      en: 'We work with purpose-limited access. Pricing, contracts, payments, deletions and high-stakes professional decisions retain human approval. No automation is claimed live before actual acceptance.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'Persönlichen KI-Partner anfragen', en: 'Request a personal AI partner' },
    primaryPath: '/kontakt?topic=automation',
    primaryPathEn: '/en/contact?topic=automation',
    secondaryCta: { de: 'Leistungen ansehen', en: 'View services' },
    secondaryPath: '/leistungen',
    secondaryPathEn: '/en/services',
    serviceSchema: true,
  },
  leistungen: {
    slug: '/leistungen',
    slugEn: '/en/services',
    eyebrow: { de: 'Angebotsleiter', en: 'Offer ladder' },
    title: { de: 'Von der Prozessaufnahme zum KI-Betriebssystem', en: 'From process discovery to an AI operating system' },
    description: {
      de: 'Kostenloser Website-Quick-Check, persönlicher AI Operations Audit, Automation Sprint, vernetztes KI-Betriebssystem und laufende Betreuung für Schweizer KMU.',
      en: 'Free website Quick Check, personal AI Operations Audit, automation sprint, connected AI operating system and ongoing support for Swiss SMEs.',
    },
    intro: {
      de: 'Jede Stufe hat einen anderen Zweck. Sie kaufen nicht automatisch eine Umsetzung, nur weil Sie einen Audit starten.',
      en: 'Each stage has a distinct purpose. Starting an audit does not automatically commit you to implementation.',
    },
    deliverablesTitle: { de: 'Fünf Angebotsstufen', en: 'Five offer stages' },
    deliverables: [
      { de: '1 · Kostenloser Website-Quick-Check – öffentliche Signale als erster Einstieg', en: '1 · Free website Quick Check—public signals as an initial entry point' },
      { de: '2 · AI Operations Audit – Arbeitsabläufe, Systeme, Baseline und Umsetzungsplan', en: '2 · AI Operations Audit—workflows, systems, baseline and implementation blueprint' },
      { de: '3 · Automation Sprint – einen Prozess implementieren, testen und messen', en: '3 · Automation Sprint—implement, test and measure one workflow' },
      { de: '4 · AI Operating System – geprüfte Abläufe und Integrationen verbinden', en: '4 · AI Operating System—connect validated workflows and integrations' },
      { de: '5 · Persönlicher KI-Partner – Betrieb, Schulung, Monitoring und Verbesserungen', en: '5 · Personal AI partner—operations, training, monitoring and improvements' },
    ],
    processTitle: { de: 'Wie der Umfang entsteht', en: 'How scope is set' },
    process: [
      { title: { de: 'Befund', en: 'Finding' }, text: { de: 'Der Audit zeigt den Engpass, nicht automatisch eine Standardlösung.', en: 'The audit identifies the constraint rather than forcing a standard solution.' } },
      { title: { de: 'Abgrenzung', en: 'Scope' }, text: { de: 'Ziel, Systeme, Deliverables und Abnahmekriterien werden festgelegt.', en: 'Goal, systems, deliverables and acceptance criteria are defined.' } },
      { title: { de: 'Offerte', en: 'Proposal' }, text: { de: 'Preis und Zeitplan folgen erst auf den bestätigten Umfang.', en: 'Price and timeline follow only after scope is confirmed.' } },
    ],
    audienceTitle: { de: 'Mögliche Schwerpunkte', en: 'Possible focus areas' },
    audiences: [
      { de: 'Anfragebearbeitung, Offertenerstellung und Kundenkommunikation', en: 'enquiries, quote preparation and customer communication' },
      { de: 'Dokumentation, Berichte, Termine und administrative Übergaben', en: 'documentation, reporting, scheduling and administrative handoffs' },
      { de: 'CRM, Automationen, Datenqualität, Analytics und KI-Sichtbarkeit', en: 'CRM, automation, data quality, analytics and AI visibility' },
    ],
    evidenceNote: {
      de: 'Konkrete Preise werden erst nach freigegebenem Umfang angeboten. Auf dieser Seite stehen bewusst keine ungeprüften oder verbindlichen Preisangaben.',
      en: 'Specific prices are proposed only after scope is approved. This page intentionally contains no unapproved or binding price claims.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'Analyse anfragen', en: 'Request an analysis' },
    primaryPath: '/kontakt?topic=offer',
    primaryPathEn: '/en/contact?topic=offer',
    secondaryCta: { de: 'Quick Audit starten', en: 'Start the Quick Audit' },
    secondaryPath: '/audit',
    secondaryPathEn: '/en/audit',
    serviceSchema: true,
  },
  'fuer-kmu': {
    slug: '/fuer-kmu',
    slugEn: '/en/for-smes',
    eyebrow: { de: 'Zielgruppen', en: 'Audiences' },
    title: { de: 'Für Schweizer KMU mit echten Arbeitsabläufen', en: 'For Swiss SMEs with real operational workflows' },
    description: {
      de: 'Wir unterstützen inhabergeführte Schweizer KMU mit wiederkehrender Administration, verstreuten Daten und zeitaufwendigen Übergaben. Die Umsetzung erfolgt persönlich, prozessbezogen und messbar.',
      en: 'We support owner-led Swiss SMEs dealing with recurring administration, fragmented data and time-consuming handoffs. Implementation is personal, workflow-led and measurable.',
    },
    intro: {
      de: 'Wir verwenden dieselbe Transformationsmethode, passen Prozesskarten, Automationen und Freigaben aber an Branche und Unternehmen an. Der Kunde erklärt seinen Betrieb, wir übernehmen den Aufbau.',
      en: 'We use the same transformation method while adapting process maps, automations and approval gates to each industry and company. The customer explains the business; we implement.',
    },
    deliverablesTitle: { de: 'Priorisierte Segmente', en: 'Priority segments' },
    deliverables: [
      { de: 'Inhabergeführte Bau-, Inspektions- und dokumentationsintensive Betriebe', en: 'Owner-led construction, inspection and documentation-intensive businesses' },
      { de: 'Gastronomie, Take-away, Foodtruck und Catering mit wiederkehrenden Prozessen', en: 'Restaurants, takeaway, foodtrucks and catering with recurring workflows' },
      { de: 'Werkstätten, Umzug/Räumung, Plattformen und terminbasierte Dienstleistungen', en: 'Repair workshops, field services, marketplaces and appointment businesses' },
      { de: 'Partner: Agenturen, IT-Dienstleister und Berater mit ergänzendem Bedarf', en: 'Partners: agencies, IT providers and consultants with complementary needs' },
      { de: 'Später: standardisierte White-Label- oder SaaS-Anwendungen', en: 'Later: standardized white-label or SaaS applications' },
    ],
    processTitle: { de: 'Qualifizierung vor Empfehlung', en: 'Qualification before recommendation' },
    process: [
      { title: { de: 'Lead-Wert', en: 'Lead value' }, text: { de: 'Ist eine zusätzliche qualifizierte Anfrage wirtschaftlich relevant?', en: 'Is an additional qualified enquiry economically meaningful?' } },
      { title: { de: 'Messbarkeit', en: 'Measurability' }, text: { de: 'Können Quelle, Status und Ergebnis sauber verbunden werden?', en: 'Can source, lifecycle stage and outcome be connected reliably?' } },
      { title: { de: 'Umsetzung', en: 'Execution' }, text: { de: 'Gibt es Kapazität und Verantwortlichkeit für die nächsten Schritte?', en: 'Is there capacity and ownership for the next steps?' } },
    ],
    audienceTitle: { de: 'Nicht ideal', en: 'Not a good fit' },
    audiences: [
      { de: 'Unternehmen, die garantierte Rankings oder garantierten Umsatz erwarten', en: 'companies expecting guaranteed rankings or revenue' },
      { de: 'sehr frühe Ideen ohne Angebot, Kunden oder verwertbare Daten', en: 'very early ideas without an offer, customers or usable data' },
      { de: 'Projekte, die nur eine unverbundene Einzeltaktik ohne Messplan suchen', en: 'projects seeking an isolated tactic without a measurement plan' },
    ],
    evidenceNote: {
      de: 'Reinigungs-, Umzugs- oder Räumungsleistungen sind kein Angebot von itsFeierabend.ch. Solche Branchen können lediglich als digitale Audit-Zielgruppe vorkommen.',
      en: 'itsFeierabend.ch does not provide cleaning, moving or clearance services. Those industries may only appear as digital audit audiences.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'Eignung im Quick Audit prüfen', en: 'Check fit in the Quick Audit' },
    primaryPath: '/audit',
    primaryPathEn: '/en/audit',
    secondaryCta: { de: 'Beratung anfragen', en: 'Request a consultation' },
    secondaryPath: '/kontakt',
    secondaryPathEn: '/en/contact',
  },
  partner: {
    slug: '/partner',
    slugEn: '/en/partners',
    eyebrow: { de: 'Partner & Referral', en: 'Partners & referral' },
    title: { de: 'Audits als belastbarer Einstieg für Partner', en: 'Audits as a credible entry point for partners' },
    description: {
      de: 'Partner-Modell für Schweizer Agenturen, Berater und IT-Dienstleister: Diagnose, qualifizierte Übergabe und klar getrennte Verantwortlichkeiten.',
      en: 'Partner model for Swiss agencies, consultants and IT providers: diagnosis, qualified handoff and clearly separated responsibilities.',
    },
    intro: {
      de: 'Ein Partner-Audit soll keine Leads abziehen. Er schafft eine gemeinsame, dokumentierte Ausgangslage und macht sichtbar, wer welchen Teil sinnvoll übernimmt.',
      en: 'A partner audit is not designed to take leads away. It creates a shared, documented baseline and clarifies who should own each part.',
    },
    deliverablesTitle: { de: 'Mögliche Zusammenarbeit', en: 'Possible collaboration' },
    deliverables: [
      { de: 'Referral: qualifizierter Audit-Lead mit transparenter Übergabe', en: 'referral: qualified audit lead with a transparent handoff' },
      { de: 'Co-Delivery: Diagnose durch itsFeierabend.ch, Umsetzung gemeinsam', en: 'co-delivery: diagnosis by itsFeierabend.ch, implementation together' },
      { de: 'White Label später: standardisierte Reports und Prozesse', en: 'future white label: standardized reports and processes' },
      { de: 'klare Daten- und Mandantentrennung', en: 'clear data and tenant separation' },
    ],
    processTitle: { de: 'Partner-Qualifizierung', en: 'Partner qualification' },
    process: [
      { title: { de: 'Fit', en: 'Fit' }, text: { de: 'Zielgruppe, Kompetenz und Interessenkonflikte werden geklärt.', en: 'Audience, capabilities and conflicts of interest are clarified.' } },
      { title: { de: 'Pilot', en: 'Pilot' }, text: { de: 'Ein begrenzter Fall prüft Übergabe, Qualität und Kommunikation.', en: 'A limited case tests handoff, quality and communication.' } },
      { title: { de: 'Modell', en: 'Model' }, text: { de: 'Referral, Co-Delivery oder später White Label wird schriftlich abgegrenzt.', en: 'Referral, co-delivery or future white label is clearly documented.' } },
    ],
    audienceTitle: { de: 'Geeignet für', en: 'Best suited for' },
    audiences: [
      { de: 'Web- und Marketingagenturen ohne eigenes bereichsübergreifendes Audit', en: 'web and marketing agencies without a cross-functional audit' },
      { de: 'IT-Dienstleister mit CRM-, Daten- oder Automatisierungskompetenz', en: 'IT providers with CRM, data or automation capabilities' },
      { de: 'Berater und Branchenplattformen mit hochwertigen KMU-Kontakten', en: 'consultants and industry platforms with high-quality SME relationships' },
    ],
    evidenceNote: {
      de: 'Partnerschaften, Provisionen oder White-Label-Leistungen werden nicht öffentlich behauptet, bevor sie vertraglich und operativ bestätigt sind.',
      en: 'Partnerships, commissions or white-label services are not publicly claimed before they are contractually and operationally confirmed.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'Partnergespräch anfragen', en: 'Request a partner conversation' },
    primaryPath: '#anfrage',
    primaryPathEn: '#enquiry',
    inquiryType: 'partner',
  },
  'ueber-uns': {
    slug: '/ueber-uns',
    slugEn: '/en/about',
    eyebrow: { de: 'Methodik & Verantwortung', en: 'Methodology & accountability' },
    title: { de: 'Ihr persönlicher KI-Partner – vom ersten Prozess bis zum Betrieb', en: 'Your personal AI partner, from the first workflow to operations' },
    description: {
      de: 'Über itsFeierabend.ch: persönlicher KI-Transformationspartner mit Prozessaufnahme, geprüfter Umsetzung und laufender Betreuung für Schweizer KMU.',
      en: 'About itsFeierabend.ch: a personal AI transformation partner delivering workflow discovery, tested implementation and ongoing support for Swiss SMEs.',
    },
    intro: {
      de: 'ITSFeierabend verbindet öffentliche KI-Potenzialanalyse mit persönlicher Betriebsaufnahme, Implementierung und Verbesserung. Zuerst verstehen wir den realen Ablauf, danach automatisieren wir nur, was sich prüfen und verantworten lässt.',
      en: 'ITSFeierabend combines public opportunity analysis with personal process discovery, implementation and continuous improvement. We understand the real workflow before automating anything that must remain testable and accountable.',
    },
    deliverablesTitle: { de: 'Unsere Arbeitsprinzipien', en: 'Our operating principles' },
    deliverables: [
      { de: 'Scores entstehen aus dokumentierten Regeln, nicht aus AI-Prompts.', en: 'Scores come from documented rules, not AI prompts.' },
      { de: 'Beobachtung, Ableitung, Schätzung und Expertenprüfung bleiben getrennt.', en: 'Observation, inference, estimation and expert review remain separate.' },
      { de: 'Empfehlungen werden nach Wirkung und Aufwand priorisiert.', en: 'Recommendations are prioritized by impact and effort.' },
      { de: 'Kundendaten, Accounts und Systeme bleiben beim Kunden.', en: 'Customer data, accounts and systems remain with the customer.' },
      { de: 'Keine Fake-Logos, Fake-Testimonials oder garantierten Rankings.', en: 'No fake logos, fake testimonials or guaranteed rankings.' },
    ],
    processTitle: { de: 'Vier Evidenzebenen', en: 'Four evidence levels' },
    process: [
      { title: { de: 'Gemessen', en: 'Measured' }, text: { de: 'Ein Tool oder Request liefert einen reproduzierbaren Befund.', en: 'A tool or request provides a reproducible finding.' } },
      { title: { de: 'Angegeben', en: 'User-stated' }, text: { de: 'Der Nutzer liefert Geschäftskontext, der nicht öffentlich prüfbar ist.', en: 'The user supplies business context that is not publicly verifiable.' } },
      { title: { de: 'Geschätzt', en: 'Estimated' }, text: { de: 'Eine Annahme wird als solche sichtbar markiert.', en: 'An assumption is visibly labelled as an estimate.' } },
      { title: { de: 'Geprüft', en: 'Reviewed' }, text: { de: 'Ein Experte bestätigt oder korrigiert den vorläufigen Befund.', en: 'An expert confirms or corrects the preliminary finding.' } },
    ],
    audienceTitle: { de: 'Klare Abgrenzung', en: 'Clear boundaries' },
    audiences: [
      { de: 'itsFeierabend.ch ist keine Räumungs-, Reinigungs- oder Umzugsfirma.', en: 'itsFeierabend.ch is not a clearance, cleaning or moving company.' },
      { de: 'Verbundene Projekte werden nur als solche und ohne erfundene Resultate gezeigt.', en: 'Connected projects are shown only with transparent attribution and no invented results.' },
      { de: 'Rechtliche und wirtschaftliche Aussagen werden nicht als Garantie formuliert.', en: 'Legal and commercial statements are never framed as guarantees.' },
    ],
    evidenceNote: {
      de: 'Rechtsträger, Kontakt- und Adressangaben müssen vor dem Produktionslaunch im Impressum verifiziert ergänzt werden. Diese Methodik ersetzt keine Rechts-, Steuer- oder Unternehmensprüfung.',
      en: 'Legal entity, contact and address details must be verified and added to the imprint before production launch. This methodology is not a legal, tax or statutory business audit.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'Kostenlosen Business Audit starten', en: 'Start the free Business Audit' },
    primaryPath: '/audit',
    primaryPathEn: '/en/audit',
    secondaryCta: { de: 'Kontakt aufnehmen', en: 'Get in touch' },
    secondaryPath: '/kontakt',
    secondaryPathEn: '/en/contact',
  },
  kontakt: {
    slug: '/kontakt',
    slugEn: '/en/contact',
    eyebrow: { de: 'Kontakt', en: 'Contact' },
    title: { de: 'Welche Frage soll zuerst geklärt werden?', en: 'Which question should we answer first?' },
    description: {
      de: 'Kontaktieren Sie ITSFeierabend für einen persönlichen AI Operations Audit, einen begrenzten Automation Sprint oder die laufende KI-Begleitung Ihres Schweizer KMU.',
      en: 'Contact ITSFeierabend for a personal AI Operations Audit, a scoped automation sprint or ongoing AI implementation support for your Swiss SME.',
    },
    intro: {
      de: 'Beschreiben Sie kurz Ausgangslage und Ziel. Wir verwenden die Angaben nur zur Bearbeitung der Anfrage und schlagen keinen grösseren Umfang vor, bevor die Diagnose klar ist.',
      en: 'Briefly describe your starting point and goal. We use the information only to process the enquiry and do not propose a larger scope before the diagnostic question is clear.',
    },
    deliverablesTitle: { de: 'Gute Ausgangsinformationen', en: 'Helpful starting information' },
    deliverables: [
      { de: 'Website und Firmenname', en: 'website and company name' },
      { de: 'Branche, Region und wichtigstes Geschäftsziel', en: 'industry, region and primary business goal' },
      { de: 'grösste aktuelle Hürde', en: 'biggest current constraint' },
      { de: 'relevante Systeme wie Analytics, CRM oder Marketing Automation', en: 'relevant systems such as analytics, CRM or marketing automation' },
    ],
    processTitle: { de: 'Nächste Schritte', en: 'Next steps' },
    process: [
      { title: { de: 'Anfrage', en: 'Enquiry' }, text: { de: 'Ihre Angaben werden separat für itsFeierabend.ch erfasst.', en: 'Your details are captured separately for itsFeierabend.ch.' } },
      { title: { de: 'Einordnung', en: 'Triage' }, text: { de: 'Wir klären, ob Quick Audit, vertiefte Analyse oder Gespräch sinnvoll ist.', en: 'We determine whether a quick audit, deeper analysis or conversation is appropriate.' } },
      { title: { de: 'Abgrenzung', en: 'Scope' }, text: { de: 'Sie erhalten einen klaren nächsten Schritt oder eine abgegrenzte Offerte.', en: 'You receive a clear next step or a scoped proposal.' } },
    ],
    audienceTitle: { de: 'Direkter Kontakt', en: 'Direct contact' },
    audiences: [
      { de: 'E-Mail: hello@itsfeierabend.ch', en: 'Email: hello@itsfeierabend.ch' },
      { de: 'Standort und Rechtsträger: siehe Impressum', en: 'Location and legal entity: see imprint' },
      { de: 'Keine unaufgeforderten Newsletter ohne separate Einwilligung', en: 'No unsolicited newsletters without separate consent' },
    ],
    evidenceNote: {
      de: 'Bitte übermitteln Sie keine Passwörter, API-Schlüssel, Gesundheitsdaten oder andere besonders schützenswerte Informationen über dieses Formular.',
      en: 'Do not submit passwords, API keys, health data or other particularly sensitive information through this form.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'Anfrage senden', en: 'Send enquiry' },
    primaryPath: '#anfrage',
    primaryPathEn: '#enquiry',
    secondaryCta: { de: 'Quick Audit starten', en: 'Start the Quick Audit' },
    secondaryPath: '/audit',
    secondaryPathEn: '/en/audit',
    inquiryType: 'contact',
  },
  insights: {
    slug: '/insights',
    slugEn: '/en/insights',
    eyebrow: { de: 'Insights & Glossar', en: 'Insights & glossary' },
    title: { de: 'Wissen, das eine Entscheidung verbessert', en: 'Knowledge that improves a decision' },
    description: {
      de: 'Methodische Insights zu Website Audits, SEO-Analysen, AI Search Visibility, Lead-Funnels, CRM und Automatisierung für Schweizer KMU.',
      en: 'Methodological insights on website audits, SEO analysis, AI search visibility, lead funnels, CRM and automation for Swiss SMEs.',
    },
    intro: {
      de: 'Die Inhalte erklären Begriffe, Messgrenzen und praktische Entscheidungen. Sie versprechen keine Rankings und ersetzen keine Prüfung mit echten Unternehmensdaten.',
      en: 'These resources explain concepts, measurement limits and practical decisions. They do not promise rankings or replace analysis with real company data.',
    },
    deliverablesTitle: { de: 'Kernbegriffe', en: 'Core concepts' },
    deliverables: [
      { de: 'AI Business Audit: bereichsübergreifende digitale Standortbestimmung', en: 'AI Business Audit: cross-functional digital business baseline' },
      { de: 'AI Visibility: technische und semantische Zitierfähigkeit in Antwortsystemen', en: 'AI visibility: technical and semantic citability in answer systems' },
      { de: 'Lead Attribution: Verbindung von Quelle, Anfrage, Status und Umsatz', en: 'lead attribution: connecting source, enquiry, lifecycle and revenue' },
      { de: 'Conversion Readiness: Klarheit, Vertrauen und reibungsarmer nächster Schritt', en: 'conversion readiness: clarity, trust and a low-friction next action' },
      { de: 'Automation Readiness: stabile Prozesse und Daten vor Automatisierung', en: 'automation readiness: stable processes and data before automation' },
    ],
    processTitle: { de: 'Redaktioneller Standard', en: 'Editorial standard' },
    process: [
      { title: { de: 'Quelle', en: 'Source' }, text: { de: 'Messwerte erhalten Datum und Quelle; fehlende Daten bleiben als Lücke sichtbar.', en: 'Measurements include date and source; missing data remains visible as a gap.' } },
      { title: { de: 'Grenze', en: 'Limit' }, text: { de: 'Jeder Beitrag trennt Beobachtung, Ableitung und Empfehlung.', en: 'Each resource separates observation, inference and recommendation.' } },
      { title: { de: 'Handlung', en: 'Action' }, text: { de: 'Inhalte enden mit einer prüfbaren nächsten Massnahme.', en: 'Content ends with a testable next action.' } },
    ],
    audienceTitle: { de: 'Startpunkte', en: 'Starting points' },
    audiences: [
      { de: 'Warum ein Score ohne Evidenz wertlos ist', en: 'Why a score without evidence is useless' },
      { de: 'Welche Website-Signale automatisch messbar sind – und welche nicht', en: 'Which website signals can be measured automatically—and which cannot' },
      { de: 'Warum AI Visibility keine garantierbare Ranking-Leistung ist', en: 'Why AI visibility is not a guaranteed ranking service' },
    ],
    evidenceNote: {
      de: 'Für Marktkennzahlen werden externe Quellen wie Semrush nur verwendet, wenn der Zugriff tatsächlich Daten liefert. Am 25. Juli 2026 waren die verbundenen Semrush-API-Einheiten ausgeschöpft; deshalb werden hier keine Volumen-, KD- oder CPC-Werte behauptet.',
      en: 'External market sources such as Semrush are used only when access actually returns data. On 25 July 2026 the connected Semrush API units were exhausted, so no volume, KD or CPC figures are claimed here.',
    },
    faq: sharedAuditFaq,
    primaryCta: { de: 'Quick Audit starten', en: 'Start the Quick Audit' },
    primaryPath: '/audit',
    primaryPathEn: '/en/audit',
    secondaryCta: { de: 'Methodik ansehen', en: 'See the methodology' },
    secondaryPath: '/ueber-uns',
    secondaryPathEn: '/en/about',
  },
};

export function localized(text: LocalizedText, language: Language): string {
  return text[language];
}
