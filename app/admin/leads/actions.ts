"use server";

import { redirect } from "next/navigation";
import { checkPassword, endAdminSession, startAdminSession } from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const input = String(formData.get("password") ?? "");
  if (!checkPassword(input)) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    redirect("/admin/leads?error=1");
  }
  await startAdminSession();
  redirect("/admin/leads");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin/leads");
}
