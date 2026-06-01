import type { Metadata } from 'next';
import AboutSection from '@/components/AboutSection';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Equila Travel — our story, mission, and commitment to delivering premium cab services across India. A brand of Equila Solutions Pvt Ltd.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Page banner */}
      <div
        className="relative py-20 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #050a08 0%, #071510 50%, #050a08 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10">
          <span className="section-tag">Who We Are</span>
          <h1
            className="font-display font-bold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            About <span className="gold-shimmer">Equila Travel</span>
          </h1>
        </div>
      </div>

      <AboutSection />
      <CTASection />
    </div>
  );
}
