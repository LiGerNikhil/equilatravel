export default function VideoExperienceSection() {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #050a08 0%, #071510 0%, #050a08 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-10 left-[-5%] w-[320px] h-[320px] md:w-[420px] md:h-[420px]"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase font-body mb-3">
            3D Experience
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-white font-semibold tracking-tight">
            Explore your journey in premium motion.
          </h2>
          <p
            className="mt-4 text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ fontWeight: 300 }}
          >
            A refined preview section designed to showcase the luxury travel
            motion in a sleek frame with subtle depth and modern polish.
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-0">
          <div className="relative rounded-[24px] sm:rounded-[36px] border border-white/10 bg-black/35 shadow-[0_30px_90px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />
            <div className="relative overflow-hidden rounded-[22px] sm:rounded-[34px] border border-white/5 bg-[#050a08]">
              <video
                className="w-full h-full object-cover aspect-[16/9] max-h-[80vh]"
                src="/videos/video-2.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
