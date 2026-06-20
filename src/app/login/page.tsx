"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) router.push("/");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center gap-1.5 text-[20px] font-bold text-ink mb-1 justify-center">
          Mindful
          <span className="text-deep">.</span>
        </div>
        <p className="text-[13px] text-ink-secondary text-center mb-7">
          Log in to sync your streak, settings, and stats.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-medium text-ink-secondary block mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-deep"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-ink-secondary block mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-deep"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[12px] text-friction-text bg-friction-bg rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 text-[14px] font-medium rounded-full py-2.5 bg-deep text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-[13px] text-ink-secondary text-center mt-5">
          New here?{" "}
          <Link href="/signup" className="text-deep-text font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
