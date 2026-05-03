import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ENTRIES = [
  {
    year: '2025 – Present',
    role: 'B.Tech in Computer Science',
    place: 'IILM University, Greater Noida',
    desc: 'Currently pursuing Bachelor of Technology, focusing on software engineering, data structures, algorithms, and modern development practices.',
    side: 'left',
    accent: 'var(--accent-red)',
  },
  {
    year: '2023 – 2025',
    role: 'Senior Secondary Education',
    place: 'KPS School, CBSE Board',
    desc: 'Completed higher secondary education with focus on Science stream, developing strong analytical and problem-solving skills.',
    side: 'right',
    accent: 'rgba(239,68,68,0.65)',
  },
  {
    year: '2013 – 2023',
    role: 'Secondary Education',
    place: 'Auxilium School, ICSE Board',
    desc: 'Completed foundational education with comprehensive curriculum, building essential academic skills and knowledge base.',
    side: 'left',
    accent: 'rgba(185,28,28,0.8)',
  },
];

function TimelineEntry({ entry }) {
  const cardRef = useRef(null);
  const dotRef  = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const dir = entry.side === 'left' ? -70 : 70;

    // Card: x-slide + clip-path wipe reveal
    gsap.fromTo(cardRef.current,
      {
        x       : dir,
        opacity : 0,
        clipPath: 'inset(0 0 100% 0)',
      },
      {
        x       : 0,
        opacity : 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.0,
        ease    : 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 80%', once: true },
      }
    );

    // Inner text elements stagger in slightly after card
    if (innerRef.current) {
      gsap.fromTo(innerRef.current.children,
        { opacity: 0, y: 14 },
        {
          opacity : 1,
          y       : 0,
          stagger : 0.08,
          duration: 0.6,
          ease    : 'power2.out',
          delay   : 0.2,
          scrollTrigger: { trigger: cardRef.current, start: 'top 80%', once: true },
        }
      );
    }

    // Dot: spring pop
    gsap.fromTo(dotRef.current,
      { scale: 0, opacity: 0 },
      {
        scale   : 1,
        opacity : 1,
        duration: 0.7,
        ease    : 'back.out(3)',
        delay   : 0.15,
        scrollTrigger: { trigger: dotRef.current, start: 'top 80%', once: true },
      }
    );

    return () => ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === cardRef.current || st.trigger === dotRef.current) st.kill();
    });
  }, [entry.side]);

  return (
    <div className={`relative flex items-center w-full mb-16 ${entry.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Card */}
      <div className={`w-full md:w-[45%] ${entry.side === 'left' ? 'md:pr-12' : 'md:pl-12'}`}>
        <div
          ref={cardRef}
          className="rounded-2xl p-6 px-8 relative overflow-hidden"
          style={{
            background: 'rgba(8,0,0,0.5)',
            border: `1px solid ${entry.accent}33`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: `0 6px 30px rgba(0,0,0,0.4), inset 0 1px 0 ${entry.accent}22`,
          }}
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${entry.accent}, transparent)` }} />
          {/* Left accent */}
          <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full" style={{ background: `linear-gradient(180deg, transparent, ${entry.accent}, transparent)` }} />

          {/* Staggered inner text */}
          <div ref={innerRef}>
            <span className="font-space text-xs tracking-[0.2em] uppercase block" style={{ color: entry.accent }}>{entry.year}</span>
            <h3 className="font-syne font-bold text-[22px] text-white mt-1">{entry.role}</h3>
            <p className="text-sm mt-1" style={{ color: entry.accent }}>{entry.place}</p>
            <p className="text-[15px] text-[#5a5a70] mt-3 leading-relaxed">{entry.desc}</p>
          </div>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
        <div ref={dotRef} className="w-3 h-3 rounded-full z-10" style={{ background: entry.accent, boxShadow: `0 0 16px ${entry.accent}, 0 0 32px ${entry.accent}66` }} />
        <div className="absolute w-6 h-6 rounded-full border animate-ping opacity-30" style={{ borderColor: entry.accent }} />
      </div>

      <div className="hidden md:block w-[45%]" />
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const lineRef    = useRef(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current.querySelectorAll('.word'),
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', stagger: 0.12, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' } }
    );
    gsap.fromTo(lineRef.current,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'bottom 80%', scrub: true } }
    );
    return () => ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === titleRef.current || st.trigger === sectionRef.current) st.kill();
    });
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative py-28 px-6 md:px-16 min-h-screen overflow-hidden" style={{ background: 'rgba(3,0,0,0.82)' }}>

      {/* ── Animated background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Dot grid — tighter near centre */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(239,68,68,0.16) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 0%, transparent 100%)',
        }} />

        {/* Large central ambient glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(127,29,29,0.18) 0%, transparent 65%)',
          filter: 'blur(70px)',
          animation: 'pulseGlow 9s ease-in-out infinite',
        }} />

        {/* Top-left red orb */}
        <div className="absolute rounded-full" style={{
          width: 320, height: 320, left: '-4%', top: '8%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.22) 0%, transparent 65%)',
          filter: 'blur(42px)',
          animation: 'pulseGlow 7s ease-in-out infinite',
          animationDelay: '-2s',
        }} />

        {/* Bottom-right violet orb */}
        <div className="absolute rounded-full" style={{
          width: 340, height: 340, right: '-3%', bottom: '10%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)',
          filter: 'blur(44px)',
          animation: 'pulseGlow 11s ease-in-out infinite',
          animationDelay: '-5s',
        }} />

        {/* Top-right warm accent */}
        <div className="absolute rounded-full" style={{
          width: 260, height: 260, right: '8%', top: '5%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 65%)',
          filter: 'blur(36px)',
          animation: 'pulseGlow 13s ease-in-out infinite',
          animationDelay: '-8s',
        }} />

        {/* Diagonal beam — left */}
        <div className="absolute" style={{
          width: '1px', height: '60%',
          left: '22%', top: '10%',
          background: 'linear-gradient(180deg, transparent, rgba(239,68,68,0.12), transparent)',
          transform: 'rotate(-15deg)',
          animation: 'pulseGlow 6s ease-in-out infinite',
          animationDelay: '-1s',
        }} />
        {/* Diagonal beam — right */}
        <div className="absolute" style={{
          width: '1px', height: '50%',
          right: '25%', top: '20%',
          background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.10), transparent)',
          transform: 'rotate(12deg)',
          animation: 'pulseGlow 8s ease-in-out infinite',
          animationDelay: '-4s',
        }} />

        {/* Floating year stamps */}
        {['2025', '2023', '2024', '∞', '01', '10'].map((y, i) => (
          <span key={y + i} className="absolute font-space select-none" style={{
            color: `rgba(239,68,68,${0.06 + (i % 3) * 0.03})`,
            fontSize: `${28 + (i % 3) * 18}px`,
            fontWeight: 700,
            left: `${6 + (i * 16 + 4) % 78}%`,
            top: `${8 + (i * 19 + 6) % 80}%`,
            letterSpacing: '0.08em',
            animation: `orbFloat ${14 + i * 2.5}s ease-in-out infinite alternate`,
            animationDelay: `${i * 1.4}s`,
          }}>{y}</span>
        ))}

        {/* Horizontal shimmer lines */}
        <div className="absolute left-0 right-0 h-[1px]" style={{
          top: '33%',
          background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.08) 40%, rgba(239,68,68,0.08) 60%, transparent)',
          animation: 'pulseGlow 10s ease-in-out infinite',
          animationDelay: '-3s',
        }} />
        <div className="absolute left-0 right-0 h-[1px]" style={{
          top: '66%',
          background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.07) 40%, rgba(168,85,247,0.07) 60%, transparent)',
          animation: 'pulseGlow 12s ease-in-out infinite',
          animationDelay: '-7s',
        }} />

        {/* Edge vignettes */}
        <div className="absolute inset-x-0 top-0 h-28" style={{ background: 'linear-gradient(180deg, rgba(3,0,0,0.9) 0%, transparent 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: 'linear-gradient(0deg, rgba(3,0,0,0.9) 0%, transparent 100%)' }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Glass title */}
        <div className="flex justify-center mb-20">
          <div className="inline-block px-8 py-4 rounded-2xl"
            style={{ background: 'rgba(8,0,0,0.55)', border: '1px solid rgba(239,68,68,0.2)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            <h2 ref={titleRef} className="font-syne font-extrabold text-[clamp(28px,4vw,48px)] text-white flex gap-4 flex-wrap justify-center">
              {'MY JOURNEY'.split(' ').map((w, i) => (
                <span key={i} className="word inline-block">{w}</span>
              ))}
            </h2>
          </div>
        </div>

        <div className="relative">
          {/* Center animated line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px]" style={{ background: 'rgba(108,99,255,0.12)' }}>
            <div ref={lineRef} className="w-full h-full origin-top" style={{ background: 'linear-gradient(180deg, var(--accent-blood), var(--accent-red), rgba(239,68,68,0.4))' }} />
          </div>

          {ENTRIES.map((e, i) => <TimelineEntry key={i} entry={e} />)}
        </div>
      </div>
    </section>

  );
}
