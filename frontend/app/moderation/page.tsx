"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { articlesApi, type Article } from "../lib/api";
import { auth } from "../lib/auth";

export default function ModerationPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        router.push("/auth");
        return;
      }

      const userInfo = auth.getUserInfo();
      if (!userInfo?.roles?.includes("Moderator") && !userInfo?.roles?.includes("Admin")) {
        setError("You do not have permission to access this page. Moderator or Admin role required.");
        setLoading(false);
        return;
      }

      loadArticles();
    };

    checkAuth();
  }, [router]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await articlesApi.getPendingModeration();
      setArticles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load pending articles");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Pending Moderation</h2>
          <p className="mt-2 text-sm text-slate-600">Review submitted articles and decide whether to approve them</p>
        </div>
        <button
          onClick={loadArticles}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600 mb-4">No articles pending moderation</p>
          <p className="text-sm text-slate-500">All submitted articles have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
                    <span className="inline-block rounded px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                      Pending
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Authors:</span> {article.authors.join(", ")}
                    </p>
                    {article.journalOrConference && (
                      <p>
                        <span className="font-medium">Journal/Conference:</span> {article.journalOrConference}
                      </p>
                    )}
                    {article.publicationYear && (
                      <p>
                        <span className="font-medium">Year:</span> {article.publicationYear}
                      </p>
                    )}
                    {article.doi && (
                      <p>
                        <span className="font-medium">DOI:</span> {article.doi}
                      </p>
                    )}
                    {article.createdAt && (
                      <p>
                        <span className="font-medium">Submitted:</span>{" "}
                        {new Date(article.createdAt).toLocaleString("en-US")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/moderation/${article._id}`}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600"
                  >
                    Moderate
                  </Link>
                  <Link
                    href={`/articles/${article._id}`}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

