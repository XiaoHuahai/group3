"use client";

import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import YearRangeInput from "./components/YearRangeInput";
import ArticleCard from "./components/ArticleCard";
import { articlesApi, statsApi, type Article, type SearchArticlesRequest, type UserStats } from "./lib/api";

// Enum options
const EVIDENCE_OUTCOMES = [
  { value: "", label: "All" },
  { value: "Supports", label: "Supports" },
  { value: "Contradicts", label: "Contradicts" },
  { value: "Mixed", label: "Mixed" },
  { value: "Inconclusive", label: "Inconclusive" },
];

const RESEARCH_METHODS = [
  { value: "", label: "All" },
  { value: "Experiment", label: "Experiment" },
  { value: "CaseStudy", label: "Case Study" },
  { value: "Survey", label: "Survey" },
  { value: "MixedMethods", label: "Mixed Methods" },
  { value: "MetaAnalysis", label: "Meta Analysis" },
  { value: "Other", label: "Other" },
];

const PARTICIPANT_TYPES = [
  { value: "", label: "All" },
  { value: "Students", label: "Students" },
  { value: "Practitioners", label: "Practitioners" },
  { value: "Mixed", label: "Mixed" },
  { value: "NotReported", label: "Not Reported" },
];

// Map backend outcome to frontend display
function mapOutcome(outcome?: string): "Agree" | "Disagree" | "Mixed" | "Unclear" | undefined {
  switch (outcome) {
    case "Supports":
      return "Agree";
    case "Contradicts":
      return "Disagree";
    case "Mixed":
      return "Mixed";
    case "Inconclusive":
      return "Unclear";
    default:
      return undefined;
  }
}

export default function HomePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [practice, setPractice] = useState("");
  const [claim, setClaim] = useState("");
  const [outcome, setOutcome] = useState("");
  const [researchMethod, setResearchMethod] = useState("");
  const [participantType, setParticipantType] = useState("");
  const [fromYear, setFromYear] = useState<number | undefined>(undefined);
  const [toYear, setToYear] = useState<number | undefined>(undefined);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    // 加载用户统计信息
    const loadUserStats = async () => {
      try {
        const stats = await statsApi.getUserStats();
        setUserStats(stats);
      } catch (err) {
        // 静默失败，不影响搜索功能
        console.error("Failed to load user stats:", err);
      }
    };
    loadUserStats();
  }, []);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const searchParams: SearchArticlesRequest = {};
      if (title.trim()) searchParams.title = title.trim();
      if (author.trim()) searchParams.author = author.trim();
      if (practice.trim()) searchParams.practice = practice.trim();
      if (claim.trim()) searchParams.claim = claim.trim();
      if (outcome) searchParams.outcome = outcome as any;
      if (researchMethod) searchParams.researchMethod = researchMethod as any;
      if (participantType) searchParams.participantType = participantType as any;
      if (fromYear) searchParams.yearFrom = fromYear;
      if (toYear) searchParams.yearTo = toYear;

      const results = await articlesApi.search(searchParams);
      setArticles(results);
      
      // Provide more detailed hint if no results
      if (results.length === 0 && !error) {
        setError("No matching articles found. Note: Search returns articles with 'Approved for Analysis' or 'Published' status. Articles need to go through submission → approval to be searchable.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Search failed, please try again later");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/articles/${articleId}`);
  };

  return (
    <section className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Search Evidence</h2>
        <p className="mt-2 text-sm text-slate-600">
          Quickly search empirical studies on software engineering practices. Filter by practice, claim, year, and more.
        </p>
        <form onSubmit={handleSearch} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">Article Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g., Test-Driven Development"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">Author Name</span>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g., Smith, J."
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">Practice</span>
              <input
                type="text"
                value={practice}
                onChange={(e) => setPractice(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g., TDD, Code Review"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">Claim</span>
              <input
                type="text"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g., Improves code quality"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">Evidence Outcome</span>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {EVIDENCE_OUTCOMES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">Research Method</span>
              <select
                value={researchMethod}
                onChange={(e) => setResearchMethod(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {RESEARCH_METHODS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">Participant Type</span>
              <select
                value={participantType}
                onChange={(e) => setParticipantType(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {PARTICIPANT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-slate-700">Year Range</span>
              <YearRangeInput
                fromYear={fromYear}
                toYear={toYear}
                onFromChange={setFromYear}
                onToChange={setToYear}
                minYear={2000}
                maxYear={2025}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* 搜索结果区域 */}
      {hasSearched && (
        <div className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">Searching...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600 mb-2 font-medium">No matching articles found</p>
              <p className="text-sm text-slate-500 mb-4">Please try adjusting your search criteria</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left max-w-2xl mx-auto">
                <p className="text-sm text-blue-800 font-medium mb-2">💡 Note:</p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Search returns articles with <strong>Approved for Analysis</strong> or <strong>Published</strong> status</li>
                  <li>Articles need to go through: submission → approval to be searchable</li>
                  <li>After approval, articles enter the analysis queue and will show more information after analysis</li>
                  <li>Articles still pending moderation will not appear in search results</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  Search Results ({articles.length} {articles.length === 1 ? 'article' : 'articles'})
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    title={article.title}
                    authors={article.authors}
                    publicationYear={article.publicationYear || 0}
                    journalOrConference={article.journalOrConference || "Unknown"}
                    practice={article.analysis?.practice}
                    claim={article.analysis?.claim}
                    outcome={mapOutcome(article.analysis?.outcome)}
                    onClick={() => handleArticleClick(article._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* User Statistics */}
      {userStats && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">User Statistics by Role</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{userStats.total}</div>
              <div className="text-sm text-slate-600 mt-1">Total Users</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">{userStats.byRole.Submitter || 0}</div>
              <div className="text-sm text-slate-600 mt-1">Submitters</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50">
              <div className="text-2xl font-bold text-yellow-600">{userStats.byRole.Moderator || 0}</div>
              <div className="text-sm text-slate-600 mt-1">Moderators</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">{userStats.byRole.Analyst || 0}</div>
              <div className="text-sm text-slate-600 mt-1">Analysts</div>
            </div>
            {userStats.byRole.Admin && (
              <div className="text-center p-4 rounded-lg bg-red-50">
                <div className="text-2xl font-bold text-red-600">{userStats.byRole.Admin}</div>
                <div className="text-sm text-slate-600 mt-1">Admins</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feature Links */}
      {!hasSearched && (
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/auth"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-slate-900">Submission, Moderation & Analysis</h3>
            <p className="mt-2 text-sm text-slate-600">
              Submitters, Moderators, and Analysts can access their respective queues after sign-in to submit, review, and extract evidence.
            </p>
          </Link>
          <Link
            href="/docs"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-slate-900">Roadmap & Documentation</h3>
            <p className="mt-2 text-sm text-slate-600">
              Explore iteration goals, roles, API contracts, and collaboration guidelines to get started quickly.
            </p>
          </Link>
        </div>
      )}
    </section>
  );
}

