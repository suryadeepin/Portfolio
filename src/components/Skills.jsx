import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CATS = [
  {
    num: '01', title: 'Languages', accent: '#ef4444',
    skills: [
      { name: 'Java',        icon: '☕', note: 'OOP & Backend'  },
      { name: 'Python',      icon: '🐍', note: 'AI & Scripting' },
      { name: 'JavaScript',  icon: 'JS', note: 'Web & Runtime'  },
      { name: 'C',           icon: 'C',  note: 'Systems'        },
    ],
  },
  {
    num: '02', title: 'Web & Backend', accent: '#f97316',
    skills: [
      { name: 'HTML5 & CSS3', icon: '🌐', note: 'Markup & Style' },
      { name: 'React.js',     icon: '⚛',  note: 'UI Framework'  },
      { name: 'Node.js',      icon: '⬢',  note: 'Runtime'       },
      { name: 'Express.js',   icon: 'Ex', note: 'REST APIs'     },
    ],
  },
  {
    num: '03', title: 'Databases & Tools', accent: '#a855f7',
    skills: [
      { name: 'MongoDB',      icon: '🍃', note: 'NoSQL'          },
      { name: 'MySQL',        icon: '🐬', note: 'Relational'     },
      { name: 'Git & GitHub', icon: '⎇',  note: 'Version Control'},
      { name: 'VS Code',      icon: '◈',  note: 'IDE'            },
    ],
  },
];

/* ─── Single skill chip ─── */
function SkillChip({ skill, accent, onHover, onLeave }) {
  const ref = useRef(null);
  const [hov, setHov] = useState(false);

  const enter = () => { setHov(true);  onHover(ref.current); };
  const leave = () => { setHov(false); onLeave(); };

  return (
    <div
      ref={ref}
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-default overflow-hidden select-none"
      style={{
        background    : hov ? `${accent}15` : 'rgba(255,255,255,0.03)',
        border        : `1px solid ${hov ? accent + '55' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition    : 'all 0.28s ease',
        transform     : hov ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow     : hov ? `0 10px 32px ${accent}22, 0 0 0 1px ${accent}15` : 'none',
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {/* shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 30%, ${accent}10 50%, transparent 70%)`,
          transform : hov ? 'translateX(100%)' : 'translateX(-120%)',
          transition: 'transform 0.55s ease',
        }}
      />
      {/* left bar */}
      <div
        className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
        style={{
          background: accent,
          opacity   : hov ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      <span className="text-base w-6 flex-shrink-0 text-center">{skill.icon}</span>

      <div className="flex flex-col min-w-0">
        <span
          className="font-syne font-bold text-sm leading-tight truncate"
          style={{ color: hov ? '#fff' : 'rgba(255,255,255,0.65)', transition: 'color 0.25s' }}
        >
          {skill.name}
        </span>
        <span
          className="font-space text-[9px] tracking-[0.18em] uppercase"
          style={{ color: hov ? accent : 'rgba(255,255,255,0.22)', transition: 'color 0.25s' }}
        >
          {skill.note}
        </span>
      </div>
    </div>
  );
}

/* ─── Category glass card ─── */
function CatCard({ cat, cardIndex, onHover, onLeave }) {
  const cardRef = useRef(null);

  useEffect(() => {
    // Card slides up
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 44, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        ease    : 'power3.out',
        delay   : cardIndex * 0.12,
        scrollTrigger: { trigger: cardRef.current, start: 'top 87%', once: true },
      }
    );
    // Chips stagger in after card
    const chips = cardRef.current.querySelectorAll('.skill-chip');
    gsap.fromTo(chips,
      { opacity: 0, y: 18, scale: 0.88 },
      {
        opacity: 1, y: 0, scale: 1,
        stagger : 0.07,
        duration: 0.55,
        ease    : 'back.out(1.4)',
        delay   : cardIndex * 0.12 + 0.18,
        scrollTrigger: { trigger: cardRef.current, start: 'top 87%', once: true },
      }
    );
  }, [cardIndex]);

  return (
    <div
      ref={cardRef}
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        opacity             : 0,
        background          : 'rgba(4,0,0,0.45)',
        border              : `1px solid ${cat.accent}22`,
        backdropFilter      : 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow           : `0 0 0 1px ${cat.accent}0a, 0 24px 60px rgba(0,0,0,0.35)`,
      }}
    >
      {/* top glow line */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${cat.accent}60, transparent)` }}
      />

      {/* header */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="font-space font-bold"
          style={{ fontSize: '9px', letterSpacing: '0.38em', color: cat.accent }}
        >
          {cat.num}
        </span>
        <div
          className="h-px flex-1"
          style={{ background: `linear-gradient(90deg, ${cat.accent}55, transparent)` }}
        />
        <span
          className="font-syne font-extrabold uppercase"
          style={{
            fontSize     : 'clamp(13px,1.4vw,17px)',
            letterSpacing: '-0.01em',
            color        : 'rgba(255,255,255,0.85)',
          }}
        >
          {cat.title}
        </span>
      </div>

      {/* chip grid — always 2 cols on mobile, 4 on wide */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {cat.skills.map(skill => (
          <SkillChip
            key={skill.name}
            skill={skill}
            accent={cat.accent}
            onHover={onHover}
            onLeave={onLeave}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main section ─── */
export default function Skills() {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const lineRef    = useRef(null);

  /* dispatch events so HeroAvatar tracks the hovered chip */
  const onHover = useCallback((el) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent('skillHover', {
      detail: {
        nx: (r.left + r.width  / 2) / window.innerWidth,
        ny: (r.top  + r.height / 2) / window.innerHeight,
      },
    }));
  }, []);

  const onLeave = useCallback(() => {
    window.dispatchEvent(new CustomEvent('skillLeave'));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true } }
      );
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: 'power4.out', transformOrigin: 'left',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-20 md:py-28 px-4 md:px-16 min-h-screen"
      style={{
        /* Semi-transparent so the 3D model is dimly visible behind */
        background: 'rgba(2,0,0,0.68)',
      }}
    >
      {/* ── Animated background effects ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>

        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(239,68,68,0.18) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
        }} />

        {/* Orb — vivid red, top-left — uses pulseGlow */}
        <div className="absolute rounded-full" style={{
          width: 380, height: 380, left: '-5%', top: '5%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.28) 0%, transparent 65%)',
          filter: 'blur(40px)',
          animation: 'pulseGlow 8s ease-in-out infinite',
        }} />

        {/* Orb — violet, right */}
        <div className="absolute rounded-full" style={{
          width: 300, height: 300, right: '1%', top: '30%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 65%)',
          filter: 'blur(38px)',
          animation: 'pulseGlow 11s ease-in-out infinite',
          animationDelay: '-3s',
        }} />

        {/* Orb — orange, bottom center — floats */}
        <div className="absolute rounded-full" style={{
          width: 420, height: 220, left: '25%', bottom: '5%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)',
          filter: 'blur(45px)',
          animation: 'orbFloat 18s ease-in-out infinite alternate',
        }} />

        {/* Top-right corner accent glow */}
        <div className="absolute" style={{
          width: 250, height: 250, right: 0, top: 0,
          background: 'radial-gradient(circle at 100% 0%, rgba(239,68,68,0.20) 0%, transparent 65%)',
          filter: 'blur(35px)',
          animation: 'pulseGlow 6s ease-in-out infinite',
          animationDelay: '-2s',
        }} />

        {/* Bottom-left accent glow */}
        <div className="absolute" style={{
          width: 220, height: 220, left: 0, bottom: 0,
          background: 'radial-gradient(circle at 0% 100%, rgba(127,29,29,0.22) 0%, transparent 65%)',
          filter: 'blur(40px)',
          animation: 'pulseGlow 9s ease-in-out infinite',
          animationDelay: '-5s',
        }} />

        {/* Floating code keywords — clearly visible */}
        {['<Java />', 'React()', 'import', '.py', 'const x =', 'npm run', 'git push', 'Node.js', '{ }', '=>', 'MongoDB', 'SQL'].map((word, i) => (
          <span
            key={word}
            className="absolute select-none font-mono"
            style={{
              color: `rgba(239,68,68,${0.10 + (i % 3) * 0.04})`,
              left: `${8 + (i * 8 + i * 3) % 82}%`,
              top:  `${4 + (i * 13 + 5)   % 88}%`,
              fontSize: `${12 + (i % 4) * 3}px`,
              letterSpacing: '0.05em',
              animation: `orbFloat ${11 + i * 1.6}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.9}s`,
              whiteSpace: 'nowrap',
              textShadow: i % 2 === 0 ? '0 0 8px rgba(239,68,68,0.4)' : 'none',
            }}
          >
            {word}
          </span>
        ))}

        {/* Bottom + top vignette to contain effects */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(0deg, rgba(2,0,0,0.7) 0%, transparent 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-20"   style={{ background: 'linear-gradient(180deg, rgba(2,0,0,0.6) 0%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Heading ── */}
        <div ref={headRef} className="mb-14" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="font-space uppercase tracking-[0.42em]"
              style={{ fontSize: '9px', color: 'var(--accent-red)', whiteSpace: 'nowrap' }}
            >
              Technical Arsenal
            </span>
            <div
              ref={lineRef}
              className="flex-1 h-px"
              style={{
                background   : 'linear-gradient(90deg, var(--accent-red), rgba(239,68,68,0.08) 60%, transparent)',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Title — kept compact so it never overflows */}
          <h2
            className="font-syne font-extrabold m-0 leading-[0.88]"
            style={{
              fontSize     : 'clamp(38px, 5.5vw, 78px)',
              letterSpacing: '-0.04em',
            }}
          >
            <span className="text-white">WHAT I </span>
            <span
              style={{
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke   : '1.5px rgba(239,68,68,0.55)',
              }}
            >
              WORK
            </span>
            <br />
            <span style={{ color: 'var(--accent-red)' }}>WITH</span>
          </h2>
        </div>

        {/* ── Category cards ── */}
        <div className="flex flex-col gap-5">
          {CATS.map((cat, i) => (
            <CatCard
              key={cat.num}
              cat={cat}
              cardIndex={i}
              onHover={onHover}
              onLeave={onLeave}
            />
          ))}
        </div>

        {/* ── Stat strip ── */}
        <div
          className="mt-12 flex gap-10 flex-wrap"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24 }}
        >
          {[
            { v: '12+', l: 'Technologies' },
            { v: '6+',  l: 'Years Learning' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col gap-1">
              <span
                className="font-syne font-extrabold"
                style={{ fontSize: 'clamp(22px, 3vw, 34px)', color: 'var(--accent-red)' }}
              >
                {v}
              </span>
              <span
                className="font-space uppercase tracking-[0.25em]"
                style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
