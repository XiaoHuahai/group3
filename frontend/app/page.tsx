import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Search Evidence</h2>
        <p className="mt-2 text-sm text-slate-600">
          Quickly search empirical studies on software engineering practices. Filter by practice, claim, and year; saved queries coming soon.
        </p>
        <form className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Keyword</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., Test-Driven Development"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Year range</span>
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                type="number"
                placeholder="2000"
              />
              <span className="text-slate-500">—</span>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                type="number"
                placeholder="2025"
              />
            </div>
          </label>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/auth"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-slate-900">Submission, Moderation, and Analysis</h3>
          <p className="mt-2 text-sm text-slate-600">
            Submitter, Moderator, and Analyst can access their queues after sign-in to submit, review, and extract evidence.
          </p>
        </Link>
        <Link
          href="/docs"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-slate-900">Roadmap and Documentation</h3>
          <p className="mt-2 text-sm text-slate-600">
            Explore iteration goals, roles, API contracts, and collaboration guidelines to onboard quickly.
          </p>
        </Link>
      </div>
    </section>
  );
}

