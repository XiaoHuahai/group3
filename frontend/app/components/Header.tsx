"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { auth } from "../lib/auth";
import type { UserInfo } from "../lib/api";

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 从localStorage获取用户信息
    const userInfo = auth.getUserInfo();
    setUser(userInfo);
  }, [pathname]); // 当路径变化时重新获取用户信息

  // 监听localStorage变化（用于跨标签页同步）
  useEffect(() => {
    const handleStorageChange = () => {
      const userInfo = auth.getUserInfo();
      setUser(userInfo);
    };

    window.addEventListener("storage", handleStorageChange);
    // 也监听自定义事件（用于同标签页更新）
    window.addEventListener("authStateChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChange", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    auth.logout();
  };

  const displayName = user?.name?.trim() || user?.email || "";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-primary hover:opacity-80">
          SPEED
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:text-primary transition-colors" href="/">
            Search
          </Link>
          
          {user ? (
            <>
              <Link className="hover:text-primary transition-colors" href="/articles">
                My Articles
              </Link>
              <Link className="hover:text-primary transition-colors" href="/dashboard">
                Dashboard
              </Link>
              {(user.roles?.includes("Moderator") || user.roles?.includes("Admin")) && (
                <Link className="hover:text-primary transition-colors" href="/moderation">
                  Moderation Queue
                </Link>
              )}
              {user.roles?.includes("Admin") && (
                <Link className="hover:text-primary transition-colors" href="/admin/users">
                  User Management
                </Link>
              )}
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
                <span className="text-slate-600 font-medium">
                  {displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 transition-colors"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link className="hover:text-primary transition-colors" href="/auth">
                Sign In / Register
              </Link>
              <Link className="hover:text-primary transition-colors" href="/dashboard">
                Dashboard
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
