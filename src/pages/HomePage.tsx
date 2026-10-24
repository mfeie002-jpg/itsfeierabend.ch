import { ArrowRight, ArrowUpRight, Check, Info, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CTAButton } from '@/components/CTAButton';
import {
  FAQSchema,
  OrganizationSchema,
  SEOHead,
  WebsiteSchema,
} from '@/components/SEOHead';
import { useLanguage } from '@/i18n/LanguageContext';

const auditAreas = {
  de: [
    ['Website & Technik', 'öffentlich messbar'],
    ['SEO & lokale Sichtbarkeit', 'teilweise messbar'],
    ['AI Search Visibility', 'beobachtbar'],
    ['Conversion & Vertrauen', 'messbar + Kontext'],
    ['Tracking, CRM & Automation', 'Kontext + Prüfung'],
  ],
  en: [
    ['Website & technical health', 'publicly measurable'],
    ['SEO & local visibility', 'partly measurable'],
    ['AI Search Visibility', 'observable'],
    ['Conversion & trust', 'measurement + context'],
    ['Tracking, CRM & automation', 'context + review'],
  ],
};

const businessQuestions = {
  de: [
    'Welche wiederkehrenden Abläufe kosten Ihr Team jede Woche Zeit?',
    'Welche Entscheidungen kann KI vorbereiten, ohne dass Sie Kontrolle verlieren?',
    'Wo gehen Informationen, Anfragen und Aufgaben zwischen Systemen verloren?',
    'Welche Automation lohnt sich zuerst – und was bleibt besser beim Menschen?',
  ],
  en: [
    'Which recurring tasks take up your team’s time each week?',
    'Which decisions can AI prepare while you retain control?',
    'Where do information, enquiries and tasks get lost between systems?',
    'Which automation should come first—and which decisions should stay human?',
  ],
};

const method = {
  de: [
    ['Erfassen', 'Öffentliche Signale und freiwillige Geschäftsdaten bleiben getrennt.'],
    ['Normalisieren', 'Jeder Befund erhält Quelle, Konfidenz und einen definierten Wertebereich.'],
    ['Bewerten', 'Deterministische Regeln berechnen Kategorien und Gesamtscore.'],
    ['Priorisieren', 'Der Quick Audit priorisiert regelbasiert nach gewichteten Lücken. KI- und Experteneinordnung folgt nur im vertieften Audit.'],
  ],
  en: [
    ['Collect', 'Public signals and voluntary business inputs remain separate.'],
    ['Normalize', 'Every finding receives a source, confidence and defined range.'],
    ['Score', 'Deterministic rules calculate category and overall scores.'],
    ['Prioritize', 'The Quick Audit ranks weighted gaps by deterministic rules. AI and expert interpretation are reserved for a deeper audit.'],
  ],
};

const offerLadder = {
  de: [
    ['01', 'Kostenloser Website-Quick-Check', 'Öffentlich erkennbare Website-Signale als vorläufiger Einstieg. Kein Ersatz für eine interne Prozessanalyse.'],
    ['02', 'AI Operations Audit', 'Wir erfassen reale Arbeitsabläufe, Systeme, Zeitaufwand, Daten und Freigaben. Daraus entsteht ein persönlicher Umsetzungsplan.'],
    ['03', 'Automation Sprint', 'Wir setzen einen klar abgegrenzten Prozess um, testen Sonderfälle und messen die Wirkung. Verbindliche Entscheidungen bleiben freigegeben.'],
    ['04', 'AI Operating System', 'Mehrere geprüfte Abläufe, Integrationen und Mitarbeitende arbeiten in einem kontrollierten System zusammen.'],
    ['05', 'Ihr laufender KI-Partner', 'Persönliche Betreuung, Schulung, Monitoring und schrittweise Verbesserung statt Softwareübergabe ohne Verantwortung.'],
  ],
  en: [
    ['01', 'Free website Quick Check', 'Preliminary publicly observable website signals. This is not an audit of your internal operations.'],
    ['02', 'AI Operations Audit', 'We map real processes, tools, time, data and approvals to build a tailored implementation blueprint.'],
    ['03', 'Automation Sprint', 'We implement one scoped workflow, test exceptions and measure the effect, with explicit human approvals.'],
    ['04', 'AI Operating System', 'Connect several validated workflows, people and integrations into one controlled operating system.'],
    ['05', 'Ongoing personal AI partner', 'Personal implementation, training, monitoring and continuous improvement rather than handing over a tool and disappearing.'],
  ],
};

const faqs = {
  de: [
    {
      question: 'Was ist itsFeierabend.ch?',
      answer: 'itsFeierabend.ch ist Ihr persönlicher Schweizer KI-Transformationspartner für KMU. Wir nehmen echte Arbeitsabläufe auf, bauen sichere, überprüfbare Automationen, schulen Ihr Team und verbessern das System laufend. Der kostenlose Website-Quick-Check zeigt nur öffentlich sichtbare Signale und ersetzt keine interne Betriebsanalyse.',
    },
    {
      question: 'Ist der kostenlose Audit eine Fake-AI-Demo?',
      answer: 'Nein. Öffentlich messbare Signale werden regelbasiert bewertet. Selbstangaben, Schätzungen und manuell zu prüfende Punkte werden sichtbar getrennt. Wenn ein Scan technisch nicht möglich ist, wird der Report als vorläufig und teilweise gekennzeichnet.',
    },
    {
      question: 'Wer ist die primäre Zielgruppe?',
      answer: 'Inhabergeführte Schweizer KMU mit wiederkehrender Administration, manuellen Übergaben und begrenzter Zeit für Tool-Experimente. Besonders geeignet sind Betriebe mit einem klaren Prozessverantwortlichen und messbarem Arbeitsvolumen.',
    },
    {
      question: 'Gibt es feste Preise?',
      answer: 'Für den kostenlosen Quick Audit nicht. Vertiefte Audits, Sprints und Betreuung werden nach bestätigtem Umfang offeriert. Ohne Freigabe werden keine konkreten Preise veröffentlicht.',
    },
    {
      question: 'Garantiert AI Visibility eine Nennung in ChatGPT?',
      answer: 'Nein. Keine Agentur kann Nennungen oder Rankings in ChatGPT, Google AI Overviews oder anderen Antwortsystemen garantieren. Optimiert werden nachvollziehbare Grundlagen wie Entity-Klarheit, Zugänglichkeit, Fakten, Quellen und semantische Abdeckung.',
    },
  ],
  en: [
    {
      question: 'What is itsFeierabend.ch?',
      answer: 'itsFeierabend.ch is a personal AI transformation and implementation partner for Swiss SMEs. We map real workflows, build controlled automations, train your team and continually improve the system. The free website Quick Check only covers public signals, not your internal operations.',
    },
    {
      question: 'Is the free audit a fake AI demo?',
      answer: 'No. Publicly measurable signals are scored by rules. User inputs, estimates and items requiring expert review are clearly separated. If a technical scan is not possible, the report is labelled preliminary and partial.',
    },
    {
      question: 'Who is the primary audience?',
      answer: 'Owner-led Swiss SMEs with recurring administration, manual handoffs and little time for tool experiments. A clear process owner and measurable work volume are ideal starting conditions.',
    },
    {
      question: 'Are there fixed prices?',
      answer: 'The Quick Audit is free. Deep audits, sprints and ongoing support are proposed after scope is confirmed. No specific prices are published without approval.',
    },
    {
      question: 'Does AI visibility guarantee a mention in ChatGPT?',
      answer: 'No. No agency can guarantee mentions or rankings in ChatGPT, Google AI Overviews or other answer systems. We optimize explainable foundations such as entity clarity, accessibility, facts, sources and semantic coverage.',
    },
  ],
};

export default function HomePage() {
  const { isEnglish } = useLanguage();
  const lang = isEnglish ? 'en' : 'de';
  const auditPath = isEnglish ? '/en/audit' : '/audit';
  const auditLandingPath = isEnglish ? '/en/ai-business-audit' : '/ai-business-audit';
  const servicesPath = isEnglish ? '/en/services' : '/leistungen';
  const casesPath = isEnglish ? '/en/case-studies' : '/fallstudien';
  const partnerPath = isEnglish ? '/en/partners' : '/partner';
  const faqItems = faqs[lang];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Personal AI transformation partner for Swiss SMEs' : 'Persönlicher KI-Partner für Schweizer KMU'}
        description={isEnglish
          ? 'We observe your business workflows, build controlled AI automations and personally support your team from implementation to measurable operations. Start with a free website Quick Check.'
          : 'Wir erfassen echte Geschäftsabläufe, entwickeln sichere KI-Automationen und begleiten Schweizer KMU persönlich von der Umsetzung bis zur Messung. Einstieg mit kostenlosem Website-Quick-Check.'}
        canonical={isEnglish ? 'https://itsfeierabend.ch/en' : 'https://itsfeierabend.ch/'}
      />
      <OrganizationSchema
        description={isEnglish
          ? 'Personal Swiss AI transformation and implementation partner for SMEs.'
          : 'Persönlicher Schweizer KI-Transformations- und Umsetzungspartner für KMU.'}
      />
      <WebsiteSchema />
      <FAQSchema items={faqItems} />

      <section className="border-b border-border pb-12 pt-10 md:pb-20 md:pt-16">
        <div className="container-section">
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="rounded-md border border-border bg-card p-7 sm:p-10 lg:col-span-8 lg:min-h-[560px] lg:p-12">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-background px-3">
                    <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {isEnglish ? 'Personal AI partner for Swiss SMEs' : 'Persönlicher KI-Partner für Schweizer KMU'}
                    </span>
                  </div>
                  <h1 className="mt-8 max-w-5xl text-balance">
                    {isEnglish
                      ? 'Less administration. Better workflows. Your personal AI partner.'
                      : 'Weniger Administration. Bessere Abläufe. Ihr persönlicher KI-Partner.'}
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {isEnglish
                      ? 'We observe how your business works, build tailored AI-assisted workflows and personally support your team through testing, rollout and ongoing improvement. You retain control of important decisions.'
                      : 'Wir erfassen Ihre täglichen Arbeitsabläufe, bauen passende KI-Automationen und begleiten Ihr Team persönlich bei Tests, Einführung und Betrieb. Wichtige Entscheidungen bleiben bei Ihnen.'}
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <CTAButton variant="primary" size="lg" href={auditPath} location="hero" className="min-h-12">
                    {isEnglish ? 'Start the free Business Audit' : 'Kostenlosen Business Audit starten'}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </CTAButton>
                  <a
                    href="#methodik"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-foreground/40 px-8 py-4 text-base font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    {isEnglish ? 'How it works' : 'So funktioniert’s'}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border bg-card p-6 sm:p-8 lg:col-span-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {isEnglish ? 'Audit map' : 'Audit-Landkarte'}
                </p>
                <span className="rounded-full border border-signal/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-signal">
                  {isEnglish ? 'Evidence first' : 'Evidenz zuerst'}
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {auditAreas[lang].map(([area, evidence], index) => (
                  <li key={area} className="rounded-sm border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="font-medium">{area}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{evidence}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                {isEnglish
                  ? 'No sample score is presented as a real measurement.'
                  : 'Kein Beispiel-Score wird als echte Messung dargestellt.'}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {(isEnglish
              ? ['Observe real work', 'Human approvals', 'Provenance over promises', 'Personal Swiss partner']
              : ['Echte Abläufe aufnehmen', 'Menschliche Freigaben', 'Belege statt Versprechen', 'Persönlich in der Schweiz']
            ).map((claim) => (
              <div key={claim} className="flex min-h-20 items-end rounded-md border border-border bg-card p-4">
                <span className="text-sm font-medium">{claim}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              01 · {isEnglish ? 'Business questions' : 'Geschäftsfragen'}
            </p>
            <h2 className="mt-4 text-balance">
              {isEnglish ? 'AI starts with the way your business actually works.' : 'KI beginnt dort, wo Ihr Betrieb täglich arbeitet.'}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {businessQuestions[lang].map((question) => (
                <li key={question} className="flex gap-4 py-6">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                  <span className="text-lg leading-relaxed md:text-xl">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="methodik" className="scroll-mt-24 border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                02 · {isEnglish ? 'Methodology' : 'Methodik'}
              </p>
              <h2 className="mt-4 max-w-4xl text-balance">
                {isEnglish
                  ? 'The Quick Audit scores evidence by rule—not by AI guesswork.'
                  : 'Der Quick Audit bewertet Evidenz regelbasiert – nicht per KI-Schätzung.'}
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {isEnglish
                  ? 'The free result covers static, publicly accessible homepage signals. Business inputs are captured separately; AI and expert interpretation begin only in a deeper, agreed audit.'
                  : 'Das kostenlose Resultat deckt statische, öffentlich erreichbare Homepage-Signale ab. Geschäftsangaben bleiben separat; KI- und Experteneinordnung beginnt erst in einem vereinbarten vertieften Audit.'}
              </p>
            </div>
            <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <Link
                to={auditLandingPath}
                className="inline-flex min-h-12 items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-foreground/75 hover:text-foreground"
              >
                {isEnglish ? 'Full audit methodology' : 'Vollständige Audit-Methodik'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            {method[lang].map(([title, text], index) => (
              <li key={title} className="bg-background p-7">
                <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              03 · {isEnglish ? 'Example output' : 'Beispiel-Ausgabe'}
            </p>
            <h2 className="mt-4 text-balance">
              {isEnglish ? 'A result you can act on.' : 'Ein Resultat, mit dem Sie arbeiten können.'}
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {isEnglish
                ? 'This illustration shows the structure of a report, not findings for a real company.'
                : 'Diese Darstellung zeigt die Struktur eines Reports – keine Befunde eines realen Unternehmens.'}
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-md border border-border bg-card p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {isEnglish ? 'Report structure' : 'Reportstruktur'}
                </span>
                <span className="rounded-full border border-border px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {isEnglish ? 'Illustration · no measured score' : 'Illustration · kein Messwert'}
                </span>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {(isEnglish
                  ? [
                      ['Strength', 'Clear service pages'],
                      ['Risk', 'Attribution gap'],
                      ['Opportunity', 'Faster lead routing'],
                    ]
                  : [
                      ['Stärke', 'Klare Leistungsseiten'],
                      ['Risiko', 'Lücke in der Attribution'],
                      ['Chance', 'Schnelleres Lead-Routing'],
                    ]
                ).map(([label, text]) => (
                  <div key={label} className="rounded-sm border border-border bg-background p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{label}</p>
                    <p className="mt-3 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {(isEnglish
                  ? [
                      ['High', 'Fix the measurable conversion break first.'],
                      ['Medium', 'Connect source, lead status and outcome.'],
                      ['Review', 'Validate CRM and analytics data with approved access.'],
                    ]
                  : [
                      ['Hoch', 'Zuerst den messbaren Conversion-Bruch beheben.'],
                      ['Mittel', 'Quelle, Lead-Status und Ergebnis verbinden.'],
                      ['Prüfen', 'CRM- und Analytics-Daten mit freigegebenem Zugriff validieren.'],
                    ]
                ).map(([priority, action]) => (
                  <li key={action} className="flex gap-4 py-4">
                    <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-wider text-signal">{priority}</span>
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                04 · {isEnglish ? 'Audience' : 'Zielgruppe'}
              </p>
              <h2 className="mt-4 max-w-4xl text-balance">
                {isEnglish
                  ? 'Built for SMEs where one qualified lead matters.'
                  : 'Für KMU, bei denen eine qualifizierte Anfrage zählt.'}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <Link
                to={isEnglish ? '/en/for-smes' : '/fuer-kmu'}
                className="inline-flex min-h-12 items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-foreground/75 hover:text-foreground"
              >
                {isEnglish ? 'Audience criteria' : 'Zielgruppen-Kriterien'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {(isEnglish
              ? [
                  ['Primary', 'Owner-led Swiss service and B2B SMEs with valuable leads and weak measurement or follow-up.'],
                  ['Secondary', 'Property, renovation, consulting and practice businesses with local or complex demand.'],
                  ['Partner', 'Agencies, consultants and IT providers needing an independent diagnostic layer.'],
                ]
              : [
                  ['Primär', 'Inhabergeführte Schweizer Dienstleistungs- und B2B-KMU mit wertvollen Leads und schwacher Messung oder Nachbearbeitung.'],
                  ['Sekundär', 'Immobilien-, Renovations-, Beratungs- und Praxisbetriebe mit lokaler oder erklärungsbedürftiger Nachfrage.'],
                  ['Partner', 'Agenturen, Berater und IT-Dienstleister mit Bedarf an einer unabhängigen Diagnoseebene.'],
                ]
            ).map(([label, text]) => (
              <div key={label} className="rounded-md border border-border bg-background p-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal">{label}</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                05 · {isEnglish ? 'Offer ladder' : 'Angebotsleiter'}
              </p>
              <h2 className="mt-4 max-w-4xl text-balance">
                {isEnglish ? 'Start with evidence. Expand only when it makes sense.' : 'Mit Evidenz starten. Nur sinnvoll erweitern.'}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <Link
                to={servicesPath}
                className="inline-flex min-h-12 items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-foreground/75 hover:text-foreground"
              >
                {isEnglish ? 'All services' : 'Alle Leistungen'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ol className="mt-10 divide-y divide-border border-y border-border">
            {offerLadder[lang].map(([number, title, text]) => (
              <li key={number} className="grid gap-3 py-6 sm:grid-cols-12 sm:items-baseline">
                <span className="font-mono text-xs text-signal sm:col-span-1">{number}</span>
                <h3 className="text-2xl sm:col-span-4">{title}</h3>
                <p className="leading-relaxed text-muted-foreground sm:col-span-7">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
            {isEnglish
              ? 'Deep audits, projects and retainers are proposed only after scope is confirmed. No unapproved prices are published.'
              : 'Vertiefte Audits, Projekte und Betreuung werden erst nach bestätigtem Umfang offeriert. Es werden keine ungeprüften Preise veröffentlicht.'}
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                06 · {isEnglish ? 'Method in practice' : 'Methodik in der Praxis'}
              </p>
              <h2 className="mt-4 max-w-4xl text-balance">
                {isEnglish ? 'A real product case. No invented performance claims.' : 'Ein reales Produktbeispiel. Keine erfundenen Resultate.'}
              </h2>
            </div>
            <div className="lg:col-span-4 lg:flex lg:items-end lg:justify-end">
              <Link
                to={casesPath}
                className="inline-flex min-h-12 items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-foreground/75 hover:text-foreground"
              >
                {isEnglish ? 'View case notes' : 'Projektkontexte ansehen'}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <article className="mt-10 rounded-md border border-border bg-background p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
              {isEnglish ? 'Product build' : 'Produktaufbau'}
            </p>
            <h3 className="mt-4 text-3xl">itsFeierabend Quick Audit</h3>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              {isEnglish
                ? 'Our audit implementation includes deterministic scoring, transparent evidence states and a private report flow in source code. Live end-to-end acceptance is tracked separately. Client results are only published with verified baselines and permission.'
                : 'Der Audit-Quellcode umfasst deterministisches Scoring, sichtbare Evidenzzustände und einen privaten Report-Flow. Die produktive End-to-End-Abnahme erfolgt separat. Kundenergebnisse veröffentlichen wir nur mit belegter Baseline und Freigabe.'}
            </p>
          </article>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              07 · FAQ
            </p>
            <h2 className="mt-4">{isEnglish ? 'Questions before the audit.' : 'Fragen vor dem Audit.'}</h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {faqItems.map((item) => (
                <li key={item.question}>
                  <details className="group">
                    <summary className="flex min-h-16 cursor-pointer list-none items-start justify-between gap-4 py-5">
                      <span className="text-lg">{item.question}</span>
                      <Plus className="mt-1 h-5 w-5 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
                    </summary>
                    <p className="max-w-3xl pb-6 leading-relaxed text-muted-foreground">{item.answer}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <div className="container-section">
          <div className="rounded-md border border-border bg-card p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">
                  {isEnglish ? 'Start with the current state' : 'Mit der Standortbestimmung starten'}
                </p>
                <h2 className="mt-4 max-w-4xl text-balance">
                  {isEnglish
                    ? 'Find the right first step, then let us implement it with you.'
                    : 'Den richtigen ersten Schritt finden. Danach persönlich umsetzen.'}
                </h2>
                <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                  {isEnglish
                    ? 'The free website Quick Check is an initial public-signal assessment. An internal operations audit and implementation are separately scoped with you.'
                    : 'Der kostenlose Website-Quick-Check zeigt öffentlich erkennbare Signale. Die interne Prozessanalyse und Umsetzung planen wir anschliessend persönlich mit Ihnen.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
                <CTAButton variant="primary" size="lg" href={auditPath} location="final" className="min-h-12">
                  {isEnglish ? 'Start the free Business Audit' : 'Kostenlosen Business Audit starten'}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </CTAButton>
                <Link
                  to={partnerPath}
                  className="inline-flex min-h-12 items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  {isEnglish ? 'Partner enquiry' : 'Partneranfrage'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
