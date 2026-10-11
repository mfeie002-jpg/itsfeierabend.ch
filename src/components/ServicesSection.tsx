import { useLanguage } from '@/i18n/LanguageContext';
import { SectionContainer, SectionHeader } from '@/components/SectionContainer';
import { 
  Search, 
  MousePointerClick, 
  Shield, 
  Palette, 
  Rocket, 
  Share2,
  Bot,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Import service images
import aiImplementationImg from '@/assets/services/ai-implementation.jpg';
import seoServiceImg from '@/assets/services/seo-service.jpg';
import ppcServiceImg from '@/assets/services/ppc-service.jpg';
import reputationServiceImg from '@/assets/services/reputation-service.jpg';
import designServiceImg from '@/assets/services/design-service.jpg';
import brandServiceImg from '@/assets/services/brand-service.jpg';
import socialMediaServiceImg from '@/assets/services/social-media-service.jpg';

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  isAI?: boolean;
  delay?: number;
  image?: string;
  href: string;
  learnMoreText: string;
}

function ServiceCard({ icon: Icon, title, description, features, isAI, delay = 0, image, href, learnMoreText }: ServiceCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative block overflow-hidden rounded-3xl glass-panel p-6 animate-fade-in-up transition-all duration-500",
        "hover:-translate-y-1 hover:shadow-glow-intense",
        isAI && "border-aurora md:col-span-2 md:row-span-2 p-8"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Service Image */}
      {image && (
        <div className={cn(
          "relative -mx-6 -mt-6 mb-5 overflow-hidden",
          isAI ? "h-64 -mx-8 -mt-8" : "h-40"
        )}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          {isAI && <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-ai/20 mix-blend-overlay" />}
        </div>
      )}

      {/* AI Badge */}
      {isAI && (
        <div className="absolute right-6 top-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-ai/40">
          <Sparkles className="w-3 h-3 text-ai" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ai">Core Service</span>
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        "rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110",
        isAI
          ? "w-16 h-16 bg-gradient-aurora shadow-glow-intense"
          : "w-12 h-12 bg-primary/10 text-primary group-hover:bg-primary/20"
      )}>
        <Icon className={cn(isAI ? "w-8 h-8 text-primary-foreground" : "w-6 h-6")} />
      </div>

      {/* Content */}
      <h3 className={cn(
        "font-editorial font-semibold mb-3 tracking-tight group-hover:text-aurora transition-all",
        isAI ? "text-4xl md:text-5xl leading-[1.05]" : "text-2xl"
      )}>
        {title}
      </h3>
      <p className={cn("text-muted-foreground mb-5 leading-relaxed", isAI ? "text-lg max-w-xl" : "text-sm")}>
        {description}
      </p>

      {/* Features */}
      <ul className={cn("mb-6", isAI ? "grid grid-cols-2 gap-2" : "space-y-2")}>
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={cn(
              "rounded-full flex-shrink-0",
              isAI ? "w-2 h-2 bg-gradient-aurora" : "w-1.5 h-1.5 bg-primary"
            )} />
            {feature}
          </li>
        ))}
      </ul>

      {/* Learn More Link */}
      <div className={cn(
        "flex items-center gap-2 font-medium transition-all duration-300 mt-auto",
        isAI
          ? "text-base text-aurora opacity-100"
          : "text-sm text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
      )}>
        <span>{`${learnMoreText}: ${title}`}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function ServicesSection() {
  const { isEnglish } = useLanguage();

  const learnMoreText = isEnglish ? 'Explore' : 'Leistung entdecken';

  const services = isEnglish ? [
    {
      icon: Bot,
      title: 'AI Implementation',
      description: 'Our core specialty. We integrate AI into your business processes to maximize efficiency and results.',
      features: ['AI Chatbots & Assistants', 'Process Automation', 'Predictive Analytics', 'Custom AI Solutions'],
      isAI: true,
      image: aiImplementationImg,
      href: '/en/services/ai-implementation',
    },
    {
      icon: Search,
      title: 'SEO',
      description: 'Organic visibility that drives qualified traffic. Rank for keywords that convert.',
      features: ['Technical SEO', 'Content Strategy', 'Local SEO', 'Link Building'],
      image: seoServiceImg,
      href: '/en/services/seo',
    },
    {
      icon: MousePointerClick,
      title: 'SEA / PPC',
      description: 'Paid advertising that delivers ROI. Every click is optimized for conversions.',
      features: ['Google Ads', 'Social Ads', 'Retargeting', 'Conversion Tracking'],
      image: ppcServiceImg,
      href: '/en/services/sea',
    },
    {
      icon: Shield,
      title: 'Reputation Management',
      description: 'Protect and enhance your brand\'s online presence. Build trust at scale.',
      features: ['Review Management', 'Crisis Response', 'Brand Monitoring', 'PR Strategy'],
      image: reputationServiceImg,
      href: '/en/services/reputation',
    },
    {
      icon: Palette,
      title: 'Design & Development',
      description: 'Beautiful, conversion-optimized websites and digital products that perform.',
      features: ['Web Design', 'UX/UI Design', 'Development', 'Landing Pages'],
      image: designServiceImg,
      href: '/en/services/design-development',
    },
    {
      icon: Rocket,
      title: 'Brand Deployment',
      description: 'Launch your brand across all channels with consistency and impact.',
      features: ['Brand Strategy', 'Visual Identity', 'Brand Guidelines', 'Multi-Channel Launch'],
      image: brandServiceImg,
      href: '/en/services/brand-deployment',
    },
    {
      icon: Share2,
      title: 'Social Media',
      description: 'Build community and drive engagement with strategic social presence.',
      features: ['Content Creation', 'Community Management', 'Influencer Marketing', 'Analytics'],
      image: socialMediaServiceImg,
      href: '/en/services/social-media',
    },
  ] : [
    {
      icon: Bot,
      title: 'AI-Implementierung',
      description: 'Unser Kerngeschäft. Wir integrieren KI in Ihre Geschäftsprozesse für maximale Effizienz und Ergebnisse.',
      features: ['KI-Chatbots & Assistenten', 'Prozessautomatisierung', 'Predictive Analytics', 'Individuelle KI-Lösungen'],
      isAI: true,
      image: aiImplementationImg,
      href: '/services/ki-implementierung',
    },
    {
      icon: Search,
      title: 'SEO',
      description: 'Organische Sichtbarkeit, die qualifizierten Traffic bringt. Rankings für Keywords, die konvertieren.',
      features: ['Technisches SEO', 'Content-Strategie', 'Local SEO', 'Linkbuilding'],
      image: seoServiceImg,
      href: '/services/seo',
    },
    {
      icon: MousePointerClick,
      title: 'SEA / PPC',
      description: 'Bezahlte Werbung mit ROI. Jeder Klick ist auf Conversions optimiert.',
      features: ['Google Ads', 'Social Ads', 'Retargeting', 'Conversion Tracking'],
      image: ppcServiceImg,
      href: '/services/sea',
    },
    {
      icon: Shield,
      title: 'Reputation Management',
      description: 'Schützen und verbessern Sie Ihre Online-Präsenz. Vertrauen skalierbar aufbauen.',
      features: ['Bewertungsmanagement', 'Krisenreaktion', 'Brand Monitoring', 'PR-Strategie'],
      image: reputationServiceImg,
      href: '/services/reputation',
    },
    {
      icon: Palette,
      title: 'Design & Entwicklung',
      description: 'Schöne, conversion-optimierte Websites und digitale Produkte, die performen.',
      features: ['Webdesign', 'UX/UI Design', 'Entwicklung', 'Landing Pages'],
      image: designServiceImg,
      href: '/services/design-entwicklung',
    },
    {
      icon: Rocket,
      title: 'Brand Deployment',
      description: 'Lancieren Sie Ihre Marke konsistent und wirkungsvoll über alle Kanäle.',
      features: ['Markenstrategie', 'Visuelle Identität', 'Brand Guidelines', 'Multi-Channel Launch'],
      image: brandServiceImg,
      href: '/services/brand-deployment',
    },
    {
      icon: Share2,
      title: 'Social Media',
      description: 'Community aufbauen und Engagement steigern mit strategischer sozialer Präsenz.',
      features: ['Content-Erstellung', 'Community Management', 'Influencer Marketing', 'Analytics'],
      image: socialMediaServiceImg,
      href: '/services/social-media',
    },
  ];

  return (
    <SectionContainer id="services" background="muted" className="relative overflow-hidden noise-overlay">
      {/* Layered background */}
      <div className="absolute inset-0 grid-pattern opacity-[0.15]" />
      <div className="absolute -top-40 right-0 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-30"
           style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)' }} />
      <div className="absolute -bottom-40 left-0 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25"
           style={{ background: 'radial-gradient(circle, hsl(var(--ai-accent) / 0.4), transparent 70%)' }} />

      <div className="relative">
        {/* Editorial header */}
        <div className="max-w-4xl mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass-panel">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {isEnglish ? 'Services' : 'Leistungen'}
            </span>
          </div>
          <h2 className="font-editorial font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            {isEnglish ? (
              <>Full-service digital, <span className="italic text-aurora">orchestrated</span> by AI.</>
            ) : (
              <>Full-Service Digital, <span className="italic text-aurora">orchestriert</span> von KI.</>
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {isEnglish
              ? 'Seven disciplines, one engine. AI Implementation is the spine — every other service plugs into it.'
              : 'Sieben Disziplinen, eine Engine. AI Implementation ist das Rückgrat — alle anderen Services docken daran an.'}
          </p>
        </div>

        {/* Asymmetric Bento Grid: AI card spans 2x2, others fill around */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-5">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              {...service}
              delay={index * 80}
              learnMoreText={learnMoreText}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
