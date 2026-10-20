import { BAND_COLORS } from "./assessment-data";
import {
  ASSESSMENT0_CATEGORIES,
  ASSESSMENT0_CATEGORY_PRIORITY,
  ASSESSMENT0_MCQS,
  ASSESSMENT0_OPTION_INSIGHTS,
  ASSESSMENT0_WEB,
  ASSESSMENT0_WEB_HOPS,
  ASSESSMENT0_WEB_MAX_SHIFT,
  ASSESSMENT0_TEXT,
  type Assessment0Category,
  type Assessment0Mcq,
} from "./assessment0-data";
import { bandForScore, type AssessmentAnswers } from "./assessment-scoring";
import type { MaturityBand } from "./assessment-data";

export type Assessment0CategoryScore = {
  category: Assessment0Category;
  /** Score after the web: own answer plus pull from connected areas. */
  percent: number;
  /** Score from this area's own answer alone. */
  rawPercent: number;
  band: MaturityBand;
  mcqCount: number;
  rawSum: number;
};

export type Assessment0Gap = {
  category: Assessment0Category;
  percent: number;
  band: MaturityBand;
  insights: string[];
  solvedBy: string[];
};

export type Assessment0Result = {
  overall: number;
  overallBand: MaturityBand;
  categories: Assessment0CategoryScore[];
  gaps: Assessment0Gap[];
  /** The single strongest knock-on across the whole web, or null if none stands out. */
  webInsight: string | null;
  quotedText: { questionId: string; category: Assessment0Category; prompt: string; answer: string }[];
};

function strongestKnockOn(raw: Map<Assessment0Category, number>): string | null {
  const top = ASSESSMENT0_WEB.map((e) => {
    const from = raw.get(e.from) ?? 0;
    const to = raw.get(e.to) ?? 0;
    return { e, from, to, gap: e.weight * (to - from) };
  })
    .filter((d) => d.gap > 1)
    .sort((a, b) => b.gap - a.gap)[0];
  return top
    ? `Biggest knock-on: ${top.e.from} (${top.from}%) is holding back ${top.e.to} (${top.to}%). ${top.e.ripple}`
    : null;
}

/** The strongest weaker neighbour dragging this area down, as a sentence. */
function knockOn(c: Assessment0CategoryScore, raw: Map<Assessment0Category, number>): string[] {
  const drag = ASSESSMENT0_WEB.filter((e) => e.to === c.category)
    .map((e) => ({ e, gap: e.weight * (c.rawPercent - (raw.get(e.from) ?? c.rawPercent)) }))
    .filter((d) => d.gap > 0.5)
    .sort((a, b) => b.gap - a.gap)[0];
  return drag ? [drag.e.ripple] : [];
}

function insightFor(q: Assessment0Mcq, answers: AssessmentAnswers): string {
  const score = q.options.find((o) => o.label === answers[q.id])?.score ?? 0;
  const perOption = ASSESSMENT0_OPTION_INSIGHTS[q.id];
  return (score < 3 && perOption?.[score as 0 | 1 | 2]) || q.gapInsight;
}

/** One sentence of copy per gap: the answer-specific line plus any knock-on effect. */
export function gapText(g: Assessment0Gap): string {
  return g.insights.join(" ");
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function scoreAssessment0(answers: AssessmentAnswers): Assessment0Result {
  const base: Assessment0CategoryScore[] = ASSESSMENT0_CATEGORIES.map((category) => {
    const catMcqs = ASSESSMENT0_MCQS.filter((q) => q.category === category);
    const rawSum = catMcqs.reduce((sum, q) => {
      const chosen = q.options.find((o) => o.label === answers[q.id]);
      return sum + (chosen?.score ?? 0);
    }, 0);
    const max = 3 * catMcqs.length;
    const percent = max === 0 ? 0 : Math.round((rawSum / max) * 1000) / 10;
    return {
      category,
      percent,
      rawPercent: percent,
      band: bandForScore(percent),
      mcqCount: catMcqs.length,
      rawSum,
    };
  });

  // Spider web: each area moves toward the areas that feed it, repeated for
  // ASSESSMENT0_WEB_HOPS rounds so effects travel past direct neighbours. Each
  // round is a weighted average (weights into an area sum to 0.5 or less), so
  // scores stay in 0-100 and improving any answer never lowers any score.
  const raw = new Map(base.map((c) => [c.category, c.rawPercent]));
  let current = new Map(raw);
  for (let hop = 0; hop < ASSESSMENT0_WEB_HOPS; hop++) {
    const next = new Map<Assessment0Category, number>();
    for (const cat of ASSESSMENT0_CATEGORIES) {
      const inbound = ASSESSMENT0_WEB.filter((e) => e.to === cat);
      const keep = 1 - inbound.reduce((sum, e) => sum + e.weight, 0);
      next.set(
        cat,
        keep * (current.get(cat) ?? 0) +
          inbound.reduce((sum, e) => sum + e.weight * (current.get(e.from) ?? 0), 0),
      );
    }
    current = next;
  }
  const categories = base.map((c) => {
    // Capped around the visitor's own answer; still monotone in every input.
    const spread = Math.min(
      c.rawPercent + ASSESSMENT0_WEB_MAX_SHIFT,
      Math.max(c.rawPercent - ASSESSMENT0_WEB_MAX_SHIFT, current.get(c.category) ?? c.rawPercent),
    );
    const percent = round1(Math.min(100, Math.max(0, spread)));
    return { ...c, percent, band: bandForScore(percent) };
  });

  const weight = 1 / categories.length;
  const overall =
    Math.round(categories.reduce((acc, c) => acc + c.percent * weight, 0) * 10) / 10;

  // Lowest score first; ties go to the higher-risk category. Fully optimised
  // categories are not gaps, so a strong result can show fewer than three.
  const ranked = categories
    // The best answer is never a gap, even if connected areas drag its score down.
    .filter((c) => c.rawPercent < 100 && c.percent < 99.95)
    .sort(
      (a, b) =>
        a.percent - b.percent ||
        ASSESSMENT0_CATEGORY_PRIORITY[b.category] - ASSESSMENT0_CATEGORY_PRIORITY[a.category],
    );
  const gaps: Assessment0Gap[] = ranked.slice(0, 3).map((c) => {
    const catMcqs = ASSESSMENT0_MCQS.filter((q) => q.category === c.category);
    return {
      category: c.category,
      percent: c.percent,
      band: c.band,
      insights: [
        ...new Set(catMcqs.map((q) => insightFor(q, answers))),
        ...knockOn(c, raw),
      ],
      solvedBy: [...new Set(catMcqs.map((q) => q.solvedBy))],
    };
  });

  const textAnswer = (answers[ASSESSMENT0_TEXT.id] ?? "").trim();
  const quotedText = textAnswer
    ? [
        {
          questionId: ASSESSMENT0_TEXT.id,
          category: ASSESSMENT0_TEXT.category,
          prompt: ASSESSMENT0_TEXT.prompt,
          answer: textAnswer,
        },
      ]
    : [];

  return {
    webInsight: strongestKnockOn(raw),
    overall,
    overallBand: bandForScore(overall),
    categories,
    gaps,
    quotedText,
  };
}

export { BAND_COLORS };
