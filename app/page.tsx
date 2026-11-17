import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";
import { signInWithEntra, signOutFromEntra } from "@/app/actions";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-16 text-zinc-100">
      <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
          Customer portal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Microsoft Entra External ID
        </h1>
        <p className="mt-3 text-zinc-400">
          Sign in with your customer account. Entra will run the configured
          claims extension during token issuance.
        </p>
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-zinc-400">Checking your session…</p>
          }
        >
          <AccountPanel />
        </Suspense>
      </section>
    </main>
  );
}

async function AccountPanel() {
  await connection();
  const session = await auth();

  if (!session) {
    return (
      <form action={signInWithEntra} className="mt-8">
        <button
          className="rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          type="submit"
        >
          Sign in with Microsoft
        </button>
      </form>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-medium">
            Signed in{session.user?.name ? ` as ${session.user.name}` : ""}
          </h2>
          {session.user?.email && (
            <p className="mt-1 text-sm text-zinc-400">{session.user.email}</p>
          )}
        </div>
        <form action={signOutFromEntra}>
          <button
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-300">
          Configured custom claims
        </h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-emerald-200">
          {JSON.stringify(session.user?.entraClaims ?? {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}
