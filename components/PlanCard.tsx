import Link from "next/link";

export type PlanDetail = {
  name: string;
  eyebrow: string;
  description: string;
  features: string[];
  featured: boolean;
};

export function PlanCard({ plan, className = "" }: { plan: PlanDetail; className?: string }) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[28px] ${
        plan.featured
          ? "bg-gradient-to-br from-navy via-navy-deep to-primary text-white shadow-[0_25px_70px_rgba(8,32,56,0.20)]"
          : "border border-[rgba(8,32,56,0.08)] bg-white text-navy shadow-[0_8px_30px_rgba(8,32,56,0.08)]"
      } ${className}`}
    >
      {plan.featured && (
        <div className="flex items-center justify-center bg-accent px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          Recommended for growing teams
        </div>
      )}

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            plan.featured ? "text-gold-light" : "text-gold"
          }`}
        >
          {plan.eyebrow}
        </p>

        <h3
          className={`mt-4 text-3xl font-bold tracking-[-0.04em] ${
            plan.featured ? "text-white" : "text-navy"
          }`}
        >
          {plan.name}
        </h3>

        <p
          className={`mt-4 leading-6 ${
            plan.featured ? "text-gold-light" : "text-[rgba(8,32,56,0.70)]"
          }`}
        >
          {plan.description}
        </p>

        <div className="mt-7 flex-1">
          <p
            className={`mb-4 text-[15px] font-bold uppercase tracking-[0.18em] ${
              plan.featured ? "text-gold-light" : "text-[rgba(8,32,56,0.70)]"
            }`}
          >
            Includes
          </p>

          <ul className="space-y-4">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[17px] font-bold ${
                    plan.featured ? "bg-primary text-white" : "bg-cream text-gold"
                  }`}
                >
                  ✓
                </span>
                <span
                  className={`leading-5 ${
                    plan.featured ? "text-cream" : "text-[rgba(8,32,56,0.70)]"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/contact"
          className={`group mt-9 flex items-center justify-center gap-3 rounded-full px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
            plan.featured
              ? "bg-accent text-white hover:bg-gold-hover"
              : "border-2 border-accent bg-white text-navy hover:bg-cream"
          }`}
        >
          Talk to an Expert
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
