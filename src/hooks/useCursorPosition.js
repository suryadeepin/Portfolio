import { useEffect, useRef } from 'react';

export function useCursorPosition() {
  const position = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const updatePosition = (e) => {
      position.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', updatePosition);

    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return position;
}
