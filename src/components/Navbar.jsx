import { useEffect, useRef, useState, useCallback } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';
import gsap from 'gsap';
import { ScrollTrigger }  from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ── Nav links config ──────────────────────────────────────────────────────────
const LINKS = [
  { label: 'About',   href: '#bio'     },
  { label: 'Skills',  href: '#skills'  },
  { label: 'Journey', href: '#experience' },  // Experience section – we'll ensure the id exists
  { label: 'Contact', href: '#contact' },
];

// ── NavLink ───────────────────────────────────────────────────────────────────
function NavLink({ href, label, active, onClick }) {
  const ref = useMagnetic(0.2);
  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      className={`
        relative font-space text-[12px] tracking-[0.12em] uppercase
        transition-colors duration-300 cursor-target group px-2 py-1
        ${active ? 'text-[var(--accent-red)]' : 'text-gray-400 hover:text-white'}
      `}
    >
      {label}
      {/* Underline */}
      <span
        className={`
          absolute -bottom-0.5 left-0 h-[1.5px] rounded-full
          bg-[var(--accent-red)] shadow-[0_0_8px_var(--accent-red)]
          transition-all duration-300
          ${active ? 'w-full' : 'w-0 group-hover:w-full'}
        `}
      />
    </a>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [activeHref, setActiveHref]     = useState('');
  const progressBarRef                  = useRef(null);
  const logoRef                         = useMagnetic(0.3);

  /* ── Smooth scroll via GSAP ScrollToPlugin ── */
  const smoothScroll = useCallback((href) => (e) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    gsap.to(window, {
      scrollTo : { y: target, offsetY: 72 }, // 72px = navbar height + gap
      duration : 1.4,
      ease     : 'power3.inOut',
    });
  }, []);

  /* ── Scroll state + active section detection ── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      // Highlight whichever section is currently in view
      for (const { href } of [...LINKS].reverse()) {
        const el = document.querySelector(href);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveHref(href);
          return;
        }
      }
      setActiveHref('');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount

    /* ── Scroll progress bar ── */
    gsap.to(progressBarRef.current, {
      scaleX       : 1,
      ease         : 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start  : 'top top',
        end    : 'bottom bottom',
        scrub  : true,
      },
    });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Glass intensity: subtle at top, stronger on scroll ── */
  const navStyle = {
    background     : scrolled ? 'rgba(6,0,0,0.78)' : 'rgba(6,0,0,0.45)',
    backdropFilter : 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    border         : scrolled
      ? '1px solid rgba(239,68,68,0.22)'
      : '1px solid rgba(239,68,68,0.10)',
    boxShadow      : scrolled
      ? '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(239,68,68,0.14)'
      : '0 4px 20px rgba(0,0,0,0.25)',
    transition     : 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
  };

  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 h-[60px] rounded-2xl overflow-hidden"
      style={navStyle}
    >
      {/* Top inner highlight line */}
      <div
        className="absolute top-0 left-8 right-8 h-[1px]"
        style={{
          background    : 'linear-gradient(90deg, transparent, rgba(239,68,68,0.3), transparent)',
          opacity       : scrolled ? 1 : 0.5,
          transition    : 'opacity 0.4s ease',
        }}
      />

      <div className="h-full w-full px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          ref={logoRef}
          onClick={smoothScroll('#hero')}
          className="font-syne font-extrabold text-2xl flex cursor-target group"
        >
          <span className="text-white  group-hover:-rotate-12 transition-transform duration-300">S</span>
          <span className="text-[var(--accent-red)] group-hover:rotate-12 transition-transform duration-300">B</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(({ label, href }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              active={activeHref === href}
              onClick={smoothScroll(href)}
            />
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#contact"
          onClick={smoothScroll('#contact')}
          className="hidden md:flex items-center gap-2 px-5 py-2 rounded-xl text-[12px] font-space tracking-widest uppercase text-white transition-all duration-300 hover:-translate-y-0.5 cursor-target"
          style={{
            background : 'rgba(239,68,68,0.12)',
            border     : '1px solid rgba(239,68,68,0.28)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(239,68,68,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          Hire Me
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white cursor-target">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute -bottom-[1px] left-0 w-full h-[2px] overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left scale-x-0"
          style={{ background: 'linear-gradient(90deg, var(--accent-blood), var(--accent-red))', boxShadow: '0 0 8px var(--accent-red)' }}
        />
      </div>
    </nav>
  );
}
