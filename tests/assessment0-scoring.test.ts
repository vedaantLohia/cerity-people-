import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ASSESSMENT0_CATEGORIES,
  ASSESSMENT0_CATEGORY_PRIORITY,
  ASSESSMENT0_MCQS,
  ASSESSMENT0_WEB,
  ASSESSMENT0_WEB_MAX_SHIFT,
} from "@/lib/assessment0-data";
import { gapText, scoreAssessment0 } from "@/lib/assessment0-scoring";
import { answersFrom } from "./helpers/answers";

const N = ASSESSMENT0_MCQS.length;
const everyCombination = function* () {
  for (let i = 0; i < 4 ** N; i++) {
    const s: number[] = [];
    for (let k = 0, x = i; k < N; k++, x = Math.floor(x / 4)) s.push(x % 4);
    yield s;
  }
};

describe("fixed points", () => {
  it("all worst answers score 0 and all best answers score 100", () => {
    assert.equal(scoreAssessment0(answersFrom([0])).overall, 0);
    assert.equal(scoreAssessment0(answersFrom([3])).overall, 100);
  });

  it("all-best has no gaps; all-worst has three", () => {
    assert.equal(scoreAssessment0(answersFrom([3])).gaps.length, 0);
    assert.equal(scoreAssessment0(answersFrom([0])).gaps.length, 3);
  });

  it("missing or invalid answers score 0 rather than throwing", () => {
    assert.equal(scoreAssessment0({}).overall, 0);
  });
});

describe("the web", () => {
  it("weights into any one area sum to 0.5 or less", () => {
    for (const cat of ASSESSMENT0_CATEGORIES) {
      const total = ASSESSMENT0_WEB.filter((e) => e.to === cat).reduce((s, e) => s + e.weight, 0);
      assert.ok(total <= 0.5 + 1e-9, `${cat}: ${total}`);
    }
  });

  it("every link names real areas and carries a sentence", () => {
    for (const e of ASSESSMENT0_WEB) {
      assert.ok(ASSESSMENT0_CATEGORIES.includes(e.from) && ASSESSMENT0_CATEGORIES.includes(e.to));
      assert.ok(e.from !== e.to && e.ripple.length > 10);
    }
  });

  it("every area has a tie-break priority", () => {
    for (const cat of ASSESSMENT0_CATEGORIES) assert.equal(typeof ASSESSMENT0_CATEGORY_PRIORITY[cat], "number");
  });
});

describe("across all 16,384 answer combinations", () => {
  it("scores stay in 0-100 and never move more than the cap from the visitor's own answer", () => {
    for (const s of everyCombination()) {
      for (const c of scoreAssessment0(answersFrom(s)).categories) {
        assert.ok(c.percent >= 0 && c.percent <= 100);
        assert.ok(Math.abs(c.percent - c.rawPercent) <= ASSESSMENT0_WEB_MAX_SHIFT + 0.1);
      }
    }
  });

  it("improving any one answer never lowers any score", () => {
    for (const s of everyCombination()) {
      const before = scoreAssessment0(answersFrom(s));
      for (let q = 0; q < N; q++) {
        if (s[q] === 3) continue;
        const better = [...s];
        better[q]++;
        const after = scoreAssessment0(answersFrom(better));
        assert.ok(after.overall >= before.overall - 0.05, `${s} q${q}`);
        after.categories.forEach((c, i) => assert.ok(c.percent >= before.categories[i].percent - 0.05, `${s} q${q}`));
      }
    }
  });

  it("an area answered with the best option is never listed as a gap", () => {
    for (const s of everyCombination()) {
      const r = scoreAssessment0(answersFrom(s));
      for (const g of r.gaps) {
        assert.ok(r.categories.find((c) => c.category === g.category)!.rawPercent < 100);
      }
    }
  });

  it("gaps are sorted weakest first, at most three, with copy and a module", () => {
    for (const s of everyCombination()) {
      const r = scoreAssessment0(answersFrom(s));
      assert.ok(r.gaps.length <= 3);
      for (let i = 1; i < r.gaps.length; i++) assert.ok(r.gaps[i - 1].percent <= r.gaps[i].percent);
      for (const g of r.gaps) assert.ok(gapText(g).length > 10 && g.solvedBy.length === 1);
    }
  });
});

describe("sensitivity", () => {
  it("changing a single answer always changes the overall score", () => {
    for (const s of everyCombination()) {
      const base = scoreAssessment0(answersFrom(s)).overall;
      for (let q = 0; q < N; q++) {
        const other = [...s];
        other[q] = (s[q] + 1) % 4;
        assert.notEqual(scoreAssessment0(answersFrom(other)).overall, base, `${s} q${q}`);
      }
    }
  });

  it("a change in one area ripples into connected areas", () => {
    const base = scoreAssessment0(answersFrom([2]));
    const worseAttendance = scoreAssessment0(answersFrom([2, 2, 1, 2, 2, 2, 2]));
    const payroll = (r: typeof base) => r.categories.find((c) => c.category === "Payroll & Compliance")!.percent;
    assert.ok(payroll(worseAttendance) < payroll(base));
  });

  it("the headline sentence names the strongest knock-on, or is null when nothing stands out", () => {
    assert.match(scoreAssessment0(answersFrom([0, 2, 2, 2, 2, 2, 2])).webInsight ?? "", /^Biggest knock-on:/);
    assert.equal(scoreAssessment0(answersFrom([2])).webInsight, null);
  });
});

describe("gap copy follows the answer", () => {
  it("the same area reads differently for A, B and C", () => {
    const text = (pos: number) =>
      gapText(scoreAssessment0(answersFrom([pos, 3, 3, 3, 3, 3, 3])).gaps.find((g) => g.category === "Recruitment & Hiring")!);
    assert.equal(new Set([text(0), text(1), text(2)]).size, 3);
  });

  it("ties break toward the higher-risk area", () => {
    const r = scoreAssessment0(answersFrom([2]));
    assert.deepEqual(r.gaps.map((g) => g.category), ["Payroll & Compliance", "Attendance & Leave", "Recruitment & Hiring"]);
  });
});
