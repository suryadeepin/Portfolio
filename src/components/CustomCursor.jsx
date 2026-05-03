import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCursorPosition } from '../hooks/useCursorPosition';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const position = useCursorPosition();
  
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Dot follows exactly
    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });

    // Ring follows with lerp
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.5, ease: "power3" });

    const animate = () => {
      dotX(position.current.x);
      dotY(position.current.y);
      ringX(position.current.x);
      ringY(position.current.y);
      requestAnimationFrame(animate);
    };
    
    let req = requestAnimationFrame(animate);

    const targets = document.querySelectorAll('a, button, .cursor-target');
    const onEnter = () => {
      gsap.to(dotRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      gsap.to(ringRef.current, { scale: 1.6, backgroundColor: 'rgba(108,99,255,0.2)', duration: 0.3 });
    };
    const onLeave = () => {
      gsap.to(dotRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(ringRef.current, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
    };

    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      cancelAnimationFrame(req);
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [position]);

  return (
    <div className="hidden md:block pointer-events-none z-[9999] fixed top-0 left-0 mix-blend-screen">
      <div 
        ref={ringRef}
        className="absolute w-[38px] h-[38px] border border-[rgba(108,99,255,0.5)] rounded-full -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={dotRef}
        className="absolute w-[8px] h-[8px] bg-[#6c63ff] rounded-full -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
