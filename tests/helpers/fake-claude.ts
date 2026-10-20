import http from "node:http";
import type { AddressInfo } from "node:net";

/**
 * A stand-in for the Claude Messages API. Pick how it misbehaves with setMode(); it reads
 * the gap areas out of the prompt so a "good" reply always matches what was asked.
 */
export type Mode =
  | "ok" | "json_in_fence" | "reordered" | "fallback_block" | "extra_gap" | "duplicate_gap"
  | "html_inject" | "http500" | "http429" | "http401" | "http400" | "html_body" | "not_json"
  | "missing_summary" | "wrong_category" | "missing_gap" | "overlong" | "refusal"
  | "max_tokens" | "empty_content" | "hang";

const message = (content: unknown[], stop = "end_turn") =>
  JSON.stringify({
    id: "msg_test", type: "message", role: "assistant", model: "claude-opus-5-5",
    content, stop_reason: stop, stop_sequence: null, usage: { input_tokens: 1, output_tokens: 1 },
  });

const readout = (cats: string[], over: Record<string, unknown> = {}) =>
  JSON.stringify({
    summary: "A tailored summary.",
    gaps: cats.map((c) => ({ category: c, narrative: `Narrative for ${c}.`, nextStep: `Step for ${c}.` })),
    ...over,
  });

export async function startFakeClaude(port: number) {
  let mode: Mode = "ok";
  let hits = 0;
  let lastRequest: Record<string, unknown> = {};
  const sockets = new Set<import("node:net").Socket>();

  const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", (d) => (body += d));
    req.on("end", () => {
      hits++;
      lastRequest = JSON.parse(body);
      const prompt = (lastRequest.messages as { content: string }[])[0].content;
      const cats = [...prompt.matchAll(/^- ([A-Za-z &]+) \(\d+\.?\d*%, \w+\)\. Offer/gm)].map((m) => m[1]);
      const send = (status: number, text: string) => {
        res.statusCode = status;
        res.setHeader("content-type", "application/json");
        res.end(text);
      };
      const reply = (text: string, stop = "end_turn") => send(200, message([{ type: "text", text }], stop));
      const err = (status: number, type: string) =>
        send(status, JSON.stringify({ type: "error", error: { type, message: type } }));

      switch (mode) {
        case "json_in_fence": return reply("```json\n" + readout(cats) + "\n```");
        case "reordered": return reply(readout([...cats].reverse()));
        case "fallback_block":
          return send(200, message([
            { type: "fallback", from: { model: "claude-opus-5-5" }, to: { model: "claude-opus-4-8" } },
            { type: "text", text: readout(cats) },
          ]));
        case "extra_gap": return reply(readout([...cats, "Payroll & Compliance", "Attendance & Leave"]));
        case "duplicate_gap": return reply(readout([cats[0], cats[0], ...cats.slice(1)]));
        case "html_inject":
          return reply(JSON.stringify({
            summary: "<img src=x onerror=alert(1)> summary & more",
            gaps: cats.map((c) => ({
              category: c,
              narrative: `<script>alert(1)</script>Narrative for ${c}.`,
              nextStep: `"><svg onload=alert(1)>Step for ${c}.`,
            })),
          }));
        case "http500": return err(500, "api_error");
        case "http429": return err(429, "rate_limit_error");
        case "http401": return err(401, "authentication_error");
        case "http400": return err(400, "invalid_request_error");
        case "html_body": return send(502, "<html>Bad gateway</html>");
        case "not_json": return reply("Sure! Here is your readout: it looks fine.");
        case "missing_summary": return reply(JSON.stringify({ gaps: [] }));
        case "wrong_category": return reply(readout(["Not A Real Area", ...cats.slice(1)]));
        case "missing_gap": return reply(readout(cats.slice(0, 2)));
        case "overlong": return reply(readout(cats, { summary: "x".repeat(5000) }));
        case "refusal": return send(200, message([], "refusal"));
        case "max_tokens": return reply(readout(cats).slice(0, 40), "max_tokens");
        case "empty_content": return send(200, message([]));
        case "hang": return; // never answers
        default: return reply(readout(cats));
      }
    });
  });
  server.on("connection", (s) => {
    sockets.add(s);
    s.on("close", () => sockets.delete(s));
  });
  await new Promise<void>((resolve) => server.listen(port, resolve));

  return {
    port: (server.address() as AddressInfo).port,
    setMode(m: Mode) { mode = m; hits = 0; },
    hits: () => hits,
    lastRequest: () => lastRequest,
    close() { sockets.forEach((s) => s.destroy()); server.close(); },
  };
}
