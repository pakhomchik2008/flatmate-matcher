import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import HomePreview from "@/components/HomePreview";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/matches");

  return (
    <div>
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-brand/10 text-brand mb-6">
          For UK university students
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
          Find a flatmate you'll<br className="hidden md:block" /> <span className="text-brand">actually</span> get along with.
        </h1>
        <p className="text-slate-600 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
          Take a 60-second compatibility quiz and we'll rank flatmates at your university by how well your lifestyles match.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <Link href="/demo" className="btn-primary px-6 py-3 text-base">Try the demo →</Link>
          <Link href="/auth/signup" className="btn-secondary px-6 py-3 text-base">Create an account</Link>
        </div>
        <p className="text-xs text-slate-400 mt-3">No sign-up needed for the demo.</p>
      </section>

      {/* Preview mockup */}
      <section className="px-6 pb-16">
        <HomePreview />
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">How it works</h2>
          <p className="text-slate-600 text-center mt-3 max-w-xl mx-auto">Three steps. Around a minute.</p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { n: 1, title: "Create your profile", body: "Tell us your university, budget, and move-in date." },
              { n: 2, title: "Take the 60-second quiz", body: "Ten quick questions on sleep, cleanliness, noise, guests, and study habits." },
              { n: 3, title: "Get ranked matches", body: "See compatible students at your university, sorted by a weighted score — message them straight away." },
            ].map((s) => (
              <div key={s.n} className="card p-6">
                <div className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center mb-4">{s.n}</div>
                <h3 className="font-semibold text-lg text-slate-900">{s.title}</h3>
                <p className="text-slate-600 text-sm mt-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / numbers strip */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { n: "32", label: "UK universities" },
            { n: "10", label: "lifestyle dimensions" },
            { n: "60s", label: "to your first matches" },
            { n: "148", label: "matched this week" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{s.n}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 text-center">
        <div className="max-w-2xl mx-auto card p-8 bg-gradient-to-br from-brand to-brand-dark text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to find your match?</h2>
          <p className="text-white/80 mt-2">Try it without signing up — your answers stay on your device.</p>
          <Link href="/demo" className="inline-block mt-5 bg-white text-brand font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-100">Start the demo</Link>
        </div>
      </section>
    </div>
  );
}
