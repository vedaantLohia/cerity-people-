import { BenefitCard } from "@/components/BenefitCard";
import { ButtonLink } from "@/components/ButtonLink";
import { CTASection } from "@/components/CTASection";
import { BrandBackground } from "@/components/BrandBackground";
import { EmployeeLifecycle } from "@/components/EmployeeLifecycle";
import { HomePageClass } from "@/components/HomePageClass";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import {
  approachSteps,
  expertServices,
  homeFaqs,
  homeWhyCerity,
} from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, faqSchema } from "@/lib/seo";


export const metadata = buildMetadata({
  title: "HR Technology & HR Consulting",
  description:
    "Transform HR with modern HRMS, payroll, recruitment, and expert consulting. Simplify operations, improve compliance, and scale your workforce.",
  path: "/",
  keywords: [
    "HR Technology",
    "HRMS Software",
    "HR Consulting Services",
    "Payroll Management",
    "HR Automation",
  ],
});

export default function HomePage() {
  return (
    <>
      <HomePageClass />
      <JsonLd data={faqSchema(homeFaqs)} />

     {/* =========================================================
    HERO — CENTERED HR TECHNOLOGY
========================================================= */}
<section className="relative -mt-16 overflow-hidden pb-20 pt-[calc(4rem+2.5rem)] sm:pb-24 sm:pt-[calc(4rem+3.5rem)] lg:-mt-[4.5rem] lg:pb-28 lg:pt-[calc(4.5rem+4rem)]">
  <div className="pointer-events-none absolute inset-0" aria-hidden>
    <img
      src="/brand-background.jpg"
      alt=""
      className="h-full w-full object-cover object-center"
    />
  </div>

  <div className="container relative">
    <div className="mx-auto max-w-[1100px] text-center">

      <h1 className="mx-auto text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.15]">
        <span className="block text-navy">Hire, Onboard, Pay &amp; Manage Your People,</span>
        <span className="block text-accent">All in One Place</span>
      </h1>

      <p className="mx-auto mt-6 max-w-[760px] text-base leading-relaxed text-slate-600 sm:text-lg lg:text-[18px] lg:leading-[1.65]">
        Power your workforce with modern HR technology and expert consulting
        solutions designed to simplify HR operations, improve compliance, and
        help your business grow.
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <ButtonLink href="#how-it-works" className="min-w-[200px] px-8 py-3.5">
          See How It Works
        </ButtonLink>
      </div>

      <p className="mt-8 text-sm text-slate-600">
        A trusted HR partner for businesses of every size and across industries.
      </p>

    </div>
  </div>
</section>

      

      {/* =========================================================
    HR TECH — EMPLOYEE LIFECYCLE
========================================================= */}
<section id="how-it-works" className="relative scroll-mt-24 overflow-hidden section-padding">
  <BrandBackground variant="hero" />
  <div className="container relative">
    <EmployeeLifecycle />
  </div>
</section>

     

      {/* Expert services */}
      <section className="relative overflow-hidden section-padding">
        <BrandBackground variant="consulting" />
        <div className="container relative">
          <SectionHeading
            eyebrow="Expert Services"
            title="HR Expertise That Moves Your Business Forward"
            description="Practical HR Support for Your Day-to-Day Needs."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {expertServices.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                href="/consulting"
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/consulting" variant="outline">
              Explore Our Services
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="relative overflow-hidden section-padding">
        <BrandBackground variant="people" />
        <div className="container relative">
          <SectionHeading
            eyebrow={`Why ${siteConfig.name}`}
            title="HR Support Designed Around Your Business"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {homeWhyCerity.map((item, i) => (
              <BenefitCard
                key={item.title}
                index={i}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="relative overflow-hidden section-padding">
        <BrandBackground variant="consulting" />
        <div className="container relative">
          <SectionHeading
            eyebrow="Our Approach"
            title="Four Simple Steps to a Smarter HR Function"
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approachSteps.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <span className="text-3xl font-bold text-accent">{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        title="Ready to Simplify How You Manage People?"
        description="Get the right HR support to keep your people processes organized and your day-to-day operations running smoothly."
      />

    </>
  );
}
