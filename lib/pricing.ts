/**
 * Package pricing — edit the numbers here and the pricing modal on /solutions
 * updates. Leave a price as `null` to show "Custom quote" for that plan.
 *
 * All amounts are in `currency`, excluding tax. Rates are per employee per month.
 */
export type PlanPricing = {
  name: "Basic" | "Executive" | "Professional";
  /** Price per employee per month, or null if not published yet. */
  perEmployeePerMonth: number | null;
  /** Lowest monthly fee charged, whatever the headcount. null = no minimum. */
  minMonthlyFee: number | null;
  /** One-time setup fee charged in the first year. null = no setup fee. */
  setupFee: number | null;
};

export const pricingConfig = {
  currency: "INR" as const,
  locale: "en-IN",
  /** Shown as a separate line in the quote. Set to 0 to hide. */
  taxRate: 0.18,
  taxLabel: "GST",
  /** Discount for paying 12 months up front, e.g. 0.1 = 10%. */
  annualPrepayDiscount: 0,
  minEmployees: 10,
  maxEmployees: 1000,
  defaultEmployees: 50,
  plans: [
    { name: "Basic", perEmployeePerMonth: null, minMonthlyFee: null, setupFee: null },
    { name: "Executive", perEmployeePerMonth: null, minMonthlyFee: null, setupFee: null },
    { name: "Professional", perEmployeePerMonth: null, minMonthlyFee: null, setupFee: null },
  ] satisfies PlanPricing[],
};

export type BillingTerm = "monthly" | "annual";

export type Quote = {
  monthly: number;
  subtotal: number;
  discount: number;
  setup: number;
  beforeTax: number;
  tax: number;
  total: number;
  perEmployeePerMonth: number;
};

/** Returns null when the plan has no published price. */
export function buildQuote(
  plan: PlanPricing,
  employees: number,
  term: BillingTerm,
): Quote | null {
  if (plan.perEmployeePerMonth === null) return null;
  const monthly = Math.max(
    employees * plan.perEmployeePerMonth,
    plan.minMonthlyFee ?? 0,
  );
  const subtotal = monthly * 12;
  const discount = term === "annual" ? subtotal * pricingConfig.annualPrepayDiscount : 0;
  const setup = plan.setupFee ?? 0;
  const beforeTax = subtotal - discount + setup;
  const tax = beforeTax * pricingConfig.taxRate;
  return {
    monthly,
    subtotal,
    discount,
    setup,
    beforeTax,
    tax,
    total: beforeTax + tax,
    perEmployeePerMonth: beforeTax / 12 / employees,
  };
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat(pricingConfig.locale, {
    style: "currency",
    currency: pricingConfig.currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
