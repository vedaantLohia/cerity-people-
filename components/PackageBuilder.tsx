"use client";

import Link from "next/link";
import { useState } from "react";
import { buildQuote, formatMoney, pricingConfig } from "@/lib/pricing";

/* ------------------------------------------------------------------ */
/* What the visitor can pick. `tier` = the lowest plan that includes it  */
/* (0 Basic, 1 Executive, 2 Professional) — mirrors the comparison table.*/
/* ------------------------------------------------------------------ */
const MODULES = [
  {
    id: "core",
    tier: 0,
    title: "Everyday HR",
    blurb: "Onboarding, attendance, leave, records, CTC and benefits.",
  },
  {
    id: "hire",
    tier: 1,
    title: "Hiring and offers",
    blurb: "Job descriptions, interviews, assessments, offer letters.",
  },
  {
    id: "exit",
    tier: 1,
    title: "Exits and expenses",
    blurb: "Separation, full and final settlement, reimbursements.",
  },
  {
    id: "comp",
    tier: 1,
    title: "Compliance and returns",
    blurb: "Labour law, welfare compliance, governance and filings.",
  },
  {
    id: "er",
    tier: 2,
    title: "Employee relations",
    blurb: "Disciplinary matters and workplace conduct handled for you.",
  },
  {
    id: "posh",
    tier: 2,
    title: "POSH, end to end",
    blurb: "Governance, awareness training, IC capacity building, committee.",
  },
] as const;

const PLAN_TAGLINE = [
  "The essentials, organised.",
  "Hiring to exit, connected.",
  "Everything, including the hard parts.",
];

const STEPS = ["Team size", "Services", "Your plan"] as const;

export function PackageBuilder() {
  const { plans, minEmployees, maxEmployees, defaultEmployees } = pricingConfig;
  const [step, setStep] = useState(0);
  const [employees, setEmployees] = useState(defaultEmployees);
  const [picked, setPicked] = useState<string[]>(["core"]);
  const [error, setError] = useState("");

  const tier = MODULES.filter((m) => picked.includes(m.id)).reduce(
    (max, m) => Math.max(max, m.tier),
    0,
  );
  const plan = plans[tier];
  const quote = buildQuote(plan, employees, "annual");

  /* 100 dots on a square-root scale so small teams still read clearly. */
  const DOTS = 100;
  const lit = Math.max(1, Math.ceil(DOTS * Math.sqrt(employees / maxEmployees)));

  const toggle = (id: string) => {
    setError("");
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const next = () => {
    if (step === 1 && picked.length === 0) {
      setError("Pick at least one service to continue.");
      return;
    }
    setError("");
    setStep((s) => Math.min(2, s + 1));
  };

  const back = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  };

  const restart = () => {
    setError("");
    setStep(0);
  };

  return (
    <div className="mt-14 md:mt-20">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-white/60 bg-white/60 shadow-[0_12px_36px_rgba(8,32,56,0.08)] backdrop-blur-xl">
        {/* ---- step indicator ---- */}
        <ol className="flex items-center gap-2 border-b border-[rgba(8,32,56,0.08)] px-5 py-4 sm:px-8">
          {STEPS.map((label, i) => (
            <li
              key={label}
              aria-current={i === step ? "step" : undefined}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                i === step
                  ? "bg-navy text-white"
                  : i < step
                    ? "bg-gold/15 text-navy"
                    : "bg-[rgba(8,32,56,0.06)] text-[rgba(8,32,56,0.55)]"
              }`}
            >
              <span>{i + 1}</span>
              <span className="hidden sm:inline">{label}</span>
            </li>
          ))}
        </ol>

        <div className="p-5 sm:p-8">
          {/* ================= STEP 1: team size ================= */}
          {step === 0 && (
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-navy">
                    How big is your team?
                  </h3>
                  <p className="mt-2 text-sm text-[rgba(8,32,56,0.65)]">
                    Drag to set your headcount.
                  </p>
                </div>
                <p className="text-right">
                  <span className="text-5xl font-bold leading-none tracking-tight text-navy tabular-nums">
                    {employees}
                  </span>
                  <span className="ml-2 text-sm font-bold text-[rgba(8,32,56,0.55)]">
                    people
                  </span>
                </p>
              </div>

              <div
                className="mt-6 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[5px] sm:gap-[7px]"
                aria-hidden="true"
              >
                {Array.from({ length: DOTS }, (_, i) => {
                  const on = i < lit;
                  return (
                    <span
                      key={i}
                      className={`aspect-square rounded-full transition-all duration-500 ${
                        on
                          ? "scale-100 bg-gold shadow-[0_0_10px_rgba(255,160,0,0.55)]"
                          : "scale-[0.55] bg-[rgba(8,32,56,0.12)]"
                      }`}
                      style={{ transitionDelay: `${Math.abs(i - lit) * 6}ms` }}
                    />
                  );
                })}
              </div>

              <input
                type="range"
                aria-label="Number of employees"
                min={minEmployees}
                max={maxEmployees}
                step={5}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="mt-6 h-2 w-full cursor-pointer accent-[#FFA000]"
              />
              <div className="mt-1 flex justify-between text-xs font-bold text-[rgba(8,32,56,0.45)]">
                <span>{minEmployees}</span>
                <span>{maxEmployees}+</span>
              </div>
            </div>
          )}

          {/* ================= STEP 2: services ================= */}
          {step === 1 && (
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-navy">
                What should we take off your plate?
              </h3>
              <p className="mt-2 text-sm text-[rgba(8,32,56,0.65)]">
                Pick any that apply.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {MODULES.map((m) => {
                  const on = picked.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(m.id)}
                      className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                        on
                          ? "-translate-y-0.5 border-gold/60 bg-cream/80 shadow-[0_14px_32px_rgba(255,160,0,0.20)]"
                          : "border-[rgba(8,32,56,0.12)] bg-white hover:-translate-y-0.5 hover:border-gold/40"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-bold text-navy">{m.title}</span>
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] transition-all duration-300 ${
                            on
                              ? "border-gold bg-gold text-white"
                              : "border-[rgba(8,32,56,0.2)] text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </span>
                      <span className="mt-1 block text-[13px] leading-5 text-[rgba(8,32,56,0.65)]">
                        {m.blurb}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 3: your plan ================= */}
          {step === 2 && (
            <div aria-live="polite">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Your plan
              </p>
              <h3 className="mt-2 text-4xl font-bold tracking-[-0.04em] text-navy">
                {plan.name}
              </h3>
              <p className="mt-1 text-[rgba(8,32,56,0.65)]">{PLAN_TAGLINE[tier]}</p>

              {quote && (
                <div className="mt-5 rounded-2xl border border-white/70 bg-white/70 p-5">
                  <p className="text-3xl font-bold tracking-tight text-navy tabular-nums">
                    {formatMoney(quote.monthly)}
                    <span className="text-base font-medium text-[rgba(8,32,56,0.55)]">
                      {" "}
                      / month
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[rgba(8,32,56,0.65)]">
                    First year, incl. {pricingConfig.taxLabel}:{" "}
                    <strong className="text-navy tabular-nums">
                      {formatMoney(quote.total)}
                    </strong>
                  </p>
                </div>
              )}

              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[rgba(8,32,56,0.55)]">
                For {employees} people, you asked for
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MODULES.filter((m) => picked.includes(m.id)).map((m) => (
                  <span
                    key={m.id}
                    className="rounded-full border border-gold/40 bg-white/70 px-3 py-1 text-xs font-bold text-navy"
                  >
                    {m.title}
                  </span>
                ))}
              </div>

              <Link
                href="/contact"
                className="group mt-7 flex items-center justify-center gap-3 rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,160,0,0.28)] transition-colors hover:bg-gold-hover"
              >
                Talk to an Expert about {plan.name}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 text-sm font-bold text-[#b42318]">
              {error}
            </p>
          )}

          {/* ---- navigation ---- */}
          <div className="mt-7 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="text-sm font-bold text-[rgba(8,32,56,0.65)] transition-colors hover:text-navy"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={next}
                className="rounded-full bg-navy px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary"
              >
                {step === 1 ? "See my plan" : "Next"} →
              </button>
            ) : (
              <button
                type="button"
                onClick={restart}
                className="text-sm font-bold text-[rgba(8,32,56,0.65)] transition-colors hover:text-navy"
              >
                Start over
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
