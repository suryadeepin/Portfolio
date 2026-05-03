import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

function SocialButton({ href, label, children }) {
  const ref = useMagnetic(0.3);
  const [hov, setHov] = useState(false);
  return (
    <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="cursor-target w-[50px] h-[50px] rounded-full flex items-center justify-center text-white transition-all duration-300"
      style={{
        background: hov ? 'rgba(239,68,68,0.18)' : 'rgba(10,0,0,0.55)',
        border: `1px solid ${hov ? 'rgba(239,68,68,0.7)' : 'rgba(239,68,68,0.25)'}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: hov ? '0 0 22px rgba(239,68,68,0.35)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span className="transition-transform duration-500" style={{ transform: hov ? 'scale(1.25) rotate(360deg)' : 'scale(1)' }}>
        {children}
      </span>
    </a>
  );
}

function WobblyEmail() {
  const ref    = useRef(null);
  const magRef = useMagnetic(0.15);
  const [hov, setHov] = useState(false);
  const email = 'official@suryadeepbanerjee.in';

  const onEnter = () => {
    setHov(true);
    gsap.to(ref.current.querySelectorAll('.ec'), {
      y: -8, yoyo: true, repeat: 1, stagger: 0.015, duration: 0.16, ease: 'power2.out',
    });
  };

  return (
    <a ref={magRef} href={`mailto:${email}`} className="cursor-target relative inline-block"
      onMouseEnter={onEnter} onMouseLeave={() => setHov(false)}>
      <span ref={ref} className="font-syne font-semibold text-[clamp(13px,1.8vw,22px)] transition-colors duration-300"
        style={{ color: hov ? 'var(--accent-red)' : '#ffffff' }}>
        {email.split('').map((c, i) => <span key={i} className="ec inline-block">{c}</span>)}
      </span>
      <span className="absolute bottom-0 left-0 h-[1px] transition-all duration-500"
        style={{ width: hov ? '100%' : '0%', background: 'var(--accent-red)' }} />
    </a>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(contentRef.current.querySelectorAll('.ai'),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.09, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true } }
    );
  }, []);

  return (
    /* TRANSPARENT so 3D model shows through from behind */
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Giant faint watermark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <span className="font-syne font-extrabold leading-none text-white" style={{ fontSize: '18vw', opacity: 0.018 }}>LET&apos;S</span>
        <span className="font-syne font-extrabold leading-none text-white" style={{ fontSize: '18vw', opacity: 0.018 }}>TALK</span>
      </div>

      {/* Glass card */}
      <div ref={contentRef} className="relative z-10 text-center px-10 py-12 mx-6 max-w-2xl w-full rounded-3xl"
        style={{
          background: 'rgba(8,0,0,0.55)',
          border: '1px solid rgba(239,68,68,0.18)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: '0 16px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(239,68,68,0.15)',
        }}>

        {/* Top glow line */}
        <div className="absolute top-0 left-12 right-12 h-[1px] rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent-red) 40%, rgba(239,68,68,0.4) 60%, transparent)' }} />

        <h2 className="ai font-syne font-extrabold text-[clamp(32px,4.5vw,58px)] text-white leading-tight m-0">
          Got an idea?
        </h2>
        <h3 className="ai font-syne font-bold text-[clamp(24px,3.5vw,46px)] leading-tight mt-1 m-0"
          style={{ color: 'var(--accent-red)' }}>
          Let&apos;s build it together.
        </h3>
        <p className="ai text-base text-[#7a6060] mt-5 max-w-md mx-auto">
          I&apos;m always open to new projects, collaborations and opportunities.
        </p>

        <div className="ai mt-7"><WobblyEmail /></div>

        <div className="ai mx-auto my-7 h-[1px] w-[50px]"
          style={{ background: 'linear-gradient(90deg, var(--accent-blood), var(--accent-red))' }} />

        <div className="ai flex justify-center gap-4">
          <SocialButton href="https://github.com/suryadeepin" label="GitHub">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </SocialButton>
          <SocialButton href="https://www.linkedin.com/in/suryadeep-banerjee" label="LinkedIn">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </SocialButton>
          <SocialButton href="https://x.com/suryadeepin" label="Twitter">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </SocialButton>
          <SocialButton href="https://www.instagram.com/suryadeepin" label="Instagram">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.669-.072-4.948-.2-4.358-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </SocialButton>
        </div>

        <p className="ai mt-8 font-space text-[10px] text-[#5a3a3a] tracking-widest uppercase">
          © 2025 Suryadeep Banerjee · All rights reserved
        </p>
      </div>
    </section>
  );
}
