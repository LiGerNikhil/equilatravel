'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gsap: typeof import('gsap').gsap;

    const initGSAP = async () => {
      const mod = await import('gsap');
      gsap = mod.gsap;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        h1Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3 }
      )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          btnsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        );
    };

    initGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #050a08 0%, #071510 50%, #050a08 100%)',
      }}
    >
      {/* Background video - full visible on mobile, cover on desktop */}
      <video
        className="absolute inset-0 w-full h-full object-contain md:object-cover"
        src="/videos/video1.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
        {/* Main heading */}
        <h1
          ref={h1Ref}
          className="opacity-0 font-display font-bold leading-[1.1] mb-4 text-[clamp(2.5rem,8vw,6rem)]"
        >
          <span className="block text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>Luxury Cab Services</span>
          <span className="block gold-shimmer mt-1">Across India</span>
        </h1>

        {/* Subtext - short */}
        <p
          ref={subRef}
          className="opacity-0 max-w-xl mx-auto text-white/80 font-body text-base sm:text-lg leading-relaxed mb-8 sm:mb-10"
          style={{ fontWeight: 300, textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}
        >
          Your trusted partner for comfortable city rides, airport transfers, and outstation trips.
        </p>

        {/* Buttons */}
        <div
          ref={btnsRef}
          className="opacity-0 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/contact"
            className="btn-gold rounded-sm w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5"
          >
            <span>Book Your Ride</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://wa.me/918796770014"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold rounded-sm w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5"
          >
            <MessageCircle size={16} />
            <span>WhatsApp Booking</span>
          </a>
          <a
            href="tel:+918796770014"
            className="flex items-center justify-center gap-2 text-white/50 hover:text-[#c9a84c] transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Phone size={15} />
            <span>Call Now</span>
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050a08] to-transparent pointer-events-none" />
    </section>
  );
}
