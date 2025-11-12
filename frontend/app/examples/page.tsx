"use client";

import ArticleCard from "../components/ArticleCard";

/**
 * Example page demonstrating ArticleCard component usage.
 * This page shows how the reusable ArticleCard component displays article data.
 */

export default function ExamplesPage() {
  const sampleArticles = [
    {
      title: "Test-Driven Development Improves Code Quality: An Empirical Study",
      authors: ["Smith, J.", "Doe, A.", "Johnson, M."],
      publicationYear: 2023,
      journalOrConference: "ICSE",
      practice: "TDD",
      claim: "Improves code quality",
      outcome: "Agree" as const
    },
    {
      title: "Pair Programming Effectiveness in Distributed Teams",
      authors: ["Brown, K.", "Williams, L."],
      publicationYear: 2022,
      journalOrConference: "ESEM",
      practice: "Pair Programming",
      claim: "Increases productivity",
      outcome: "Mixed" as const
    },
    {
      title: "Code Review Impact on Bug Detection",
      authors: ["Davis, R."],
      publicationYear: 2024,
      journalOrConference: "TSE",
      practice: "Code Review",
      claim: "Reduces bugs",
      outcome: "Agree" as const
    }
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Code Craft Examples</h1>
        <p className="mt-2 text-sm text-slate-600">
          This page demonstrates the ArticleCard component, a small, focused component
          that exemplifies good code craft principles.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sampleArticles.map((article, index) => (
          <ArticleCard
            key={index}
            title={article.title}
            authors={article.authors}
            publicationYear={article.publicationYear}
            journalOrConference={article.journalOrConference}
            practice={article.practice}
            claim={article.claim}
            outcome={article.outcome}
            onClick={() => console.log(`Clicked article: ${article.title}`)}
          />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Why This Component is Good Code Craft</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>✅ <strong>Single Responsibility:</strong> Only displays article metadata</li>
          <li>✅ <strong>Clear Naming:</strong> Component and props have descriptive names</li>
          <li>✅ <strong>Low Coupling:</strong> No dependencies on parent or global state</li>
          <li>✅ <strong>High Cohesion:</strong> All code relates to article display</li>
          <li>✅ <strong>Small Size:</strong> ~50 lines, easy to read and maintain</li>
          <li>✅ <strong>Reusable:</strong> Can be used anywhere articles need display</li>
          <li>✅ <strong>Type Safe:</strong> Full TypeScript typing with clear interfaces</li>
        </ul>
      </div>
    </section>
  );
}

