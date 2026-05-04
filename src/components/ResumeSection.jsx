import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ResumeSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo(linksRef.current?.children ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const links = [
    {
      label: 'View Résumé',
      sub: 'Download PDF',
      href: '/Resume.pdf',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      color: 'rgba(239,68,68,0.14)',
      border: 'rgba(239,68,68,0.4)',
      accent: 'var(--accent-red)',
      download: true,
    },
    {
      label: 'LinkedIn',
      sub: 'Let\'s connect',
      href: 'https://www.linkedin.com/in/suryadeep-banerjee',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      color: 'rgba(0,119,181,0.18)',
      border: 'rgba(0,119,181,0.5)',
      accent: '#0077b5',
    },
    {
      label: 'GitHub',
      sub: 'See my code',
      href: 'https://github.com/suryadeepin',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      color: 'rgba(127,29,29,0.15)',
      border: 'rgba(185,28,28,0.4)',
      accent: 'var(--accent-crimson)',
    },
  ];

  return (
    <section
      id="resume"
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* ── Animated background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
      }}>

        {/* Dot grid fading to edges */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(239,68,68,0.09) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
          opacity: 0.6,
        }} />

        {/* Concentric ring 1 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ width: 320, height: 320, borderColor: 'rgba(239,68,68,0.12)',
            animation: 'pulseGlow 8s ease-in-out infinite' }}
        />
        {/* Concentric ring 2 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ width: 520, height: 520, borderColor: 'rgba(239,68,68,0.08)',
            animation: 'pulseGlow 12s ease-in-out infinite', animationDelay: '-4s' }}
        />
        {/* Concentric ring 3 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ width: 720, height: 720, borderColor: 'rgba(239,68,68,0.05)',
            animation: 'pulseGlow 16s ease-in-out infinite', animationDelay: '-8s' }}
        />

        {/* Central glow — vivid */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(185,28,28,0.25) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'pulseGlow 7s ease-in-out infinite',
          }}
        />

        {/* Side orb — left (red) */}
        <div className="absolute rounded-full" style={{
          width: 260, height: 260, left: '4%', top: '18%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.20) 0%, transparent 65%)',
          filter: 'blur(38px)',
          animation: 'pulseGlow 10s ease-in-out infinite',
          animationDelay: '-5s',
        }} />

        {/* Side orb — right (violet) */}
        <div className="absolute rounded-full" style={{
          width: 280, height: 280, right: '4%', bottom: '18%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)',
          filter: 'blur(42px)',
          animation: 'pulseGlow 13s ease-in-out infinite',
          animationDelay: '-2s',
        }} />

        {/* Floating keyword particles */}
        {['connect', 'collaborate', 'build', 'design', 'deploy', 'learn', 'create', 'code'].map((w, i) => (
          <span key={w} className="absolute font-space uppercase select-none" style={{
            color: 'rgba(239,68,68,0.045)',
            fontSize: `${9 + (i % 3) * 3}px`,
            letterSpacing: '0.3em',
            left: `${5 + (i * 12 + 7) % 80}%`,
            top:  `${8 + (i * 14 + 3) % 82}%`,
            animation: `orbFloat ${12 + i * 2}s ease-in-out infinite alternate`,
            animationDelay: `${i * 1.1}s`,
          }}>{w}</span>
        ))}
      </div>

      {/* Header */}
      <div ref={cardRef} className="relative z-10 text-center mb-16 opacity-0">
        <p className="font-space text-[11px] tracking-[0.5em] uppercase mb-4" style={{ color: 'var(--accent-red)' }}>
          Connect With Me
        </p>
        <h2 className="font-syne font-extrabold text-white tracking-tighter leading-none mb-4"
          style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
          Let's Build Together
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto" style={{ fontSize: 'clamp(14px, 1.2vw, 16px)' }}>
          Open to internships, collaborations and exciting projects.
          Download my résumé or reach out on LinkedIn.
        </p>
      </div>

      {/* Link cards */}
      <div ref={linksRef} className="relative z-10 flex flex-wrap gap-5 justify-center px-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            {...(link.download ? { download: true } : {})}
            className="group flex items-center gap-4 px-6 md:px-8 py-5 transition-all duration-300 hover:-translate-y-1 w-full md:w-auto"
            style={{
              background: link.color,
              border: `1px solid ${link.border}`,
              borderRadius: '18px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              minWidth: 0,
            }}
          >
            <div
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.06)', color: link.accent }}
            >
              {link.icon}
            </div>
            <div>
              <p className="font-syne font-bold text-white text-[15px] group-hover:opacity-90 transition-opacity">
                {link.label}
              </p>
              <p className="font-space text-[10px] tracking-widest uppercase" style={{ color: 'var(--muted-color)' }}>
                {link.sub}
              </p>
            </div>
            <div className="ml-auto opacity-40 group-hover:opacity-80 transition-opacity text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Email */}
      <div className="relative z-10 mt-12 text-center">
        <p className="font-space text-[11px] tracking-[0.3em] uppercase" style={{ color: 'var(--muted-color)' }}>or email me at</p>
        <a
          href="mailto:suryadeep@example.com"
          className="font-syne font-bold text-white hover:text-[var(--accent-red)] transition-colors duration-300 mt-2 inline-block"
          style={{ fontSize: 'clamp(16px, 2vw, 22px)' }}
        >
          suryadeepbanerjee@gmail.com
        </a>
      </div>
    </section>
  );
}
