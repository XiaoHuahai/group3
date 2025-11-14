"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usersApi, type UserInfo } from "../../lib/api";
import { auth } from "../../lib/auth";

const ROLE_OPTIONS = [
  { value: "Submitter", label: "提交者" },
  { value: "Moderator", label: "审核者" },
  { value: "Analyst", label: "分析员" },
  { value: "Admin", label: "管理员" },
];

export default function UsersManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
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
      if (!userInfo?.roles?.includes("Admin")) {
        setError("您没有权限访问此页面");
        return;
      }

      loadUsers();
    };

    checkAuth();
  }, [router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "加载用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoles = async (userId: string, newRoles: string[]) => {
    if (newRoles.length === 0) {
      alert("用户必须至少有一个角色");
      return;
    }

    try {
      setUpdating(userId);
      await usersApi.updateRoles(userId, newRoles);
      await loadUsers(); // 重新加载用户列表
      alert("角色更新成功");
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "更新角色失败");
    } finally {
      setUpdating(null);
    }
  };

  const toggleRole = (user: UserInfo, role: string) => {
    const currentRoles = user.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    
    handleUpdateRoles(user._id, newRoles);
  };

  if (isAuthenticated === null) {
    return (
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">加载中...</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || error) {
    return (
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error || "您没有权限访问此页面"}
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600">加载中...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">用户管理</h2>
          <p className="mt-2 text-sm text-slate-600">管理用户角色和权限</p>
        </div>
        <button
          onClick={loadUsers}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          刷新
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                用户信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                角色
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{user.email}</div>
                  {user.name && (
                    <div className="text-sm text-slate-500">{user.name}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {(user.roles || []).map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {ROLE_OPTIONS.find((opt) => opt.value === role)?.label || role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map((roleOption) => {
                      const hasRole = (user.roles || []).includes(roleOption.value);
                      const isUpdating = updating === user._id;
                      return (
                        <button
                          key={roleOption.value}
                          onClick={() => toggleRole(user, roleOption.value)}
                          disabled={isUpdating}
                          className={`px-3 py-1 text-xs font-medium rounded-md ${
                            hasRole
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {hasRole ? "✓ " : ""}
                          {roleOption.label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600">暂无用户</p>
        </div>
      )}
    </section>
  );
}

