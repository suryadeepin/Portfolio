// Preloads all 80 hero-video frames
// Naming: ezgif-frame-001.jpg … ezgif-frame-080.jpg

const TOTAL_FRAMES = 80;
const frameSrc = (i) => `/hero-video/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;

export const frames = new Array(TOTAL_FRAMES).fill(null);
let _resolve = null;
let _loaded  = 0;
let _started = false;

export const framesReady = new Promise((res) => { _resolve = res; });

export function startPreload(onProgress) {
  if (_started) return;
  _started = true;
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.onload = () => {
      frames[i] = img;
      _loaded++;
      if (onProgress) onProgress(_loaded / TOTAL_FRAMES);
      if (_loaded === TOTAL_FRAMES) _resolve(frames);
    };
    img.onerror = () => {
      _loaded++;
      if (_loaded === TOTAL_FRAMES) _resolve(frames);
    };
    img.src = frameSrc(i);
  }
}
