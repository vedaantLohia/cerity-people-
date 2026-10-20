import { ASSESSMENT_QUESTIONS, type McqOption, type McqQuestion, type TextQuestion } from "./assessment-data";
import { hrTechModules } from "./data";

export const ASSESSMENT0_CATEGORIES = [
  "Recruitment & Hiring",
  "Onboarding",
  "Attendance & Leave",
  "Payroll & Compliance",
  "Performance Management",
  "Engagement & Retention",
  "HR Data & Reporting",
] as const;

export type Assessment0Category = (typeof ASSESSMENT0_CATEGORIES)[number];

export type Assessment0Mcq = Omit<McqQuestion, "category"> & { category: Assessment0Category };
export type Assessment0Text = Omit<TextQuestion, "category"> & { category: Assessment0Category };
export type Assessment0Question = Assessment0Mcq | Assessment0Text;

function moduleTitle(title: string): string {
  const match = hrTechModules.find((m) => m.title === title);
  if (!match) {
    throw new Error(`Unknown HR tech module: ${title}`);
  }
  return match.title;
}

function fromExisting(id: string, category: Assessment0Category): Assessment0Mcq {
  const found = ASSESSMENT_QUESTIONS.find((q) => q.id === id);
  if (!found || found.type !== "mcq") {
    throw new Error(`Missing MCQ ${id}`);
  }
  return { ...found, category };
}

function mcq(
  id: string,
  category: Assessment0Category,
  prompt: string,
  options: [McqOption, McqOption, McqOption, McqOption],
  gapInsight: string,
  solvedBy: string,
): Assessment0Mcq {
  return {
    id,
    category,
    type: "mcq",
    prompt,
    options,
    gapInsight,
    solvedBy: moduleTitle(solvedBy),
  };
}

function text(id: string, category: Assessment0Category, prompt: string): Assessment0Text {
  return { id, category, type: "text", prompt };
}

/** Seven scored MCQs (reused by id where they fit) plus one optional one-liner. */
export const ASSESSMENT0_QUESTIONS: Assessment0Question[] = [
  fromExisting("rec-q1", "Recruitment & Hiring"),
  fromExisting("onb-q1", "Onboarding"),
  fromExisting("att-q1", "Attendance & Leave"),
  fromExisting("pay-q1", "Payroll & Compliance"),
  mcq(
    "perf-q0",
    "Performance Management",
    "How do you set goals and run performance reviews?",
    [
      { label: "Informal conversations only — no consistent record", score: 0 },
      { label: "Annual reviews in documents or slides", score: 1 },
      { label: "A review tool, with goals still loosely tracked", score: 2 },
      { label: "Ongoing goals, reviews, and development in one system", score: 3 },
    ],
    "Goals and reviews are hard to coach against because they are not captured consistently.",
    "Performance",
  ),
  mcq(
    "eng-q0",
    "Engagement & Retention",
    "How do you track engagement, attrition risk, and why people leave?",
    [
      { label: "We hear issues only when someone resigns", score: 0 },
      { label: "Occasional surveys or manager notes", score: 1 },
      { label: "Regular pulse surveys, with limited follow-up", score: 2 },
      { label: "Engagement signals, stay conversations, and action tracking", score: 3 },
    ],
    "Retention risk stays invisible until people leave, so action often comes too late.",
    "Employee Management",
  ),
  fromExisting("dat-q2", "HR Data & Reporting"),
  text("headache-t0", "Engagement & Retention", "What is your single biggest HR headache today?"),
];

export const ASSESSMENT0_MCQS = ASSESSMENT0_QUESTIONS.filter(
  (q): q is Assessment0Mcq => q.type === "mcq",
);

/**
 * Tie-break when categories share a score: higher number = shown first.
 * Compliance and attendance carry the most risk, so they win ties.
 */
export const ASSESSMENT0_CATEGORY_PRIORITY: Record<Assessment0Category, number> = {
  "Payroll & Compliance": 7,
  "Attendance & Leave": 6,
  "Recruitment & Hiring": 5,
  Onboarding: 4,
  "Performance Management": 3,
  "Engagement & Retention": 2,
  "HR Data & Reporting": 1,
};

/**
 * The "web": how one area drags on or lifts another. Each edge says the `from`
 * area influences the `to` area with `weight`. Weights into any one area sum to
 * 0.5 or less, so scores stay between 0 and 100 and all-0 / all-100 stay fixed.
 * The pull is applied ASSESSMENT0_WEB_HOPS times, so effects travel past direct
 * neighbours. More hops = wider, flatter ripples; 1 = direct neighbours only.
 */
export const ASSESSMENT0_WEB_HOPS = 2;

/**
 * The most the web may move an area away from its own answer, in points. Keeps
 * a score honest to what the visitor said while still letting neighbours nudge it.
 */
export const ASSESSMENT0_WEB_MAX_SHIFT = 25;

export type Assessment0Edge = {
  from: Assessment0Category;
  to: Assessment0Category;
  weight: number;
  ripple: string;
};

export const ASSESSMENT0_WEB: Assessment0Edge[] = [
  { from: "Attendance & Leave", to: "Payroll & Compliance", weight: 0.3, ripple: "Unreliable attendance feeds straight into pay runs, which compounds this." },
  { from: "HR Data & Reporting", to: "Payroll & Compliance", weight: 0.15, ripple: "Weak people data means payroll inputs are rebuilt by hand each cycle." },
  { from: "Recruitment & Hiring", to: "Onboarding", weight: 0.25, ripple: "A loose hiring pipeline hands onboarding incomplete candidate records." },
  { from: "Onboarding", to: "Engagement & Retention", weight: 0.15, ripple: "A rough first week sets the tone for early attrition." },
  { from: "Onboarding", to: "HR Data & Reporting", weight: 0.1, ripple: "Paperwork captured late leaves gaps in the employee record." },
  { from: "Attendance & Leave", to: "HR Data & Reporting", weight: 0.1, ripple: "Attendance that is not captured cleanly leaves holes in workforce reports." },
  { from: "Payroll & Compliance", to: "HR Data & Reporting", weight: 0.1, ripple: "Payroll kept outside the HR record splits the source of truth." },
  { from: "Performance Management", to: "Engagement & Retention", weight: 0.25, ripple: "Without clear goals and feedback, engagement is harder to hold." },
  { from: "Engagement & Retention", to: "Performance Management", weight: 0.15, ripple: "Low engagement signals make reviews less honest and less useful." },
  { from: "HR Data & Reporting", to: "Performance Management", weight: 0.1, ripple: "Without reliable data, goals and reviews lack evidence to coach against." },
  { from: "HR Data & Reporting", to: "Recruitment & Hiring", weight: 0.1, ripple: "Without workforce data, hiring plans rest on guesses." },
  { from: "HR Data & Reporting", to: "Engagement & Retention", weight: 0.1, ripple: "Without data, attrition patterns are hard to spot early." },
  { from: "Recruitment & Hiring", to: "HR Data & Reporting", weight: 0.1, ripple: "Candidate details kept outside the system never reach the employee record." },
  { from: "Engagement & Retention", to: "Recruitment & Hiring", weight: 0.1, ripple: "Unseen attrition keeps hiring in constant catch-up mode." },
  { from: "Performance Management", to: "Onboarding", weight: 0.1, ripple: "Without clear role goals, new joiners start without a clear picture of success." },
  { from: "Onboarding", to: "Performance Management", weight: 0.1, ripple: "An uneven start makes early goals and feedback harder to set." },
  { from: "HR Data & Reporting", to: "Attendance & Leave", weight: 0.1, ripple: "Without a central record, attendance rules are applied inconsistently." },
  { from: "Payroll & Compliance", to: "Attendance & Leave", weight: 0.1, ripple: "Pay-cycle pressure shows up as last-minute attendance corrections." },
  { from: "Engagement & Retention", to: "Attendance & Leave", weight: 0.1, ripple: "Disengagement tends to show first as absence and irregular attendance." },
];

/**
 * Gap copy per answer, indexed by option score 0-2. A score of 3 is never a gap.
 * Falls back to the question's static gapInsight if an id is missing here.
 */
export const ASSESSMENT0_OPTION_INSIGHTS: Record<string, [string, string, string]> = {
  "rec-q1": [
    "Hiring lives outside any system of record, so pipelines stall and offers are hard to audit.",
    "Spreadsheets give a shared view but no stages, SLAs, or audit trail, so hiring speed is hard to measure.",
    "You have an ATS, but without integrated stages, SLAs, and reporting, hiring bottlenecks stay hidden.",
  ],
  "onb-q1": [
    "Onboarding is paper-based and reactive, so day-one readiness depends on who remembers to chase.",
    "Email checklists and shared folders leave tasks and documents easy to miss or lose.",
    "A basic onboarding tool is in place, but tasks and documents are not yet automated into one day-one flow.",
  ],
  "att-q1": [
    "Attendance has no reliable record, so payroll, leave, and compliance all rest on guesswork.",
    "Manager-updated spreadsheets are error-prone and hard to reconcile with leave and payroll.",
    "Attendance is captured, but without policy-based regularisation, exceptions are still fixed by hand each cycle.",
  ],
  "pay-q1": [
    "Payroll and filings are manual and reactive, which raises the risk of errors and missed deadlines.",
    "Spreadsheets and calendar reminders leave payroll accuracy and filing evidence dependent on people, not process.",
    "Payroll is on software, but filings that sit with a consultant or separate tool make records slow to assemble for review.",
  ],
  "perf-q0": [
    "With no consistent record, goals and reviews cannot be coached against or defended later.",
    "Annual reviews in documents capture one moment a year, so feedback arrives late and goals drift.",
    "A review tool exists, but loosely tracked goals mean development and reviews are not yet connected.",
  ],
  "eng-q0": [
    "Retention risk stays invisible until people resign, so action almost always comes too late.",
    "Occasional surveys and manager notes give signals, but not early or consistent enough to act on.",
    "Pulse surveys run, but limited follow-up means people may not see action on what they raise.",
  ],
  "dat-q2": [
    "Scattered files mean there is no reliable source of truth, and leadership reports wait on manual extracts.",
    "Master spreadsheets and monthly slides go stale quickly and depend on whoever maintains them.",
    "An HR tool holds some fields, but reports that are not self-serve still depend on manual extracts.",
  ],
};

export const ASSESSMENT0_TEXT = ASSESSMENT0_QUESTIONS.find(
  (q): q is Assessment0Text => q.type === "text",
)!;

export const HEADACHE_MAX = 200;

export type Assessment0Details = {
  email: string;
  companySize: string;
  hrHeadcount: string;
  hrmsToday: string;
};

export const emptyAssessment0Details = (): Assessment0Details => ({
  email: "",
  companySize: "",
  hrHeadcount: "",
  hrmsToday: "",
});
