"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { articlesApi, type CreateArticleRequest, type Article } from "../../../lib/api";
import { auth } from "../../../lib/auth";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: "",
    authors: [],
    journalOrConference: "",
    publicationYear: undefined,
    volume: "",
    issue: "",
    pages: "",
    doi: "",
  });
  const [authorInput, setAuthorInput] = useState("");

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await articlesApi.getById(id);
      setArticle(data);
      setFormData({
        title: data.title,
        authors: data.authors,
        journalOrConference: data.journalOrConference || "",
        publicationYear: data.publicationYear,
        volume: data.volume || "",
        issue: data.issue || "",
        pages: data.pages || "",
        doi: data.doi || "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "加载文章失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/auth");
      return;
    }
    loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      setFormData({
        ...formData,
        authors: [...formData.authors, authorInput.trim()],
      });
      setAuthorInput("");
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!formData.title.trim()) {
      setError("标题不能为空");
      setSaving(false);
      return;
    }
    if (formData.authors.length === 0) {
      setError("至少需要一个作者");
      setSaving(false);
      return;
    }

    try {
      const cleanData: CreateArticleRequest = {
        title: formData.title.trim(),
        authors: formData.authors,
        ...(formData.journalOrConference?.trim() && {
          journalOrConference: formData.journalOrConference.trim(),
        }),
        ...(formData.publicationYear && { publicationYear: formData.publicationYear }),
        ...(formData.volume?.trim() && { volume: formData.volume.trim() }),
        ...(formData.issue?.trim() && { issue: formData.issue.trim() }),
        ...(formData.pages?.trim() && { pages: formData.pages.trim() }),
        ...(formData.doi?.trim() && { doi: formData.doi.trim() }),
      };

      await articlesApi.update(id, cleanData);
      router.push("/articles");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "更新文章失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">加载中...</p>
        </div>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          文章不存在或无法访问
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">编辑文章</h2>
        <p className="mt-2 text-sm text-slate-600">修改文章信息</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            作者 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="输入作者姓名"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddAuthor();
                }
              }}
              disabled={saving}
            />
            <button
              type="button"
              onClick={handleAddAuthor}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              disabled={saving}
            >
              添加
            </button>
          </div>
          {formData.authors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.authors.map((author, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-700"
                >
                  {author}
                  <button
                    type="button"
                    onClick={() => handleRemoveAuthor(index)}
                    className="text-slate-500 hover:text-slate-700"
                    disabled={saving}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">期刊/会议</label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.journalOrConference || ""}
              onChange={(e) => setFormData({ ...formData, journalOrConference: e.target.value })}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">发表年份</label>
            <input
              type="number"
              min="1900"
              max="2100"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.publicationYear || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  publicationYear: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              disabled={saving}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">卷号</label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.volume || ""}
              onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">期号</label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.issue || ""}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">页码</label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={formData.pages || ""}
              onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
              disabled={saving}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">DOI</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={formData.doi || ""}
            onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
            disabled={saving}
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? "保存中..." : "保存更改"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/articles")}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            disabled={saving}
          >
            取消
          </button>
        </div>
      </form>
    </section>
  );
}
