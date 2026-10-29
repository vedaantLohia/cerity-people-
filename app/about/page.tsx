import { CheckCircle2 } from "lucide-react";
import { BenefitCard } from "@/components/BenefitCard";
import { BrandBackground } from "@/components/BrandBackground";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ButtonLink } from "@/components/ButtonLink";
import { TeamPanel } from "@/components/TeamPanel";
import { CTASection } from "@/components/CTASection";
import { HeroSection } from "@/components/HeroSection";
import { HomePageClass } from "@/components/HomePageClass";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import {
  aboutBuilding,
  aboutJourney,
  aboutPrinciples,
  aboutSuccess,
  aboutTrust,
  aboutWhyChoose,
} from "@/lib/data";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn how we combine HR technology, automation, consulting, and compliance expertise to build efficient, scalable HR operations.",
  path: "/about",
  keywords: ["HR Consulting Services", "HR Digital Transformation", "HRMS Software"],
});

const teamPeople = [
  {
    name: "Rohit Lohia",
    title: "Founder",
    photo: "/rohit.webp",
    bio: "Rohit Lohia is a recognized leader in global expansion and cross-border operations, with 20+ years of experience helping global brands grow internationally. He specializes in building high-performing global delivery teams and managing international entities, and has supported companies from early-stage setup through full-scale operations and back-office transformation.\n\nHe co-founded Global Upside Corporation, a pioneer in Employer of Record (EOR) services, and as Managing Director of its India operations played a pivotal role in scaling its global delivery platform. Under his leadership, Global Upside helped businesses expand into 150+ countries and set up and manage 70+ of its own subsidiaries. His vision led to the launch of its PEO model and the development of Mihi, a global HRMS platform that reached 7,000+ users before its acquisition by Safeguard Global.\n\nAs Founder and CEO of Cerity Global, he continues that work, helping companies hire directly, operate compliantly and scale their international presence.\n\nRecognition: Marvelous Leaders in HR (2020) · Silver Stevie Award (2019)",
  },
  {
    name: "Indu Wadhwa",
    title: "HR Leader",
    photo: "/indu.webp",
    photoClassName: "object-top",
    bio: "Indu Wadhwa is a recognized HR leader with about 30 years of experience in HR and general management across industries including services, manufacturing, IT and telecom, hospitality, power, health, BPO and export.\n\nShe also brings 10+ years in consulting, with a focus on Prevention of Sexual Harassment (POSH), coaching and mentoring, career transition coaching, organization development, assessment and development centers, and workshops. Her consulting work includes HR advisory, drafting HR policy manuals, streamlining processes, and serving as an external expert on interview panels.\n\nIndu has designed and implemented HR initiatives aligned with core business objectives, contributing directly to company growth. She has been visiting faculty at several management institutes and has written management articles for business magazines.\n\nAt Cerity Global, she leads global HR strategy and people operations, ensuring scalable HR processes, compliant local execution, and an employee experience that supports long-term growth.",
  },
  {
    name: "Pallavi Chaudhary",
    title: "Chief Executive Officer",
    photo: "/pallavi.jpg",
    photoClassName: "object-center",
    bio: "Pallavi Chaudhary is a strategic HR leader, POSH expert and emotional intelligence coach with 22+ years of experience across India and 30+ countries in APAC, EMEA, LATAM and the UK. She helps organizations build workplaces that are not just compliant, but genuinely people-first. Combining systems thinking with a deep understanding of people, she guides leadership teams through restructuring, rapid growth and cultural resets without breaking the human fabric of the organization. She designs HR frameworks, performance systems and onboarding processes that give businesses a scalable foundation, while helping them align employees with the company’s vision and retain high-potential talent.\n\nPallavi turns POSH from a checkbox into a culture. She supports organizations end to end, from SHe-Box registration and Internal Committee setup to training, compliance audits and annual filings, and serves as an External Member on ICs across multiple organizations. Through emotional intelligence coaching and mindfulness-based leadership programs, she also helps technically strong leaders become more humanly connected.\n\nShe also supports women who have paused their careers or lost their confidence, helping them return to work and to themselves.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HomePageClass name="about-page" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className="relative -mt-16 overflow-hidden lg:-mt-[4.5rem]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <img
            src="/brand-background.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="relative pt-16 lg:pt-[4.5rem]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
          <HeroSection
            title="HR That Works Better for People and Business."
            description="Managing people should not mean managing endless processes. Cerity People brings HR technology, practical systems and experienced professionals together to help businesses hire, support, pay and manage their people with greater confidence."
            size="compact"
          >
            <ButtonLink href="/contact">Talk to Our Team</ButtonLink>
          </HeroSection>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <BrandBackground variant="about" />
        <div className="container relative grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Who we are"
              title="More Than HR Support. A Better Way to Work."
            />
            <p className="mt-6 text-slate-600 leading-relaxed">
              Cerity People is built around a simple idea: HR should make business easier, not
              more complicated.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              As businesses grow, managing people becomes more demanding. Hiring, onboarding,
              payroll, employee records, compliance and performance all need time, coordination
              and consistency. When these run separately, important work gets harder to manage.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              We bring these functions together through technology-enabled processes and
              hands-on expertise. Whether a business is hiring its first employees or
              strengthening established HR operations, Cerity People helps create the structure,
              clarity and support it needs to move forward.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              <span className="font-semibold text-navy">Our story: </span>
              Cerity People began with a common problem: as businesses grow, HR work gets split
              across separate people, tools and spreadsheets, and the cost shows up in delays,
              errors and compliance risk. We set out to bring hiring, onboarding, payroll,
              compliance and performance into one connected approach, combining technology with
              experienced HR professionals, so businesses of any size can manage their people
              with confidence.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Cerity People is backed by Cerity Global, a California-headquartered global
              expansion partner with 20+ years of experience in HR, payroll, tax and compliance,
              and a presence in 170+ countries.
            </p>
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border border-[rgba(8,32,56,0.08)] bg-soft-white p-6">
              <h2 className="text-lg font-semibold text-navy">Our Mission</h2>
              <p className="mt-2 text-slate-600">
                To make HR simpler, smarter, and more strategic through technology and expertise.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-navy">Our Vision</h2>
              <p className="mt-2 text-slate-600">
                To build workplaces where technology empowers people, and businesses perform at
                their best.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <BrandBackground variant="consulting" />
        <div className="container relative">
          <SectionHeading
            eyebrow="What we are building"
            title="Technology Is the Tool. Better HR Is the Goal."
            description="We believe the future of HR is not about adding more tools. It is about making the whole experience work better. Effective HR needs the right combination of technology, expertise and accountability."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {aboutBuilding.map((item, i) => (
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

      <section className="relative overflow-hidden py-16 sm:py-20">
        <BrandBackground variant="about" />
        <div className="container relative">
          <SectionHeading
            eyebrow="How Cerity People helps businesses move forward"
            title="From Everyday HR Tasks to Better Business Outcomes."
            description="We help businesses manage the essential parts of the employee journey with greater structure and confidence."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {aboutJourney.map((item) => (
              <li key={item.title} className="flex gap-3 rounded-lg border border-slate-100 bg-white p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="font-semibold text-navy">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <BrandBackground variant="consulting" />
        <div className="container relative">
          <SectionHeading title="Why Organizations Choose Us" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {aboutWhyChoose.map((item) => (
              <li key={item.title} className="flex gap-3 rounded-lg border border-slate-100 bg-white p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="font-semibold text-navy">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-16">
            <SectionHeading eyebrow="How we earn your trust" title="Trust Is Built in the Details." />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {aboutTrust.map((item) => (
                <li key={item.title} className="flex gap-3 rounded-lg border border-slate-100 bg-white p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <div>
                    <p className="font-semibold text-navy">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-navy">The principles that guide us</h3>
              <dl className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {aboutPrinciples.map((item) => (
                  <div key={item.title} className="grid gap-1 p-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
                    <dt className="font-semibold text-navy">{item.title}</dt>
                    <dd className="text-sm text-slate-600">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-navy">How we succeed</h3>
              <p className="mt-2 text-slate-600">We succeed when you do.</p>
              <ol className="mt-6 space-y-4">
                {aboutSuccess.map((item, i) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                      {i + 1}
                    </span>
                    <p className="text-slate-600">
                      <span className="font-semibold text-navy">{item.title}: </span>
                      {item.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <BrandBackground variant="people" />
        <div className="container relative">
          <SectionHeading
            eyebrow="Meet the people behind Cerity People"
            title="Expertise That Understands People and Business."
            description="Cerity People brings together HR knowledge, operational understanding, and a commitment to making people management work better for businesses."
          />

          <TeamPanel people={teamPeople} />
          
        </div>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20">
        <BrandBackground variant="about" />
        <div className="container relative">
          <SectionHeading eyebrow="Our commitment" title="Better HR Is Built Every Day." />
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center leading-relaxed text-slate-600">
            <p>
              We know that effective HR is not defined by a single system, process, or
              interaction. It is built through consistent work, dependable support, thoughtful
              decisions, and a willingness to improve.
            </p>
            <p>
              At Cerity People, we are committed to making HR more connected, practical, and
              people-focused. As technology evolves and business needs change, we will continue
              working toward a simpler and more effective experience for the people who keep
              businesses moving.
            </p>
            <p className="font-semibold text-navy">
              Because when HR works better, people can do their best work — and businesses are
              better positioned to grow.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Let’s Make HR Work Better for Your Business."
        description="Discover a more connected way to hire, manage, and support your people with Cerity People."
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
