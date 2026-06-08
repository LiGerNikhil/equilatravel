import type { Metadata } from 'next';
import FleetSection from '@/components/FleetSection';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Equila Travel Fleet — Sedans, SUVs, Premium & Executive Cars',
  description:
    'Explore the Equila Travel vehicle fleet — Sedans, SUVs, Premium Cars, Family Vehicles, and Executive Cars. All GPS-tracked, sanitized, and driven by professional chauffeurs. Book your ride today.',
  alternates: { canonical: '/fleet' },
  openGraph: {
    title: 'Equila Travel Fleet — Sedans, SUVs, Premium & Executive Cars',
    description:
      'Explore the Equila Travel vehicle fleet — Sedans, SUVs, Premium Cars, Family Vehicles, and Executive Cars.',
  },
};

export default function FleetPage() {
  return (
    <div className="pt-20">
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
          <span className="section-tag">Look into</span>
          <h1
            className="font-display font-bold text-white mt-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Our <span className="gold-shimmer">some of fleets</span>
          </h1>
        </div>
      </div>

      <FleetSection />
      <CTASection />
    </div>
  );
}
