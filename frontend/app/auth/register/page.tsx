"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "../../lib/api";
import { auth } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const registerData: { email: string; password: string; name?: string } = {
        email,
        password,
      };
      if (name.trim()) {
        registerData.name = name.trim();
      }

      const response = await authApi.register(registerData);
      setSuccess(true);
      
      // Auto login after successful registration
      setTimeout(async () => {
        try {
          const loginResponse = await authApi.login({ email, password });
          auth.setToken(loginResponse.accessToken, loginResponse.user);
          router.push("/dashboard");
        } catch (loginErr) {
          // If auto login fails, redirect to login page
          router.push("/auth");
        }
      }, 2000); // Wait 2 seconds to let user see success message
    } catch (err: any) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error') || !err.response) {
        errorMessage = "Cannot connect to server. Please ensure the backend service is running (http://localhost:3001)";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Create Account</h2>
        <p className="mt-2 text-sm text-slate-600">
          New users default to Submitter role. Administrators can later upgrade to Moderator or Analyst.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-700">
            <div className="font-semibold mb-1">Registration successful!</div>
            <div>
              {name.trim() ? `Welcome, ${name.trim()}!` : `Welcome, ${email}!`}
            </div>
            <div className="mt-2 text-green-600">Auto-logging in and redirecting...</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Name (Optional)</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Email</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-slate-700">Password</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </label>
          <button
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/auth" className="font-medium text-primary hover:underline">
          Sign in here
        </Link>
      </div>
    </section>
  );
}

