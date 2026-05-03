import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '6+', label: 'Years of Coding' },
  { value: '15+', label: 'Projects Built' },
  { value: 'B.Tech', label: 'IILM University' },
];

export default function Bio() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate right-side bio text in as user scrolls into the section
      gsap.fromTo('.bio-item',
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="bio"
      ref={sectionRef}
      className="relative w-full"
      style={{ minHeight: '100vh' }}
    >
      <div
        className="sticky top-0 h-screen w-full flex items-center"
        style={{ pointerEvents: 'none' }}
      >
        {/* Left — model zone (model is pushed hard left by camera x=6) */}
        <div className="w-[58%]" />

        {/* Right — bio text, starts at 58% from left */}
        <div
          className="w-[42%] flex flex-col gap-6 pr-12 pointer-events-auto"
          style={{ zIndex: 15 }}
        >
          {/* Section tag */}
          <div className="bio-item flex items-center gap-3" style={{ opacity: 0 }}>
            <span style={{
              width: 28, height: 1,
              background: 'var(--accent-red)',
              display: 'block',
            }} />
            <span className="font-space text-[var(--accent-red)] uppercase tracking-[0.35em]"
              style={{ fontSize: '11px' }}>
              About Me
            </span>
          </div>

          {/* Headline */}
          <div className="bio-item" style={{ opacity: 0 }}>
            <h2 className="font-syne font-extrabold text-white leading-tight m-0"
              style={{ fontSize: 'clamp(28px, 3.5vw, 52px)' }}>
              Building things<br />
              <span style={{ color: 'var(--accent-red)' }}>that matter.</span>
            </h2>
          </div>

          {/* Description */}
          <p className="bio-item text-gray-400 leading-relaxed m-0"
            style={{ fontSize: 'clamp(13px, 1.1vw, 16px)', maxWidth: '420px', opacity: 0 }}>
            B.Tech student at IILM University focused on building intelligent systems
            at the intersection of{' '}
            <span style={{ color: 'rgba(239,68,68,0.85)', fontWeight: 600 }}>AI</span>
            {' '}and scalable engineering. I obsess over clean code and beautiful interfaces.
          </p>

          {/* Stats row */}
          <div className="bio-item flex gap-8" style={{ opacity: 0 }}>
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-syne font-extrabold text-white"
                  style={{ fontSize: 'clamp(22px, 2.5vw, 36px)', color: 'var(--accent-red)' }}>
                  {value}
                </span>
                <span className="font-space text-gray-500 uppercase tracking-[0.18em]"
                  style={{ fontSize: '9px' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="bio-item" style={{ opacity: 0 }}>
            <div style={{
              width: 60, height: 2,
              background: 'linear-gradient(90deg, var(--accent-red), transparent)',
            }} />
          </div>

          {/* Skill tags */}
          <div className="bio-item flex flex-wrap gap-2" style={{ opacity: 0 }}>
            {['React', 'Three.js', 'Python', 'Node.js', 'AI / ML', 'Java'].map(tag => (
              <span key={tag}
                className="font-space uppercase tracking-widest"
                style={{
                  fontSize: '9px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: '1px solid rgba(239,68,68,0.25)',
                  background: 'rgba(239,68,68,0.06)',
                  color: 'rgba(239,68,68,0.8)',
                  backdropFilter: 'blur(8px)',
                }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
