import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  // Neutralise spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  return [headers.map(cell).join(","), ...rows.map((r) => r.map(cell).join(","))].join("\r\n");
}

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const type = new URL(request.url).searchParams.get("type");
  let csv: string;
  let name: string;

  if (type === "assessments") {
    const rows = await db.assessmentSubmission.findMany({ orderBy: { createdAt: "desc" } });
    name = "assessments";
    csv = toCsv(
      ["Received", "Type", "Name", "Email", "Phone", "Job title", "Company", "Company size", "Industry", "HR headcount", "Current HRMS", "Score", "Band"],
      rows.map((r) => [
        r.createdAt, r.assessmentType, r.name, r.email, r.phone, r.jobTitle, r.company,
        r.companySize, r.industry, r.hrHeadcount, r.currentHrms, r.overallScore, r.maturityBand,
      ]),
    );
  } else {
    const rows = await db.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
    name = "contact-leads";
    csv = toCsv(
      ["Received", "Name", "Email", "Phone", "Company", "Company size", "Country", "Service", "Message", "Source"],
      rows.map((r) => [
        r.createdAt, r.name, r.email, r.phone, r.company, r.companySize, r.country,
        r.service, r.message, r.source,
      ]),
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
