"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { articlesApi, type Article } from "../lib/api";
import { auth } from "../lib/auth";

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/auth");
      return;
    }
    loadArticles();
  }, [router]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await articlesApi.getMine();
      setArticles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await articlesApi.delete(id);
      setArticles(articles.filter((a) => a._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to delete");
    }
  };

  const getStatusLabel = (status?: string) => {
    const statusMap: Record<string, string> = {
      Submitted: "Submitted",
      ApprovedForAnalysis: "Approved",
      Rejected: "Rejected",
      Published: "Published",
    };
    return statusMap[status || ""] || status || "Unknown";
  };

  const getStatusColor = (status?: string) => {
    const colorMap: Record<string, string> = {
      Submitted: "bg-blue-100 text-blue-800",
      ApprovedForAnalysis: "bg-yellow-100 text-yellow-800",
      Rejected: "bg-red-100 text-red-800",
      Published: "bg-green-100 text-green-800",
    };
    return colorMap[status || ""] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">My Articles</h2>
          <p className="mt-2 text-sm text-slate-600">Manage all articles you have submitted</p>
        </div>
        <Link
          href="/articles/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          New Article
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600 mb-4">You haven&apos;t submitted any articles yet</p>
          <Link
            href="/articles/new"
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600"
          >
            Create Your First Article
          </Link>
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
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs font-medium ${getStatusColor(
                        article.status
                      )}`}
                    >
                      {getStatusLabel(article.status)}
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
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/articles/${article._id}`}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View
                  </Link>
                  {article.status === "Submitted" && (
                    <>
                      <Link
                        href={`/articles/${article._id}/edit`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article._id, article.title)}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

