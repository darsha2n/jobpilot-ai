
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: name.trim() },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setSuccess(true);
        setMessage(
          "Please check your email for a verification link."
        );
      }
    } catch {
      setMessage("Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f1f4f8] text-[#172b4d]">
      <header className="bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            JobPilot <span className="text-[#c99a58]">AI</span>
          </Link>
          <Link href="/" className="text-sm">
            ← Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-[0.2em] text-[#b38348]">
            Join JobPilot AI
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-tight">
            Your Career Journey
            <br />
            Starts Here.
          </h1>
          <p className="mt-6 max-w-md leading-8 text-slate-600">
            Create a free account to discover jobs based on
            your education, experience, skills and interests.
          </p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-xl">
          <h2 className="font-serif text-3xl font-bold">
            Student Registration
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create your free career account.
          </p>

          {success ? (
            <p role="status" className="mt-8 rounded-lg bg-green-50 p-5 text-green-800">
              {message}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                  placeholder="Minimum 8 characters"
                />
              </div>

              {message && (
                <p role="alert" className="text-sm text-red-600">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#172b4d] px-6 py-4 font-semibold text-white hover:bg-[#29466f] disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Free Account →"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
