import type { Metadata } from "next";
import { db } from "@/lib/db";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { loginAction, logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ tab?: string; error?: string }>;

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "SENT"
      ? "bg-emerald-100 text-emerald-800"
      : status === "FAILED"
        ? "bg-red-100 text-red-800"
        : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}>{status}</span>;
}

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const { tab, error } = await searchParams;

  if (!adminConfigured()) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <h1 className="text-2xl font-bold text-navy">Admin not configured</h1>
        <p className="mt-3 text-slate-600">
          Set an <code>ADMIN_PASSWORD</code> environment variable (at least 8 characters) in Vercel
          and redeploy to enable this page.
        </p>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24">
        <h1 className="text-2xl font-bold text-navy">Leads</h1>
        <p className="mt-2 text-sm text-slate-600">Enter the admin password to continue.</p>
        <form action={loginAction} className="mt-6 space-y-4">
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
          />
          {error ? <p className="text-sm text-red-600">Incorrect password.</p> : null}
          <button
            type="submit"
            className="w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-gold-hover"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  const active = tab === "assessments" ? "assessments" : "contacts";

  const [contacts, assessments] = await Promise.all([
    db.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    db.assessmentSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      select: {
        id: true,
        assessmentType: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        companySize: true,
        industry: true,
        overallScore: true,
        maturityBand: true,
        salesEmailStatus: true,
        userEmailStatus: true,
        createdAt: true,
      },
    }),
  ]);

  const tabClass = (name: string) =>
    `rounded-full px-4 py-2 text-sm font-semibold ${
      active === name ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-slate-200"
    }`;

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-navy">Leads</h1>
        <div className="flex items-center gap-3">
          <a
            href={`/api/admin/leads/export?type=${active}`}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-gold-hover"
          >
            Export CSV
          </a>
          <form action={logoutAction}>
            <button className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-navy">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <a href="/admin/leads" className={tabClass("contacts")}>
          Contact form ({contacts.length})
        </a>
        <a href="/admin/leads?tab=assessments" className={tabClass("assessments")}>
          Assessments ({assessments.length})
        </a>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {active === "contacts" ? (
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Team email</th>
                <th className="px-4 py-3">User email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 align-top">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                    No submissions yet.
                  </td>
                </tr>
              ) : null}
              {contacts.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {dateFormat.format(row.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy">{row.name}</td>
                  <td className="px-4 py-3">
                    <a className="text-primary underline" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{row.phone ?? "-"}</td>
                  <td className="px-4 py-3">
                    {row.company ?? "-"}
                    {row.companySize ? (
                      <span className="block text-xs text-slate-500">{row.companySize}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{row.service ?? "-"}</td>
                  <td className="max-w-[360px] whitespace-pre-wrap px-4 py-3 text-slate-700">
                    {row.message}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.salesEmailStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.userEmailStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Band</th>
                <th className="px-4 py-3">Team email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 align-top">
              {assessments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-slate-500">
                    No assessments yet.
                  </td>
                </tr>
              ) : null}
              {assessments.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {dateFormat.format(row.createdAt)}
                  </td>
                  <td className="px-4 py-3">{row.assessmentType}</td>
                  <td className="px-4 py-3 font-semibold text-navy">{row.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <a className="text-primary underline" href={`mailto:${row.email}`}>
                      {row.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{row.phone ?? "-"}</td>
                  <td className="px-4 py-3">
                    {row.company}
                    <span className="block text-xs text-slate-500">{row.companySize}</span>
                  </td>
                  <td className="px-4 py-3">{row.industry}</td>
                  <td className="px-4 py-3 font-semibold">{row.overallScore}</td>
                  <td className="px-4 py-3">{row.maturityBand}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.salesEmailStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-4 text-xs text-slate-500">Showing the latest 500. Times are in IST.</p>
    </main>
  );
}
