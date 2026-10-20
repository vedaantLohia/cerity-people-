import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResultPanel } from "@/components/assessment0/ResultPanel";
import type { Assessment0Narrative } from "@/lib/assessment0-narrative";
import { scoreAssessment0 } from "@/lib/assessment0-scoring";
import { assessment0SalesEmail, assessment0UserEmail } from "@/lib/email-templates";
import { answersFrom, SCENARIO, SCENARIO_HEADACHE } from "./helpers/answers";

const details = { email: "a@b.co", companySize: "51-200", hrHeadcount: "6", hrmsToday: "Spreadsheets" };
const result = scoreAssessment0(answersFrom(SCENARIO, SCENARIO_HEADACHE));
const best = scoreAssessment0(answersFrom([3]));

const narrative = (hostile = false): Assessment0Narrative => ({
  summary: hostile ? "<img src=x onerror=alert(1)> Summary & more" : "Your data gaps are feeding hiring and onboarding problems.",
  gaps: result.gaps.map((g) => ({
    category: g.category,
    narrative: hostile ? `<script>alert(1)</script>${g.category}` : `Custom narrative for ${g.category}.`,
    nextStep: hostile ? `"><svg onload=alert(1)>` : `Custom step for ${g.category}.`,
  })),
});

const panel = (r: typeof result, n: Assessment0Narrative | null) =>
  renderToStaticMarkup(createElement(ResultPanel, { details, result: r, userEmailSent: true, narrative: n, onRetake: () => {} }));

const noMarkupInjected = (html: string) =>
  assert.ok(!/<script>alert|<img src=x|<svg onload/.test(html) && html.includes("&lt;"));

describe("results panel", () => {
  it("with a readout: summary, per-gap narrative and next step, module line kept, fixed copy hidden", () => {
    const html = panel(result, narrative());
    assert.ok(html.includes("feeding hiring and onboarding"));
    assert.ok(html.includes("Custom narrative for HR Data") && html.includes("Next step:"));
    assert.ok(html.includes("Addressed by"));
    assert.ok(!html.includes("no reliable source of truth"));
  });

  it("without a readout: fixed copy and no next-step line", () => {
    const html = panel(result, null);
    assert.ok(html.includes("Addressed by") && !html.includes("Next step:"));
  });

  it("escapes hostile readout text", () => noMarkupInjected(panel(result, narrative(true))));

  it("all-best answers show the no-gaps notice, with or without a readout", () => {
    assert.ok(panel(best, { summary: "All strong.", gaps: [] }).includes("All strong."));
    assert.ok(panel(best, { summary: "All strong.", gaps: [] }).includes("No major gaps"));
    assert.ok(panel(best, null).includes("No major gaps"));
  });

  it("a partial readout: matched gaps use Claude, the rest fall back", () => {
    const html = panel(result, { summary: "S", gaps: [{ category: result.gaps[0].category, narrative: "Only one.", nextStep: "One step." }] });
    assert.ok(html.includes("Only one."));
    assert.equal(html.split("Next step:").length - 1, 1);
  });
});

describe("visitor email", () => {
  it("with a readout: html and text carry summary, narrative and next step", () => {
    const m = assessment0UserEmail(details, result, narrative());
    for (const body of [m.html, m.text]) {
      assert.ok(body.includes("feeding hiring"));
      assert.ok(body.includes("Custom narrative for HR Data"));
      assert.ok(body.includes("Next step: Custom step"));
    }
  });

  it("without a readout, or with the argument omitted: fixed copy", () => {
    for (const m of [assessment0UserEmail(details, result, null), assessment0UserEmail(details, result)]) {
      assert.ok(!m.html.includes("Next step:") && m.html.includes("Areas to look at first"));
    }
  });

  it("escapes hostile readout text in the html", () => {
    noMarkupInjected(assessment0UserEmail(details, result, narrative(true)).html);
  });

  it("all-best answers: no-gaps wording", () => {
    assert.ok(assessment0UserEmail(details, best, null).html.includes("No major gaps"));
    assert.ok(assessment0UserEmail(details, best, { summary: "All strong.", gaps: [] }).html.includes("All strong."));
  });
});

describe("sales email", () => {
  it("still renders, and escapes the visitor's headache text", () => {
    const m = assessment0SalesEmail(details, result, { id: "1", submittedAt: new Date() });
    assert.ok(m.html.includes("&lt;b&gt;every&lt;/b&gt;") && !m.html.includes("<b>every</b>"));
  });
});
