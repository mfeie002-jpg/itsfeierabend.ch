import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { track, trackAuditStarted } from "@/lib/analytics";
import { getUTMParams } from "@/hooks/useUTMTracking";
import { Turnstile, TURNSTILE_ENABLED } from "@/components/Turnstile";


type Lang = "de" | "en";

const t = {
  de: {
    metaTitle: "Kostenloser Website-Audit — itsFeierabend.ch",
    metaDesc: "In 60 Sekunden zum kostenlosen Audit deiner Website. 25+ Signale, transparenter Score und drei konkrete Handlungsempfehlungen.",
    kicker: "Kostenloser Website-Audit · v0",
    headline: "Sag uns deine URL. Wir zeigen dir, wo deine Website Leads verliert.",
    sub: "Unser Audit analysiert 25+ deterministische Signale — technisch, inhaltlich, Vertrauen, Conversion und Automatisierung. Kein Login, keine Chatbots, kein Bullshit.",
    website: "Website-URL",
    websitePh: "https://deinefirma.ch",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail-Adresse",
    consentReq: "Ich willige ein, dass meine Angaben für die Erstellung und den Versand des Audits verarbeitet werden.",
    consentMarketing: "Optional: Ich möchte weiterführende Tipps und Angebote per E-Mail erhalten.",
    submit: "Audit starten",
    submitting: "Audit wird vorbereitet…",
    trust: "Keine Anmeldung nötig · Der Report ist in ~60 Sekunden bereit · Privater Link nur für dich",
    errors: {
      url: "Bitte eine gültige Website-URL angeben.",
      first: "Bitte Vorname eintragen.",
      last: "Bitte Nachname eintragen.",
      email: "Bitte eine gültige E-Mail-Adresse angeben.",
      consent: "Der Consent für die Verarbeitung ist erforderlich.",
    },
  },
  en: {
    metaTitle: "Free Website Audit — itsFeierabend.ch",
    metaDesc: "Get your free website audit in 60 seconds. 25+ deterministic signals, a transparent score and three concrete next steps.",
    kicker: "Free Website Audit · v0",
    headline: "Give us your URL. We'll show you where your website loses leads.",
    sub: "Our audit analyzes 25+ deterministic signals across technical health, content, trust, conversion and automation readiness. No login, no chatbot, no fluff.",
    website: "Website URL",
    websitePh: "https://yourcompany.com",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    consentReq: "I agree that my data may be processed to create and deliver this audit report.",
    consentMarketing: "Optional: I want to receive further tips and offers by email.",
    submit: "Start audit",
    submitting: "Preparing your audit…",
    trust: "No sign-up · Ready in ~60 seconds · Private link just for you",
    errors: {
      url: "Please enter a valid website URL.",
      first: "Please enter a first name.",
      last: "Please enter a last name.",
      email: "Please enter a valid email address.",
      consent: "Consent for processing is required.",
    },
  },
} as const;

function mapErrorMessage(code: string | undefined, fallback: string | undefined, lang: Lang): string | undefined {
  if (!code) return fallback;
  const de: Record<string, string> = {
    bot_check_failed: "Bot-Check fehlgeschlagen. Bitte lade die Seite neu.",
    per_ip_daily_exceeded: "Tageslimit für deine IP erreicht. Bitte morgen erneut versuchen.",
    global_daily_exceeded: "Wir sind heute stark ausgelastet — bitte morgen erneut versuchen.",
    domain_recently_audited: "Für diese Domain existiert bereits ein privater Report. Bitte nutze den Link aus der ursprünglichen E-Mail.",
    url_ip_literal: "IP-Adressen sind nicht erlaubt — bitte Domain angeben.",
    url_unsupported_protocol: "Nur http und https werden unterstützt.",
    url_malformed: "Ungültige URL — bitte prüfen.",
    url_blocked_host: "Dieser Host ist nicht erlaubt.",
    invalid_email: "Ungültige E-Mail-Adresse.",
  };
  const en: Record<string, string> = {
    bot_check_failed: "Bot check failed. Please reload the page.",
    per_ip_daily_exceeded: "Daily limit for your IP reached. Please try again tomorrow.",
    global_daily_exceeded: "We're at capacity today — please try again tomorrow.",
    domain_recently_audited: "A recent private report already exists for this domain. Please use the link sent to its requester.",
    url_ip_literal: "IP addresses are not allowed — please enter a domain.",
    url_unsupported_protocol: "Only http and https are supported.",
    url_malformed: "Invalid URL — please check.",
    url_blocked_host: "This host is not allowed.",
    invalid_email: "Invalid email address.",
  };
  return (lang === "de" ? de[code] : en[code]) ?? fallback;
}

const schema = z.object({
  website_url: z.string().trim().min(4).max(500),
  first_name: z.string().trim().min(2).max(80),
  last_name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  consent_processing: z.literal(true),
  consent_marketing: z.boolean(),
});

interface Props {
  lang: Lang;
}

export default function AuditV0Page({ lang }: Props) {
  const nav = useNavigate();
  const c = t[lang];
  const [values, setValues] = useState({
    website_url: "",
    first_name: "",
    last_name: "",
    email: "",
    consent_processing: false,
    consent_marketing: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Sprint 4 tracking: funnel entry with UTM attribution
  useEffect(() => {
    const utm = getUTMParams();
    trackAuditStarted({
      language: lang,
      page_path: typeof window !== "undefined" ? window.location.pathname : "/audit",
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    });
  }, [lang]);


  function update<K extends keyof typeof values>(k: K, v: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as string;
        if (k === "website_url") flat[k] = c.errors.url;
        else if (k === "first_name") flat[k] = c.errors.first;
        else if (k === "last_name") flat[k] = c.errors.last;
        else if (k === "email") flat[k] = c.errors.email;
        else if (k === "consent_processing") flat[k] = c.errors.consent;
      }
      setErrors(flat);
      return;
    }

    if (TURNSTILE_ENABLED && !turnstileToken) {
      toast.error(lang === "de" ? "Bitte den Bot-Check abschliessen." : "Please complete the bot check.");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-audit", {
        body: { ...parsed.data, language: lang, turnstile_token: turnstileToken },
      });
      // supabase-js returns non-2xx as `error`; the body still comes back on `data`.
      const payload = (data ?? {}) as {
        success?: boolean;
        token?: string;
        redirect_path?: string;
        reused?: boolean;
        error?: string;
        code?: string;
      };
      if (payload.success && payload.token && payload.redirect_path) {
        const utm = getUTMParams();
        track("audit_submitted", {
          language: lang,
          marketing_consent: parsed.data.consent_marketing,
          reused: !!payload.reused,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
        });
        toast.success(
          payload.reused
            ? (lang === "de"
                ? "Für diese Domain existiert bereits ein aktueller Report — wir öffnen ihn."
                : "A recent report for this domain already exists — opening it.")
            : (lang === "de" ? "Los geht's – Audit läuft." : "Started — running your audit."),
        );
        nav(payload.redirect_path);
        return;
      }
      // Explicit error mapping for known codes
      const msg = mapErrorMessage(payload.code, payload.error, lang) ?? (error?.message ?? "");
      throw new Error(msg || (lang === "de" ? "Unbekannter Fehler" : "Unknown error"));
    } catch (err) {
      console.error("audit submit failed:", err);
      const msg = (err as Error).message ?? "";
      toast.error(
        lang === "de"
          ? msg || "Bitte erneut versuchen."
          : msg || "Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SEOHead title={c.metaTitle} description={c.metaDesc} />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {c.kicker}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif leading-tight mb-4 text-foreground">
              {c.headline}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{c.sub}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="website_url">{c.website} *</Label>
              <Input
                id="website_url"
                type="url"
                value={values.website_url}
                onChange={(e) => update("website_url", e.target.value)}
                placeholder={c.websitePh}
                required
                autoComplete="url"
              />
              {errors.website_url && <p className="text-sm text-destructive">{errors.website_url}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">{c.firstName} *</Label>
                <Input
                  id="first_name"
                  value={values.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                  required
                  autoComplete="given-name"
                />
                {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">{c.lastName} *</Label>
                <Input
                  id="last_name"
                  value={values.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                  required
                  autoComplete="family-name"
                />
                {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{c.email} *</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                required
                autoComplete="email"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-3 pt-2 border-t border-border">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={values.consent_processing}
                  onCheckedChange={(v) => update("consent_processing", !!v)}
                  className="mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{c.consentReq}</span>
              </label>
              {errors.consent_processing && (
                <p className="text-sm text-destructive">{errors.consent_processing}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={values.consent_marketing}
                  onCheckedChange={(v) => update("consent_marketing", !!v)}
                  className="mt-0.5"
                />
                <span className="text-sm text-muted-foreground leading-relaxed">{c.consentMarketing}</span>
              </label>
            </div>

            {TURNSTILE_ENABLED && (
              <div className="flex justify-center pt-2">
                <Turnstile onToken={setTurnstileToken} />
              </div>
            )}

            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{c.submitting}</>
              ) : (
                c.submit
              )}
            </Button>

            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5" />
              {c.trust}
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
