import Link from "next/link";

export default function AuthPage() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Sign in to SPEED</h2>
        <p className="mt-2 text-sm text-slate-600">Sign in with your registered email to access your role-specific dashboard.</p>
        <form className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Email</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="email"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Password</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="password"
              placeholder="At least 6 characters"
            />
          </label>
          <button
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        Don't have an account?{" "}
        <Link href="/auth/register" className="font-medium text-primary hover:underline">
          Sign up here
        </Link>
      </div>
    </section>
  );
}

