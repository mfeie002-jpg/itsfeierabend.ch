import { ArrowRight, ExternalLink, Info } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { BreadcrumbSchema, SEOHead } from '@/components/SEOHead';
import { CTAButton } from '@/components/CTAButton';
import { useLanguage } from '@/i18n/LanguageContext';
import { track } from '@/lib/analytics';

export default function CaseStudiesPage() {
  const { isEnglish } = useLanguage();
  const auditPath = isEnglish ? '/en/audit' : '/audit';

  const projects = [
    {
      name: 'itsFeierabend Quick Audit',
      url: null,
      relationship: isEnglish ? 'Product build' : 'Produktaufbau',
      context: isEnglish
        ? 'The platform’s own audit is a working example of deterministic scoring, explicit evidence states and a private report flow.'
        : 'Der eigene Audit ist ein Arbeitsbeispiel für deterministisches Scoring, sichtbare Evidenzzustände und einen privaten Report-Flow.',
      scope: isEnglish
        ? ['rule-based scoring', 'measured versus stated evidence', 'prioritized report output']
        : ['regelbasiertes Scoring', 'gemessene versus angegebene Evidenz', 'priorisierte Report-Ausgabe'],
      boundary: isEnglish
        ? 'The product is documented as a preliminary audit and does not claim to replace expert review.'
        : 'Das Produkt wird als vorläufiger Audit dokumentiert und ersetzt keine Expertenprüfung.',
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Audit methodology in practice' : 'Audit-Methodik in der Praxis'}
        description={isEnglish
          ? 'A transparent product case for the itsFeierabend.ch audit methodology—without fictional clients, testimonials or performance claims.'
          : 'Transparentes Produktbeispiel für die Audit-Methodik von itsFeierabend.ch – ohne fiktive Kunden, Testimonials oder Performance-Claims.'}
      />
      <BreadcrumbSchema
        items={[
          {
            name: isEnglish ? 'Home' : 'Startseite',
            url: isEnglish ? 'https://itsfeierabend.ch/en' : 'https://itsfeierabend.ch/',
          },
          {
            name: isEnglish ? 'Case notes' : 'Fallstudien',
            url: isEnglish
              ? 'https://itsfeierabend.ch/en/case-studies'
              : 'https://itsfeierabend.ch/fallstudien',
          },
        ]}
      />

      <section className="border-b border-border py-16 md:py-24">
        <div className="container-section">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">
            {isEnglish ? 'Evidence, not decoration' : 'Evidenz statt Dekoration'}
          </p>
          <h1 className="mt-5 max-w-5xl text-balance">
            {isEnglish
              ? 'A real product case. No invented success story.'
              : 'Ein reales Produktbeispiel. Keine erfundene Erfolgsgeschichte.'}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {isEnglish
              ? 'This note shows what was built and where the boundary lies. Client or connected-project cases will only appear after facts, baselines and publication permission are documented.'
              : 'Diese Notiz zeigt, was umgesetzt wurde und wo die Grenze liegt. Kunden- oder verbundene Projektbeispiele erscheinen erst, wenn Fakten, Baseline und Publikationsfreigabe dokumentiert sind.'}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-section space-y-5">
          {projects.map((project, index) => (
            <article key={project.name} className="rounded-md border border-border bg-card p-7 md:p-10">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                    {String(index + 1).padStart(2, '0')} · {project.relationship}
                  </p>
                  <h2 className="mt-4 text-3xl md:text-4xl">{project.name}</h2>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => track('case_study_view', { case_study: project.name })}
                    >
                      {isEnglish ? 'Open project' : 'Projekt öffnen'}
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <div className="lg:col-span-8">
                  <p className="text-lg leading-relaxed">{project.context}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                    {project.scope.map((item) => (
                      <li key={item} className="rounded-sm border border-border bg-background p-4 text-sm leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                    {project.boundary}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/50 py-16 md:py-24">
        <div className="container-section grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {isEnglish ? 'Disclosure standard' : 'Offenlegungsstandard'}
            </p>
            <h2 className="mt-4 max-w-4xl text-balance">
              {isEnglish
                ? 'A future case study needs a source, a baseline and permission.'
                : 'Eine künftige Fallstudie braucht Quelle, Baseline und Freigabe.'}
            </h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
              {isEnglish
                ? 'Performance figures are published only when the measurement period, metric definition, data source and client approval are documented.'
                : 'Performance-Werte werden nur veröffentlicht, wenn Messzeitraum, Kennzahlendefinition, Datenquelle und Kundenfreigabe dokumentiert sind.'}
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <CTAButton variant="primary" size="lg" href={auditPath} location="case-studies-final" className="min-h-12">
              {isEnglish ? 'Start the free Audit' : 'Kostenlosen Audit starten'}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </CTAButton>
          </div>
        </div>
      </section>
    </Layout>
  );
}
