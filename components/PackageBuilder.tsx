"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildQuote,
  formatMoney,
  pricingConfig,
  type BillingTerm,
} from "@/lib/pricing";

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
    icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  },
  {
    id: "hire",
    tier: 1,
    title: "Hiring and offers",
    blurb: "Job descriptions, interviews, assessments, offer letters.",
    icon: "M4 8h16v11H4V8Zm5 0V5h6v3M4 13h16",
  },
  {
    id: "exit",
    tier: 1,
    title: "Exits and expenses",
    blurb: "Separation, full and final settlement, reimbursements.",
    icon: "M10 4H5v16h5M14 8l4 4-4 4M18 12H9",
  },
  {
    id: "comp",
    tier: 1,
    title: "Compliance and returns",
    blurb: "Labour law, welfare compliance, governance and filings.",
    icon: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.500 7-10V6l-7-3Zm-3 9 2 2 4-4",
  },
  {
    id: "er",
    tier: 2,
    title: "Employee relations",
    blurb: "Disciplinary matters and workplace conduct handled for you.",
    icon: "M8 12h8M12 4v16M5 7l3 5-3 5M19 7l-3 5 3 5",
  },
  {
    id: "posh",
    tier: 2,
    title: "POSH, end to end",
    blurb: "Governance, awareness training, IC capacity building, committee.",
    icon: "M12 21s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 11c0 5.500-7 10-7 10Z",
  },
] as const;

const PLAN_TAGLINE = [
  "The essentials, organised.",
  "Hiring to exit, connected.",
  "Everything, including the hard parts.",
];

/* Smoothly tweens a number so prices count up and down. */
function useTween(target: number, ms = 450) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = origin + (target - origin) * eased;
      from.current = v;
      setValue(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

export function PackageBuilder() {
  const { minEmployees, maxEmployees, defaultEmployees, plans } = pricingConfig;
  const [employees, setEmployees] = useState(defaultEmployees);
  const [picked, setPicked] = useState<string[]>(["core"]);
  const [term, setTerm] = useState<BillingTerm>("annual");

  const tier = useMemo(
    () =>
      MODULES.filter((m) => picked.includes(m.id)).reduce(
        (max, m) => Math.max(max, m.tier),
        0,
      ),
    [picked],
  );
  const plan = plans[tier];
  const quote = buildQuote(plan, employees, term);
  const shownMonthly = useTween(quote?.monthly ?? 0);
  const shownTotal = useTween(quote?.total ?? 0);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  /* 100 dots on a square-root scale so small teams still read clearly. */
  const DOTS = 100;
  const lit = Math.max(1, Math.ceil(DOTS * Math.sqrt(employees / maxEmployees)));

  const spotlight = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 md:mt-20">
      {/* ================= LEFT: choices ================= */}
      <div className="space-y-6">
        {/* ---- team size ---- */}
        <section className="rounded-[28px] border border-white/60 bg-white/50 p-6 shadow-[0_12px_36px_rgba(8,32,56,0.06)] backdrop-blur-xl sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Step 1
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-navy">
                How big is your team?
              </h3>
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
        </section>

        {/* ---- services ---- */}
        <section className="rounded-[28px] border border-white/60 bg-white/50 p-6 shadow-[0_12px_36px_rgba(8,32,56,0.06)] backdrop-blur-xl sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            Step 2
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-navy">
            What should we take off your plate?
          </h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {MODULES.map((m) => {
              const on = picked.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(m.id)}
                  onMouseMove={spotlight}
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                    on
                      ? "-translate-y-0.5 border-gold/60 bg-cream/80 shadow-[0_14px_32px_rgba(255,160,0,0.20)]"
                      : "border-white/70 bg-white/55 hover:-translate-y-0.5 hover:border-gold/40"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(255,160,0,0.16), transparent 70%)",
                    }}
                  />
                  <span className="relative flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        on ? "bg-gold text-white" : "bg-white text-gold"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={m.icon} />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-bold text-navy">{m.title}</span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] transition-all duration-300 ${
                            on
                              ? "scale-100 border-gold bg-gold text-white"
                              : "scale-90 border-[rgba(8,32,56,0.2)] text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </span>
                      <span className="mt-1 block text-[13px] leading-5 text-[rgba(8,32,56,0.65)]">
                        {m.blurb}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* ================= RIGHT: live package ================= */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-[28px] border border-gold/35 bg-cream/60 shadow-[0_22px_50px_rgba(255,160,0,0.16)] backdrop-blur-xl">
          <div className="bg-accent px-6 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Your package
          </div>

          <div className="p-6 sm:p-8">
            {/* tier ladder */}
            <div className="relative grid grid-cols-3 rounded-full border border-[rgba(8,32,56,0.08)] bg-white/60 p-1 text-center text-xs font-bold">
              <span
                aria-hidden="true"
                className="absolute inset-y-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-gold shadow-[0_6px_16px_rgba(255,160,0,0.35)] transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)]"
                style={{ transform: `translateX(${tier * 100}%)`, left: "0.25rem" }}
              />
              {plans.map((p, i) => (
                <span
                  key={p.name}
                  className={`relative z-10 py-2 transition-colors duration-300 ${
                    i === tier ? "text-white" : "text-[rgba(8,32,56,0.6)]"
                  }`}
                >
                  {p.name}
                </span>
              ))}
            </div>

            {/* plan name + tagline cross-fade */}
            <div className="relative mt-6 h-[74px]" aria-live="polite">
              {plans.map((p, i) => (
                <div
                  key={p.name}
                  className={`absolute inset-0 transition-all duration-500 ${
                    i === tier
                      ? "translate-y-0 opacity-100"
                      : i < tier
                        ? "-translate-y-3 opacity-0"
                        : "translate-y-3 opacity-0"
                  }`}
                >
                  <h3 className="text-4xl font-bold tracking-[-0.04em] text-navy">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[rgba(8,32,56,0.65)]">{PLAN_TAGLINE[i]}</p>
                </div>
              ))}
            </div>

            {/* price */}
            {quote && (
            <div className="mt-2 rounded-2xl border border-white/70 bg-white/60 p-5">
                <>
                  <p className="text-4xl font-bold tracking-tight text-navy tabular-nums">
                    {formatMoney(shownMonthly)}
                    <span className="text-base font-medium text-[rgba(8,32,56,0.55)]">
                      {" "}
                      / month
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[rgba(8,32,56,0.65)]">
                    {formatMoney(quote.perEmployeePerMonth)} per person, excl.{" "}
                    {pricingConfig.taxLabel}
                  </p>
                  <div className="mt-4 inline-flex rounded-full border border-[rgba(8,32,56,0.08)] bg-white/70 p-1">
                    {(["monthly", "annual"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={term === t}
                        onClick={() => setTerm(t)}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-colors ${
                          term === t ? "bg-navy text-white" : "text-[rgba(8,32,56,0.65)]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-[rgba(8,32,56,0.7)]">
                    First year, incl. {pricingConfig.taxLabel}:{" "}
                    <strong className="text-navy tabular-nums">
                      {formatMoney(shownTotal)}
                    </strong>
                  </p>
                </>
            </div>
            )}

            {/* what's in it */}
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[rgba(8,32,56,0.55)]">
              You asked for
            </p>
            <div className="mt-3 flex min-h-[34px] flex-wrap gap-2">
              {picked.length === 0 && (
                <span className="text-sm text-[rgba(8,32,56,0.5)]">
                  Pick a service to begin.
                </span>
              )}
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
        </div>
      </aside>
    </div>
  );
}
