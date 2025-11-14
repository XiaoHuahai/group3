"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { articlesApi, type Article } from "../../lib/api";
import { auth } from "../../lib/auth";

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await articlesApi.getById(id);
      setArticle(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "加载文章失败");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status?: string) => {
    const statusMap: Record<string, string> = {
      Submitted: "已提交",
      ApprovedForAnalysis: "已审核",
      Rejected: "已拒绝",
      Published: "已发布",
    };
    return statusMap[status || ""] || status || "未知";
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
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">加载中...</p>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error || "文章不存在或无法访问"}
        </div>
        <Link
          href="/articles"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600"
        >
          返回列表
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">文章详情</h2>
        </div>
        <Link
          href="/articles"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          返回列表
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 flex-1">{article.title}</h3>
          {article.status && (
            <span
              className={`inline-block rounded px-3 py-1 text-sm font-medium ${getStatusColor(
                article.status
              )}`}
            >
              {getStatusLabel(article.status)}
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">作者</label>
            <p className="text-sm text-slate-900">{article.authors.join(", ")}</p>
          </div>
          {article.publicationYear && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">发表年份</label>
              <p className="text-sm text-slate-900">{article.publicationYear}</p>
            </div>
          )}
          {article.journalOrConference && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">期刊/会议</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">出版信息</label>
              <p className="text-sm text-slate-900">
                {[
                  article.volume && `卷 ${article.volume}`,
                  article.issue && `期 ${article.issue}`,
                  article.pages && `页码 ${article.pages}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>

        {article.analysis && (
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">分析信息</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">实践</label>
                <p className="text-sm text-slate-900">{article.analysis.practice}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">声明</label>
                <p className="text-sm text-slate-900">{article.analysis.claim}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">结果</label>
                <p className="text-sm text-slate-900">{article.analysis.outcome}</p>
              </div>
              {article.analysis.researchMethod && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">研究方法</label>
                  <p className="text-sm text-slate-900">{article.analysis.researchMethod}</p>
                </div>
              )}
              {article.analysis.participantType && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">参与者类型</label>
                  <p className="text-sm text-slate-900">{article.analysis.participantType}</p>
                </div>
              )}
              {article.analysis.summary && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">摘要</label>
                  <p className="text-sm text-slate-900 whitespace-pre-wrap">{article.analysis.summary}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {article.status === "Submitted" && auth.isAuthenticated() && (
          <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
            <Link
              href={`/articles/${article._id}/edit`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600"
            >
              编辑文章
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
