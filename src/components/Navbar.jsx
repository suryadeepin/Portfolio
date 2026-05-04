import { useEffect, useRef, useState, useCallback } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';
import gsap from 'gsap';
import { ScrollTrigger }  from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ── Nav links config ──────────────────────────────────────────────────────────
const LINKS = [
  { label: 'About',   href: '#bio'        },
  { label: 'Skills',  href: '#skills'     },
  { label: 'Journey', href: '#experience' },
  { label: 'Contact', href: '#contact'    },
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
  const [scrolled, setScrolled]     = useState(false);
  const [activeHref, setActiveHref] = useState('');
  const [menuOpen, setMenuOpen]     = useState(false);
  const progressBarRef              = useRef(null);
  const logoRef                     = useMagnetic(0.3);
  const drawerRef                   = useRef(null);

  /* ── Smooth scroll via GSAP ScrollToPlugin ── */
  const smoothScroll = useCallback((href) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    gsap.to(window, {
      scrollTo : { y: target, offsetY: 72 },
      duration : 1.4,
      ease     : 'power3.inOut',
    });
  }, []);

  /* ── Scroll state + active section detection ── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
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
    onScroll();

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

  /* ── Mobile drawer animation ── */
  useEffect(() => {
    if (!drawerRef.current) return;
    if (menuOpen) {
      gsap.fromTo(drawerRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [menuOpen]);

  /* ── Close menu on outside click ── */
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [menuOpen]);

  const navStyle = {
    background     : scrolled ? 'rgba(20,20,22,0.60)' : 'rgba(20,20,22,0.30)',
    backdropFilter : 'blur(48px) saturate(180%)',
    WebkitBackdropFilter: 'blur(48px) saturate(180%)',
    border         : scrolled
      ? '1px solid rgba(255,255,255,0.12)'
      : '1px solid rgba(255,255,255,0.05)',
    boxShadow      : scrolled
      ? '0 16px 40px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)'
      : '0 8px 24px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
    transition     : 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
  };

  return (
    <>
      <nav
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 h-[56px] rounded-2xl overflow-visible"
        style={navStyle}
      >
        {/* Top inner highlight line */}
        <div
          className="absolute top-0 left-8 right-8 h-[1px] rounded-t-2xl"
          style={{
            background  : 'linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)',
            opacity     : scrolled ? 1 : 0.5,
            transition  : 'opacity 0.4s ease',
          }}
        />

        <div className="h-full w-full px-5 md:px-8 flex items-center justify-between">
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

          {/* Desktop CTA */}
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
          <button
            className="md:hidden text-white p-1.5 rounded-lg transition-colors duration-200"
            style={{ background: menuOpen ? 'rgba(239,68,68,0.14)' : 'transparent', border: '1px solid rgba(239,68,68,0.2)' }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Scroll progress bar */}
        <div className="absolute bottom-[1px] left-6 right-6 h-[1.5px] overflow-hidden rounded-full">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0"
            style={{ background: 'linear-gradient(90deg, var(--accent-blood), var(--accent-red))', boxShadow: '0 0 8px var(--accent-red)' }}
          />
        </div>
      </nav>

      {/* Mobile dropdown drawer */}
      {menuOpen && (
        <div
          ref={drawerRef}
          className="fixed top-[72px] left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-[49] rounded-2xl overflow-hidden"
          style={{
            background   : 'rgba(6,0,0,0.95)',
            border       : '1px solid rgba(239,68,68,0.22)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            boxShadow    : '0 16px 50px rgba(0,0,0,0.7)',
          }}
        >
          <div className="flex flex-col py-3">
            {LINKS.map(({ label, href }, i) => (
              <a
                key={href}
                href={href}
                onClick={smoothScroll(href)}
                className="flex items-center justify-between px-6 py-4 font-space text-[12px] tracking-[0.2em] uppercase transition-colors duration-200"
                style={{
                  color         : activeHref === href ? 'var(--accent-red)' : 'rgba(255,255,255,0.7)',
                  borderBottom  : i < LINKS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                {label}
                {activeHref === href && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-red)', boxShadow: '0 0 8px var(--accent-red)' }} />
                )}
              </a>
            ))}
            <div className="px-6 pt-3 pb-4">
              <a
                href="#contact"
                onClick={smoothScroll('#contact')}
                className="block text-center py-3 rounded-xl font-space text-[12px] tracking-widest uppercase text-white"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)' }}
              >
                Hire Me ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
