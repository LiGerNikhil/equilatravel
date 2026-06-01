import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServiceBySlug, services } from "@/lib/services";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: "Service" };

  return {
    title: `${service.title} | Equila Travel`,
    description: service.desc,
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  if (!service) return notFound();

  return (
    <main className="pt-20">
      <div
        className="relative py-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050a08 0%, #071510 50%, #050a08 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-[#c9a84c] mb-6"
          >
            <ArrowLeft size={16} /> Back to services
          </Link>
          <div className="text-center">
            <span className="section-tag">Service Details</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-4 mb-4">
              {service.title}
            </h1>
            <p
              className="max-w-3xl mx-auto text-white/70 text-base sm:text-lg leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              {service.overview}
            </p>
          </div>
        </div>
      </div>

      <section className="bg-[#050a08] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div>
              <div className="rounded-[30px] border border-white/10 bg-black/40 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.3)]">
                <h2 className="font-display text-2xl text-white font-semibold mb-6">
                  Why choose {service.title}?
                </h2>
                <p
                  className="text-white/60 leading-relaxed mb-8"
                  style={{ fontWeight: 300 }}
                >
                  {service.desc}
                </p>
                <div className="space-y-4">
                  {service.details.map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#c9a84c]" />
                      <p
                        className="text-white/70 leading-relaxed"
                        style={{ fontWeight: 300 }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
              <h3 className="font-display text-xl text-white font-semibold mb-5">
                What you get
              </h3>
              <ul className="space-y-4">
                {service.highlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/10 bg-[#071510] px-4 py-3 text-white/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 rounded-[28px] border border-white/10 bg-[#0b1610] p-6">
                <p
                  className="text-white/70 leading-relaxed mb-4"
                  style={{ fontWeight: 300 }}
                >
                  Ready to book? Our travel specialists are available to build
                  the perfect plan for your journey.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#c9a84c] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#b08f3b]"
                >
                  Contact us now
                  <ArrowLeft className="rotate-180" size={16} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
