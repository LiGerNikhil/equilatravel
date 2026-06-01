import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: '#050a08' }}
    >
      <div
        className="text-[120px] md:text-[180px] font-display font-bold leading-none mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        404
      </div>
      <h1 className="font-display text-2xl md:text-3xl text-white mb-4">
        Page <span className="gold-shimmer">Not Found</span>
      </h1>
      <p className="text-white/40 font-body text-sm mb-10 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn-gold rounded-sm">
        <span>Back to Home</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
