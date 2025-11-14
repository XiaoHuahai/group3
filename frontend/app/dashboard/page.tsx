"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../lib/auth";
import type { UserInfo } from "../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/auth");
      return;
    }
    const userInfo = auth.getUserInfo();
    setUser(userInfo);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">Loading...</p>
        </div>
      </section>
    );
  }

  const roles = user?.roles || [];
  const isSubmitter = roles.includes("Submitter");
  const isModerator = roles.includes("Moderator");
  const isAnalyst = roles.includes("Analyst");
  const isAdmin = roles.includes("Admin");

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Role Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          Access features based on your assigned roles
        </p>
        {roles.length > 0 && (
          <p className="mt-1 text-sm text-slate-500">
            Current Roles: {roles.map(r => {
              const roleMap: Record<string, string> = {
                Submitter: "Submitter",
                Moderator: "Moderator",
                Analyst: "Analyst",
                Admin: "Admin"
              };
              return roleMap[r] || r;
            }).join(", ")}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(isSubmitter || isAdmin) && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Submitter Features</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/articles/new" className="text-primary hover:underline">
                  • Submit New Article
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-primary hover:underline">
                  • View My Articles
                </Link>
              </li>
            </ul>
          </div>
        )}

        {(isModerator || isAdmin) && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Moderator Features</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/moderation" className="text-primary hover:underline">
                  • Moderation Queue
                </Link>
              </li>
              <li className="text-slate-500">• Article Detail Review</li>
            </ul>
          </div>
        )}

        {(isAnalyst || isAdmin) && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Analyst Features</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="text-slate-500">• Analysis Task List (In Development)</li>
              <li className="text-slate-500">• Evidence Entry Form (In Development)</li>
            </ul>
          </div>
        )}

        {isAdmin && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Admin Features</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/admin/users" className="text-primary hover:underline">
                  • User Management
                </Link>
              </li>
              <li className="text-slate-500">• System Settings (In Development)</li>
            </ul>
          </div>
        )}

        {!isSubmitter && !isModerator && !isAnalyst && !isAdmin && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Notice</h3>
            <p className="mt-3 text-sm text-slate-600">
              You currently have no role permissions. Please contact an administrator to assign roles.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

