"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithEntra() {
  await signIn("microsoft-entra-id", { redirectTo: "/" });
}

export async function signOutFromEntra() {
  await signOut({ redirectTo: "/" });
}
