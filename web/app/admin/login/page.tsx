"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "../admin.css";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message || "Could not sign in.");
      return;
    }
    router.push(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="admin-auth-card">
      <Image
        className="admin-auth-card__mark"
        src="/media/signature-black.png"
        alt="Abed"
        width={180}
        height={52}
      />
      <div>
        <h1>Admin</h1>
        <p className="admin-auth-card__subtitle">Sign in to edit abedlive.com</p>
      </div>
      <label>
        Email
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error && <p className="admin-error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="admin-auth-shell">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <Link className="admin-auth-shell__back" href="/">
        ← Back to abedlive.com
      </Link>
    </div>
  );
}
