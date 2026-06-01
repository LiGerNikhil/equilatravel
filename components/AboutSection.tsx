'use client';
import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

const features = [
  '24/7 Cab Availability',
  'Professional & Verified Drivers',
  'Clean & Sanitized Vehicles',
  'Affordable & Transparent Pricing',
  'On-Time Pickup Guarantee',
  'Safe & Secure Travel Experience',
  'Easy Booking Process',
  'Customer Support Assistance',
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal-up').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 100);
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050a08 0%, #071510 50%, #050a08 100%)' }}
    >
      {/* Decorative corner */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text */}
          <div>
            <div className="reveal-up">
              <span className="section-tag">Our Story</span>
            </div>
            <h2 className="reveal-up section-title mt-2 mb-6">
              Welcome to{' '}
              <span className="gold-shimmer">Equila Travel</span>
            </h2>
            <p className="reveal-up text-white/60 font-body text-base leading-relaxed mb-6" style={{ fontWeight: 300 }}>
              At <span className="text-[#c9a84c]">Equila Travel</span>, we believe every journey should be comfortable, reliable, and stress-free. Whether you're traveling for business, family vacations, airport pickups, or weekend getaways, our premium cab services are designed to provide convenience and safety at affordable prices.
            </p>
            <p className="reveal-up text-white/60 font-body text-base leading-relaxed mb-10" style={{ fontWeight: 300 }}>
              With experienced chauffeurs, well-maintained vehicles, and punctual service, we are committed to delivering a premium travel experience to every customer.
            </p>

            {/* Divider */}
            <div className="reveal-up royal-divider mb-10">
              <span className="section-tag whitespace-nowrap">Why Customers Trust Equila Travel</span>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={f} className="reveal-up flex items-center gap-3 group">
                  <CheckCircle2
                    size={18}
                    className="text-[#c9a84c] flex-shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-white/70 font-body text-sm group-hover:text-white transition-colors">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual card */}
          <div className="reveal-up">
            <div className="relative">
              {/* Main card */}
              <div className="glass-card rounded-sm p-8 relative overflow-hidden">
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24">
                  <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#c9a84c] to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[#c9a84c] to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24">
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-[#c9a84c] to-transparent" />
                  <div className="absolute bottom-0 left-0 h-full w-px bg-gradient-to-t from-[#c9a84c] to-transparent" />
                </div>

                <div className="text-center mb-8">
                  <span className="section-tag">Our Commitment</span>
                  <h3 className="font-display text-2xl md:text-3xl text-white mt-2">
                    Your Journey,{' '}
                    <span className="gold-shimmer">Our Priority</span>
                  </h3>
                </div>

                {/* Circular stat */}
                <div className="flex justify-around mb-8">
                  {[
                    { num: '5+', sub: 'Years Serving' },
                    { num: '500+', sub: 'Daily Rides' },
                    { num: '4.9★', sub: 'Customer Rating' },
                  ].map((s) => (
                    <div key={s.num} className="text-center">
                      <div
                        className="font-display text-2xl md:text-3xl font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #c9a84c, #f5e6b8)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {s.num}
                      </div>
                      <div className="text-white/40 text-xs tracking-wider uppercase mt-1">{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Decorative car icon */}
                <div className="flex justify-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
                      border: '1px solid rgba(201,168,76,0.3)',
                    }}
                  >
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 22L11 14h18l3 8" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
                      <rect x="4" y="22" width="32" height="8" rx="2" stroke="#c9a84c" strokeWidth="1.5"/>
                      <circle cx="12" cy="30" r="3" stroke="#c9a84c" strokeWidth="1.5"/>
                      <circle cx="28" cy="30" r="3" stroke="#c9a84c" strokeWidth="1.5"/>
                      <path d="M15 18h10" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                      <path d="M4 26h32" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3"/>
                    </svg>
                  </div>
                </div>

                <p className="text-center text-white/40 text-xs tracking-wider uppercase font-body mt-4">
                  A Product of Equila Solutions Pvt Ltd
                </p>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -top-4 -left-4 glass-card rounded-sm px-4 py-2"
                style={{ border: '1px solid rgba(201,168,76,0.4)' }}
              >
                <span className="text-[#c9a84c] font-body text-xs tracking-widest uppercase">
                  Est. 2019
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
