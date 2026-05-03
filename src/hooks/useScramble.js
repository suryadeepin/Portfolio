import { useState, useEffect, useRef } from 'react';

const CHARS = '!@#$%&*<>{}[]';

export function useScramble(text, duration = 800) {
  const [displayText, setDisplayText] = useState(text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef(null);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    const startTime = Date.now();
    let iteration = 0;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      setDisplayText(
        text.split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (letter === ' ') return ' ';
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (elapsed >= duration) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
      
      iteration += text.length / (duration / 30); // ~30ms per frame
    }, 30);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { displayText, startScramble };
}
