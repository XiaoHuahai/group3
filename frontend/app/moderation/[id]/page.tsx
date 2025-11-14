"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { articlesApi, type Article } from "../../lib/api";
import { auth } from "../../lib/auth";

export default function ModerationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [note, setNote] = useState("");
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

      loadArticle();
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await articlesApi.getById(id);
      setArticle(data);
      
      // Check article status
      if (data.status !== "Submitted") {
        setError("This article is not in pending status and cannot be moderated.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load article");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async () => {
    if (!decision) {
      alert("Please select a moderation decision (approve or reject)");
      return;
    }

    if (decision === "reject" && !note.trim()) {
      if (!confirm("It is recommended to provide a note when rejecting an article. Continue without a note?")) {
        return;
      }
    }

    if (!confirm(`Are you sure you want to ${decision === "approve" ? "approve" : "reject"} this article?`)) {
      return;
    }

    try {
      setProcessing(true);
      setError("");
      await articlesApi.moderate(id, decision, note.trim() || undefined);
      alert(`Article has been ${decision === "approve" ? "approved" : "rejected"}`);
      router.push("/moderation");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Moderation operation failed");
    } finally {
      setProcessing(false);
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">Loading...</p>
        </div>
      </section>
    );
  }

  if (error && !article) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
        <Link
          href="/moderation"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600"
        >
          Back to Moderation Queue
        </Link>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          Article not found
        </div>
        <Link
          href="/moderation"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600"
        >
          Back to Moderation Queue
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Moderate Article</h2>
          <p className="mt-2 text-sm text-slate-600">Review article content and make a moderation decision</p>
        </div>
        <Link
          href="/moderation"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Queue
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Article Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 flex-1">{article.title}</h3>
          <span className="inline-block rounded px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
            Pending
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Authors</label>
            <p className="text-sm text-slate-900">{article.authors.join(", ")}</p>
          </div>
          {article.publicationYear && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Publication Year</label>
              <p className="text-sm text-slate-900">{article.publicationYear}</p>
            </div>
          )}
          {article.journalOrConference && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Journal/Conference</label>
              <p className="text-sm text-slate-900">{article.journalOrConference}</p>
            </div>
          )}
          {article.doi && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">DOI</label>
              <p className="text-sm text-slate-900">{article.doi}</p>
            </div>
          )}
          {(article.volume || article.issue || article.pages) && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Publication Info</label>
              <p className="text-sm text-slate-900">
                {[
                  article.volume && `Vol. ${article.volume}`,
                  article.issue && `Issue ${article.issue}`,
                  article.pages && `Pages ${article.pages}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
          {article.createdAt && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Submitted</label>
              <p className="text-sm text-slate-900">
                {new Date(article.createdAt).toLocaleString("en-US")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Moderation Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">Moderation Decision</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Select Moderation Result
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDecision("approve")}
                disabled={processing}
                className={`flex-1 rounded-md border-2 px-4 py-3 text-sm font-medium transition ${
                  decision === "approve"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                ✓ Approve
              </button>
              <button
                type="button"
                onClick={() => setDecision("reject")}
                disabled={processing}
                className={`flex-1 rounded-md border-2 px-4 py-3 text-sm font-medium transition ${
                  decision === "reject"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                ✗ Reject
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Moderation Note {decision === "reject" && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                decision === "approve"
                  ? "Optional: Add moderation note..."
                  : "Recommended: Provide rejection reason..."
              }
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={processing}
            />
            <p className="mt-1 text-xs text-slate-500">
              {decision === "reject"
                ? "Recommended to provide rejection reason to help submitters understand the issue"
                : "Optional: Add moderation comments or notes"}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleModerate}
              disabled={!decision || processing}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Processing..." : "Submit Decision"}
            </button>
            <Link
              href="/moderation"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

