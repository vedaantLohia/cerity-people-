import { BrandBackground } from "@/components/BrandBackground";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTASection } from "@/components/CTASection";
import { HeroSection } from "@/components/HeroSection";
import { HomePageClass } from "@/components/HomePageClass";
import { JsonLd } from "@/components/JsonLd";
import { ServiceCard } from "@/components/ServiceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { consultingServicesDetailed } from "@/lib/data";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "HR Consulting Services",
  description:
    "HR consulting for strategy, process optimization, payroll, compliance, workforce planning, and digital transformation.",
  path: "/consulting",
  keywords: [
    "HR Consulting Services",
    "HR Compliance Consulting",
    "Payroll Management",
    "Workforce Management",
  ],
});

export default function ConsultingPage() {
  return (
    <>
      <HomePageClass name="consulting-page" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Consulting", path: "/consulting" },
        ])}
      />
      <div className="relative overflow-hidden">
        <BrandBackground variant="consultingPage" />
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Consulting" }]} />
        <HeroSection
          title="HR Consulting That Helps Your Business Grow"
          description="Build efficient HR processes, improve workforce management and create scalable people strategies — with advisors who understand operational reality."
          size="compact"
        />

        <section className="relative py-16 sm:py-24">
          <div className="container relative">
            <SectionHeading
              title="Simplified HR Solutions"
              description="Engagements tailored for HR leaders, founders, finance teams, and growing organizations."
            />
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {consultingServicesDetailed.map((service) => (
                <div
                  key={service.title}
                  className="flex w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] [&>*]:w-full"
                >
                  <ServiceCard title={service.title} description={service.description} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <CTASection
        title="Start with a discovery conversation"
        description="Share your HR challenges and we'll recommend the right consulting path."
        buttonLabel="Book a Consultation"
      />
    </>
  );
}
