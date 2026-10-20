import { ASSESSMENT0_MCQS, ASSESSMENT0_TEXT } from "@/lib/assessment0-data";

/** Answers from option positions: one 0-3 per scored question, in form order. */
export function answersFrom(positions: number[], headache = ""): Record<string, string> {
  const answers: Record<string, string> = Object.fromEntries(
    ASSESSMENT0_MCQS.map((q, i) => [q.id, q.options[positions[i] ?? positions[0] ?? 0].label]),
  );
  if (headache) answers[ASSESSMENT0_TEXT.id] = headache;
  return answers;
}

/** An 80-person firm on spreadsheets with a decent attendance tool and no data layer. */
export const SCENARIO = [1, 1, 2, 1, 1, 2, 0];
export const SCENARIO_HEADACHE = "Payroll takes 4 days <b>every</b> month & errors creep in";
