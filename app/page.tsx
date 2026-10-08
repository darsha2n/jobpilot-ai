
import Link from "next/link";

export default function Home() {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Sign up and tell us about your education, experience, skills and career interests.",
    },
    {
      number: "02",
      title: "Discover Matching Jobs",
      description:
        "Explore career opportunities aligned with your preferences and qualifications.",
    },
    {
      number: "03",
      title: "Apply Directly",
      description:
        "Visit the employer's official application page and take the next step in your career.",
    },
  ];

  const features = [
    {
      title: "Personalized Job Discovery",
      description:
        "Find opportunities based on your skills, education, experience and preferred roles.",
    },
    {
      title: "AI-Assisted Job Analysis",
      description:
        "JobPilot AI uses automated analysis to organize vacancies and identify relevant career opportunities.",
    },
    {
      title: "Direct Applications",
      description:
        "Access employer application links without unnecessary intermediaries.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#192f53]">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#192f53] text-2xl font-bold text-white">
              J
            </div>

            <div>
              <div className="text-2xl font-bold tracking-tight">
                JobPilot{" "}
                <span className="text-[#c99a58]">
                  AI
                </span>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                Your Career Navigator
              </p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-4 md:gap-7">
            <Link
              href="/"
              className="text-sm font-medium hover:text-[#c99a58]"
            >
              Home
            </Link>

            <Link
              href="#about"
              className="text-sm font-medium hover:text-[#c99a58]"
            >
              About
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-[#c99a58]"
            >
              How It Works
            </Link>

            <Link
              href="#careers"
              className="text-sm font-medium hover:text-[#c99a58]"
            >
              Careers
            </Link>

            {/* SEPARATE SIGN IN BUTTON */}
            <Link
              href="/login"
              className="rounded-lg border border-[#192f53] px-5 py-3 text-sm font-semibold text-[#192f53] transition hover:bg-slate-100"
            >
              Sign In
            </Link>

            {/* SEPARATE REGISTER BUTTON */}
            <Link
              href="/register"
              className="rounded-lg bg-[#192f53] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#29466f]"
            >
              Register →
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="overflow-hidden bg-gradient-to-br from-[#192f53] to-[#29466f] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:min-h-[680px] lg:grid-cols-2">
          {/* HERO TEXT */}
          <div>
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-[#efbd7a]">
              Discover • Connect • Grow
            </p>

            <h1 className="font-serif text-5xl font-bold leading-[1.12] sm:text-6xl lg:text-7xl">
              Your Future.
              <br />
              Your Career.
              <br />
              <span className="text-[#efbd7a]">
                Your Opportunity.
              </span>
            </h1>

            <p className="mt-9 max-w-xl text-lg leading-8 text-slate-200">
              A smarter way for students and fresh
              graduates to discover career opportunities
              based on their skills, qualifications and
              ambitions.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-[#efbd7a] px-8 py-4 text-sm font-bold text-[#192f53] transition hover:bg-[#f5cf96]"
              >
                Find My Opportunities ↗
              </Link>

              <Link
                href="#how-it-works"
                className="rounded-lg border border-slate-400 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore How It Works
              </Link>
            </div>

            <p className="mt-12 text-sm text-slate-300">
              Built for freshers • Personalized discovery
              • Direct applications
            </p>
          </div>

          {/* HERO IMAGES */}
          <div className="grid h-[450px] grid-cols-3 items-center gap-3">
            <div className="h-[85%] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=85"
                alt="Professionals working together"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="h-full overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85"
                alt="Modern professional workplace"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="h-[85%] overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=85"
                alt="Team discussing ideas"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="scroll-mt-24 bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#c99a58]">
              About JobPilot AI
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
              Your Career Journey,
              Made Simpler.
            </h2>

            <p className="mt-7 text-lg leading-8 text-slate-600">
              JobPilot AI is a career discovery platform
              designed to help students and early-career
              professionals find job opportunities
              relevant to their interests, education
              and experience.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Instead of searching through multiple
              company websites, users can discover
              curated vacancies in one place and
              apply directly through employer links.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-8"
              >
                <div className="mb-5 h-1 w-14 rounded bg-[#c99a58]" />

                <h3 className="text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-[#f1f4f8] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#c99a58]">
              Simple Career Discovery
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
              How JobPilot AI Works
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-slate-600">
              Three simple steps to begin discovering
              your next career opportunity.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-9 shadow-sm"
              >
                <span className="font-serif text-5xl font-bold text-[#c99a58]">
                  {step.number}
                </span>

                <h3 className="mt-6 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREERS */}
      <section
        id="careers"
        className="scroll-mt-24 bg-white px-6 py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#c99a58]">
              Explore Opportunities
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
              Discover Career Paths
              That Match Your Goals.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Explore opportunities across marketing,
              business development, operations, supply
              chain, FMCG, agriculture, analytics and
              more.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Create your career profile to see
              published vacancies that match your
              interests and experience.
            </p>

            <Link
              href="/register"
              className="mt-9 inline-block rounded-lg bg-[#192f53] px-8 py-4 font-semibold text-white transition hover:bg-[#29466f]"
            >
              Start Exploring Jobs →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              "Marketing",
              "Business Development",
              "Operations",
              "Supply Chain",
              "FMCG",
              "Business Analytics",
              "Category Management",
              "Agribusiness",
            ].map((category) => (
              <div
                key={category}
                className="rounded-xl border border-slate-200 bg-[#f8fafc] px-5 py-7 text-center font-semibold shadow-sm"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="bg-[#192f53] px-6 py-20 text-center text-white">
        <h2 className="font-serif text-4xl font-bold md:text-5xl">
          Ready to Take the Next Step?
        </h2>

        <p className="mx-auto mt-6 max-w-xl leading-8 text-slate-200">
          Build your career profile and start
          discovering opportunities suited
          to your future.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-[#efbd7a] px-8 py-4 font-bold text-[#192f53] transition hover:bg-[#f5cf96]"
          >
            Create Free Account →
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-white/60 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
          >
            Already Registered? Sign In
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#101f38] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <p className="text-xl font-bold">
              JobPilot{" "}
              <span className="text-[#efbd7a]">
                AI
              </span>
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Your Career Navigator
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <Link href="/">Home</Link>
            <Link href="#about">About</Link>
            <Link href="#how-it-works">
              How It Works
            </Link>
            <Link href="#careers">Careers</Link>
            <Link href="/login">Sign In</Link>
            <Link href="/register">Register</Link>
          </div>

          <p className="text-sm text-slate-400">
            © 2026 JobPilot AI
          </p>
        </div>
      </footer>
    </main>
  );
}
