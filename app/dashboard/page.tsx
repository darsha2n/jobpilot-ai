
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

type Profile = {
  full_name: string;
  city: string;
  education: string;
  experience_months: number;
  preferred_roles: string[];
  skills: string[];
  email_alerts: boolean;
};

type Job = {
  id: number;
  title: string;
  company: string;
  location: string | null;
  category: string | null;
  description: string | null;
  experience_min: number | null;
  experience_max: number | null;
  apply_url: string;
  source: string | null;
  posted_at: string | null;
  active: boolean;
  is_published: boolean;
  fresher_eligible: boolean | null;
};

type MatchedJob = Job & {
  score: number;
};

const supabase = createClient();

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function roleMatches(role: string, job: Job) {
  const roleText = normalize(role);
  const title = normalize(job.title);
  const category = normalize(job.category || "");

  if (title.includes(roleText) || category.includes(roleText)) {
    return true;
  }

  const aliases: Record<string, string[]> = {
    marketing: [
      "marketing",
      "brand",
      "growth",
      "campaign",
      "market research",
    ],
    "digital marketing": [
      "digital marketing",
      "seo",
      "social media",
      "performance marketing",
    ],
    operations: [
      "operations",
      "operations associate",
      "process executive",
    ],
    fmcg: [
      "fmcg",
      "consumer goods",
      "consumer products",
    ],
    "business development": [
      "business development",
      "business growth",
      "partnerships",
    ],
    "sales / kam": [
      "sales",
      "account manager",
      "key account",
      "territory manager",
    ],
    "supply chain": [
      "supply chain",
      "logistics",
      "warehouse",
      "procurement",
    ],
    "category management": [
      "category manager",
      "category executive",
      "category management",
    ],
    "business analytics": [
      "business analyst",
      "data analyst",
      "analytics",
    ],
    "agri business": [
      "agri",
      "agriculture",
      "horticulture",
      "fertilizer",
    ],
  };

  const keywords = aliases[roleText] || [roleText];

  return keywords.some(
    (keyword) =>
      title.includes(keyword) ||
      category.includes(keyword)
  );
}

function calculateScore(job: Job, profile: Profile) {
  let score = 0;

  const roles = profile.preferred_roles || [];
  const skills = profile.skills || [];

  const matchesRole = roles.some((role) =>
    roleMatches(role, job)
  );

  if (matchesRole) {
    score += 40;
  }

  const location = normalize(job.location || "");
  const city = normalize(profile.city || "");

  const locationMatches =
    (city.length > 0 && location.includes(city)) ||
    location.includes("remote") ||
    location.includes("work from home");

  if (locationMatches) {
    score += 25;
  }

  const months = profile.experience_months ?? 0;

  if (
    (job.experience_min === null ||
      months >= job.experience_min) &&
    (job.experience_max === null ||
      months <= job.experience_max)
  ) {
    score += 20;
  }

  const combinedText = normalize(
    `${job.title} ${job.category || ""} ${
      job.description || ""
    }`
  );

  const matchingSkills = skills.filter((skill) =>
    combinedText.includes(normalize(skill))
  );

  if (skills.length > 0) {
    score += (matchingSkills.length / skills.length) * 15;
  }

  return Math.min(100, Math.round(score));
}

function isEligible(job: Job, profile: Profile) {
  const months = profile.experience_months ?? 0;

  if (
    job.experience_min !== null &&
    months < job.experience_min
  ) {
    return false;
  }

  if (
    job.experience_max !== null &&
    months > job.experience_max
  ) {
    return false;
  }

  if (months === 0 && job.fresher_eligible === false) {
    return false;
  }

  return true;
}

function getApplyUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:"
    ) {
      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}

function getExperienceLabel(job: Job) {
  if (
    job.experience_min === null &&
    job.experience_max === null
  ) {
    return "Experience not specified";
  }

  if (
    job.experience_min !== null &&
    job.experience_max !== null
  ) {
    return `${job.experience_min}–${job.experience_max} months`;
  }

  if (job.experience_min !== null) {
    return `${job.experience_min}+ months`;
  }

  return `Up to ${job.experience_max} months`;
}

export default function Dashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(
    null
  );
  const [jobs, setJobs] = useState<MatchedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (!mounted) return;

        if (authError || !authData.user) {
          router.replace("/login");
          return;
        }

        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (!mounted) return;

        if (profileError || !profileData) {
          router.replace("/complete-profile");
          return;
        }

        const student = profileData as Profile;
        setProfile(student);

        const { data: jobData, error: jobError } =
          await supabase
            .from("jobs")
            .select("*")
            .eq("active", true)
            .eq("is_published", true)
            .order("created_at", {
              ascending: false,
            })
            .limit(200);

        if (!mounted) return;

        if (jobError) {
          setError(jobError.message);
          return;
        }

        const rankedJobs = ((jobData || []) as Job[])
          .filter((job) => isEligible(job, student))
          .map((job) => ({
            ...job,
            score: calculateScore(job, student),
          }))
          .filter((job) => job.score >= 40)
          .sort((a, b) => b.score - a.score);

        setJobs(rankedJobs);
      } catch {
        if (mounted) {
          setError("Unable to load your dashboard.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    const { error: signOutError } =
      await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${
      job.location || ""
    } ${job.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f4f8] text-[#172b4d]">
        Loading your JobPilot dashboard...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="p-10 text-[#172b4d]">
        {error || "Redirecting to your profile..."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f4f8] text-[#172b4d]">
      {/* NAVIGATION */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-bold"
          >
            JobPilot{" "}
            <span className="text-[#c99a58]">
              AI
            </span>
          </Link>

          <button
            onClick={handleSignOut}
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            Sign Out ↗
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* WELCOME SECTION */}
        <section className="rounded-2xl bg-[#172b4d] p-8 text-white md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#e9bf82]">
            Your Career Dashboard
          </p>

          <h1 className="mt-5 font-serif text-4xl md:text-5xl">
            Welcome back,{" "}
            {profile.full_name.split(" ")[0]}!
          </h1>

          <p className="mt-5 max-w-2xl font-serif text-xl italic leading-8 text-slate-200">
            “Your next opportunity begins with
            the next step you take.”
          </p>

          <p className="mt-5 text-sm text-slate-300">
            Discover career opportunities aligned
            with your goals and interests.
          </p>
        </section>

        {/* STATISTICS */}
        <section className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            {
              label: "Job Interests",
              value: profile.preferred_roles.length,
            },
            {
              label: "Your Skills",
              value: profile.skills.length,
            },
            {
              label: "Matching Jobs",
              value: jobs.length,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white p-7 shadow-sm"
            >
              <p className="text-sm text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-4xl font-bold">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-3">
          {/* CAREER PROFILE */}
          <aside className="rounded-xl bg-white p-7 shadow-sm lg:col-span-1">
            <h2 className="font-serif text-2xl font-bold">
              My Career Preferences
            </h2>

            <div className="mt-7 space-y-5">
              <div>
                <p className="text-sm text-slate-500">
                  Education
                </p>
                <p className="font-semibold">
                  {profile.education}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Preferred City
                </p>
                <p className="font-semibold">
                  {profile.city}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Experience
                </p>
                <p className="font-semibold">
                  {profile.experience_months === 0
                    ? "Fresher"
                    : `${profile.experience_months} months`}
                </p>
              </div>

              <div>
                <p className="mb-3 text-sm text-slate-500">
                  Preferred Jobs
                </p>

                <div className="flex flex-wrap gap-2">
                  {profile.preferred_roles.map(
                    (role) => (
                      <span
                        key={role}
                        className="rounded-full bg-blue-50 px-3 py-2 text-xs font-medium"
                      >
                        {role}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Skills
                </p>
                <p className="font-semibold">
                  {profile.skills.join(", ") ||
                    "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Daily Email Alerts
                </p>
                <p className="font-semibold">
                  {profile.email_alerts
                    ? "Opted in — delivery coming soon"
                    : "Disabled"}
                </p>
              </div>
            </div>

            <Link
              href="/complete-profile"
              className="mt-8 block rounded-lg border border-[#172b4d] px-5 py-3 text-center font-semibold transition hover:bg-slate-50"
            >
              ✎ Edit My Profile
            </Link>
          </aside>

          {/* JOB LISTINGS */}
          <section className="rounded-xl bg-white p-7 shadow-sm lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold">
              Matching Job Opportunities
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Relevant opportunities based on your
              career profile.
            </p>

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search company, role or location..."
              className="mt-7 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#c99a58]"
            />

            {error && (
              <p
                role="alert"
                className="mt-5 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {filteredJobs.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                <p className="text-4xl">◇</p>

                <h3 className="mt-4 text-xl font-bold">
                  No matching jobs found yet
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {jobs.length > 0
                    ? "Try another search term."
                    : "Your profile is ready. Matching vacancies will appear here once jobs are verified and published."}
                </p>
              </div>
            ) : (
              <div className="mt-7 space-y-4">
                {filteredJobs.map((job) => {
                  const applyUrl = getApplyUrl(
                    job.apply_url
                  );

                  return (
                    <article
                      key={job.id}
                      className="rounded-xl border border-slate-200 p-6 transition hover:border-[#c99a58] hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold">
                            {job.title}
                          </h3>

                          <p className="mt-2 text-sm text-slate-600">
                            {job.company} ·{" "}
                            {job.location ||
                              "Location not listed"}
                          </p>
                        </div>

                        <span className="rounded-full bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">
                          {job.score}% relevance
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.category && (
                          <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-medium text-blue-900">
                            {job.category}
                          </span>
                        )}

                        <span className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-700">
                          {getExperienceLabel(job)}
                        </span>
                      </div>

                      {job.description && (
                        <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                          {job.description}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">
                          Source:{" "}
                          {job.source ||
                            "Company careers"}
                        </p>

                        {applyUrl ? (
                          <a
                            href={applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-[#172b4d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#29466f]"
                          >
                            Apply Now ↗
                          </a>
                        ) : (
                          <span className="text-sm text-slate-500">
                            Application link unavailable
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <footer className="py-10 text-center text-sm text-slate-500">
          © 2026 JobPilot AI — Your Career Navigator
        </footer>
      </div>
    </main>
  );
}
