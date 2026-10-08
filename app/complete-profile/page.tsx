
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const categories = [
  "Marketing",
  "Digital Marketing",
  "Business Development",
  "Sales / KAM",
  "Operations",
  "Supply Chain",
  "Business Analytics",
  "Category Management",
  "FMCG",
  "Agri Business",
];

const supabase = createClient();

export default function CompleteProfile() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [education, setEducation] = useState("MBA");
  const [experience, setExperience] = useState("0");
  const [roles, setRoles] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [alerts, setAlerts] = useState(false);

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setName(data.user.user_metadata?.full_name || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile) {
        setName(profile.full_name || "");
        setCity(profile.city || "");
        setEducation(profile.education || "MBA");
        setExperience(String(profile.experience_months ?? 0));
        setRoles(profile.preferred_roles || []);
        setSkills((profile.skills || []).join(", "));
        setAlerts(profile.email_alerts || false);
      }

      setChecking(false);
    }

    loadProfile();
  }, [router]);

  function toggleRole(role: string) {
    setRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role]
    );
  }

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const months = Number(experience);

    if (!userId) {
      setMessage("Please sign in again.");
      return;
    }

    if (!name.trim() || !city.trim()) {
      setMessage("Please complete your name and city.");
      return;
    }

    if (!Number.isInteger(months) || months < 0 || months > 600) {
      setMessage("Enter valid work experience in months.");
      return;
    }

    if (roles.length === 0) {
      setMessage("Select at least one preferred job category.");
      return;
    }

    setSaving(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || authData.user?.id !== userId) {
        setMessage("Your session expired. Please sign in again.");
        return;
      }

      const { error } = await supabase.from("profiles").upsert(
        {
          id: userId,
          full_name: name.trim(),
          city: city.trim(),
          education,
          experience_months: months,
          preferred_roles: roles,
          skills: skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          email_alerts: alerts,
        },
        { onConflict: "id" }
      );

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Profile saved successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f4f8] text-[#172b4d]">
        Checking your account...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f4f8] px-5 py-12 text-[#172b4d]">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-2xl font-bold">
          JobPilot <span className="text-[#c99a58]">AI</span>
        </Link>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-xl md:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#b38348]">
            Student Career Profile
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            Tell Us About Yourself
          </h1>

          <p className="mt-3 text-slate-600">
            Complete your details to receive relevant job recommendations.
          </p>

          <form onSubmit={saveProfile} className="mt-8 space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block font-medium">
                Full Name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="city" className="mb-2 block font-medium">
                  Preferred Job City
                </label>
                <input
                  id="city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full rounded-lg border border-slate-300 p-3"
                />
              </div>

              <div>
                <label htmlFor="education" className="mb-2 block font-medium">
                  Qualification
                </label>
                <select
                  id="education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-3"
                >
                  <option>MBA</option>
                  <option>BBA</option>
                  <option>B.Com</option>
                  <option>B.Sc</option>
                  <option>BA</option>
                  <option>Engineering</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="mb-2 block font-medium">
                Work Experience (Months)
              </label>
              <input
                id="experience"
                type="number"
                min="0"
                max="600"
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3"
              />
              <p className="mt-1 text-xs text-slate-500">
                Freshers can enter 0.
              </p>
            </div>

            <fieldset>
              <legend className="mb-3 font-medium">
                What Type of Jobs Are You Looking For?
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((role) => (
                  <label
                    key={role}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                      roles.includes(role)
                        ? "border-[#172b4d] bg-blue-50"
                        : "border-slate-200 hover:border-[#c99a58]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={roles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{role}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="skills" className="mb-2 block font-medium">
                Your Skills
              </label>
              <textarea
                id="skills"
                rows={3}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Excel, CRM, Sales, Analytics, Communication"
                className="w-full rounded-lg border border-slate-300 p-3"
              />
              <p className="mt-1 text-xs text-slate-500">
                Separate skills using commas.
              </p>
            </div>

            <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={alerts}
                onChange={(e) => setAlerts(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                I agree to receive daily emails about jobs
                matching my career preferences. I can turn
                these alerts off later.
              </span>
            </label>

            {message && (
              <p role="status" className="text-sm text-[#172b4d]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-[#172b4d] p-4 font-semibold text-white transition hover:bg-[#29466f] disabled:opacity-50"
            >
              {saving ? "Saving Profile..." : "Save My Career Profile →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
