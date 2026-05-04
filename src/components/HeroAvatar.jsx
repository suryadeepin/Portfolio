import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader, DRACOLoader, RGBELoader } from 'three-stdlib';
import { decryptFile } from '../utils/decrypt';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroAvatar({ isReady }) {
  const mountRef     = useRef(null);
  const containerRef = useRef(null);
  const rendererRef  = useRef(null);
  const cameraRef    = useRef(null);
  const sceneRef     = useRef(null);
  const mixerRef     = useRef(null);
  const clockRef     = useRef(new THREE.Clock());
  const headRef       = useRef(null);
  const mouseRef       = useRef({ x: 0, y: 0 });
  const rafRef         = useRef(null);
  const zoneRef        = useRef('hero');
  const headTargetRef  = useRef({ y: 0, x: 0 });
  const skillTargetRef = useRef(null); // set by skillHover events
  const ownTriggersRef = useRef([]); // only kill our own ScrollTriggers on cleanup
  const overlayRef     = useRef(null); // black overlay — fades in to hide model
  const loadedDataRef  = useRef(null); // holds char, cam, etc. for scroll triggers

  const tickHead = useCallback(() => {
    const head = headRef.current;
    if (!head) return;
    const { x: mx, y: my } = mouseRef.current;
    const lerp = THREE.MathUtils.lerp;
    const zone = zoneRef.current;
    const t = headTargetRef.current;

    const MAX_Y = Math.PI / 2.2;  // ±80° horizontal — large, obvious range
    const MAX_X = 0.48;            // ±28° vertical tilt

    if (zone === 'hero') {
      t.y = lerp(t.y,  mx * MAX_Y, 0.18);
      t.x = lerp(t.x, -my * MAX_X, 0.15);
    } else if (zone === 'bio') {
      t.y = lerp(t.y, 0.55 + mx * 0.25, 0.10);
      t.x = lerp(t.x, 0,                 0.08);
    } else if (zone === 'post') {
      // Model is on the RIGHT, looking LEFT (body is rotated left ~ -0.6)
      // Track mouse relative to that left-looking stance
      t.y = lerp(t.y, -0.6 + mx * 0.4, 0.10);
      t.x = lerp(t.x, -my * 0.2, 0.08);
    } else {
      // 'scrub'
      t.y = lerp(t.y, 0, 0.06);
      t.x = lerp(t.x, 0, 0.06);
    }

    // Apply to bone — single fast lerp so response feels snappy
    head.rotation.y = lerp(head.rotation.y, t.y, 0.20); // was 0.13
    head.rotation.x = lerp(head.rotation.x, t.x, 0.17); // was 0.11

    // Camera micro-sway (hero only)
    const cam = cameraRef.current;
    if (cam && zone === 'hero') {
      cam.position.x = lerp(cam.position.x, -2.65 + mx * 0.55, 0.06); // was 0.25/0.04
      cam.position.y = lerp(cam.position.y,  13.1  + my * 0.35, 0.06); // was 0.18/0.04
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── Renderer: pixel ratio capped at 1 for performance ──
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2, // skip antialias on retina (uses resolution instead)
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0)); // MAX 1x — biggest perf win
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera to the LEFT of world centre → model appears RIGHT of screen centre
    // (negative cam.x = camera is left = model shifts right in frame)
    const cam = new THREE.PerspectiveCamera(14.5, container.clientWidth / container.clientHeight, 0.1, 1000);
    cam.position.set(-2.65, 13.1, 24.7);
    cam.zoom = 1.1;
    cam.updateProjectionMatrix();
    cameraRef.current = cam;

    const dirLight = new THREE.DirectionalLight(0xff6666, 0.2);
    dirLight.position.set(-0.47, -0.32, -1);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xff2222, 0.3, 40);
    rimLight.position.set(3, 12, 4);
    scene.add(rimLight);

    // Ambient baseline — model is never completely invisible
    const ambientLight = new THREE.AmbientLight(0x110000, 0.6);
    scene.add(ambientLight);

    new RGBELoader().load('/models/char_enviorment.hdr', (tex) => {
      tex.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = tex;
      scene.environmentIntensity = 0.15; // small baseline so reflections start immediately
    });

    const load = async () => {
      try {
        const buf = await decryptFile('/avatar.enc', 'MyCharacter12');
        const url = URL.createObjectURL(new Blob([buf]));
        const loader = new GLTFLoader();
        const draco  = new DRACOLoader();
        draco.setDecoderPath('/draco/');
        loader.setDRACOLoader(draco);

        loader.load(url, async (gltf) => {
          const char = gltf.scene;
          await renderer.compileAsync(char, cam, scene);
          scene.add(char);
          draco.dispose();
          URL.revokeObjectURL(url);

          headRef.current = char.getObjectByName('spine006') ||
                            char.getObjectByName('spine005') || null;

          let monitor, screenLight;
          char.children.forEach((obj) => {
            if (obj.name === 'Plane004') {
              obj.children.forEach(child => {
                child.material.transparent = true;
                child.material.opacity = 0;
                if (child.material.name === 'Material.018') {
                  monitor = child;
                  child.material.color.set('#FFFFFF');
                }
              });
            }
            if (obj.name === 'screenlight') {
              obj.material.transparent = true;
              obj.material.opacity = 0;
              obj.material.emissive.set('#ff4444');
              screenLight = obj;
            }
          });
          if (monitor) monitor.position.set(0, -10, 2);

          if (gltf.animations?.length) {
            const mixer = new THREE.AnimationMixer(char);
            mixerRef.current = mixer;
            ['key1','key2','key5','key6'].forEach(n => {
              const c = THREE.AnimationClip.findByName(gltf.animations, n);
              if (c) { const a = mixer.clipAction(c); a.play(); a.timeScale = 1.2; }
            });
            const typing = THREE.AnimationClip.findByName(gltf.animations, 'typing');
            if (typing) mixer.clipAction(typing).play();
            const intro = gltf.animations.find(c => c.name === 'introAnimation');
            if (intro) {
              const act = mixer.clipAction(intro);
              act.setLoop(THREE.LoopOnce, 1);
              act.clampWhenFinished = true;
              act.reset().play();
            }
            const blink = gltf.animations.find(c => c.name === 'Blink');
            if (blink) setTimeout(() => mixer.clipAction(blink).play().fadeIn(0.5), 2500);
          }

          // Animate lights to full immediately — no delay so model is bright as soon as it appears
          gsap.to(scene,    { environmentIntensity: 0.65, duration: 1.8, ease: 'power2.inOut' });
          gsap.to(dirLight, { intensity: 0.85,            duration: 1.8, ease: 'power2.inOut' });
          gsap.to(rimLight, { intensity: 1.6,             duration: 1.8, ease: 'power2.inOut' });
          gsap.to(ambientLight, { intensity: 0.1,         duration: 1.8, ease: 'power2.inOut' });

          // Save variables for the ScrollTriggers
          loadedDataRef.current = { char, cam, monitor, screenLight };

          if (window.__loaderModelReady) window.__loaderModelReady();

        });
      } catch (e) { console.error('Avatar load failed:', e); }
    };
    load();

    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouse);

    // ── Skill hover interactivity ──
    const onSkillHover = (e) => { skillTargetRef.current = e.detail; };
    const onSkillLeave = ()  => { skillTargetRef.current = null; };
    window.addEventListener('skillHover', onSkillHover);
    window.addEventListener('skillLeave', onSkillLeave);

    const onResize = () => {
      cam.aspect = container.clientWidth / container.clientHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const dt = clockRef.current.getDelta();
      if (mixerRef.current) mixerRef.current.update(dt);
      tickHead();
      renderer.render(scene, cam);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('skillHover', onSkillHover);
      window.removeEventListener('skillLeave', onSkillLeave);
      ownTriggersRef.current.forEach(st => st && st.kill());
      scene.clear();
      renderer.dispose();
      if (container?.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [tickHead]); // Initialization effect

  // ── SCROLL TIMELINES: Initialize ONLY when DOM is ready ──
  useEffect(() => {
    if (!isReady || !loadedDataRef.current) return;
    const { char, cam, monitor, screenLight } = loadedDataRef.current;

    // 1. Hero → Bio: character rotates + shifts left in viewport
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: '#bio',
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        onEnter:     () => { zoneRef.current = 'bio'; },
        onLeaveBack: () => { zoneRef.current = 'hero'; },
      },
    })
      .fromTo(char.rotation, { y: 0, x: 0 }, { y: 0.7, x: 0.03, ease: 'none' }, 0)
      .fromTo(cam.position,
      { x: -2.65, z: 24.7, y: 13.1 },
      { x: 6.5, z: 50, y: 11.5, ease: 'none' }, 0);
    ownTriggersRef.current.push(tl1.scrollTrigger);

    if (monitor) {
      const tl2 = gsap.timeline({
        scrollTrigger: { trigger: '#bio', start: 'top 50%', end: 'top top', scrub: true },
      })
        .to(monitor.material, { opacity: 1 }, 0)
        .to(monitor.position, { y: 0, z: 0 }, 0);
      ownTriggersRef.current.push(tl2.scrollTrigger);
    }
    if (screenLight) {
      const sl = gsap.to(screenLight.material, {
        opacity: 1,
        scrollTrigger: { trigger: '#bio', start: 'top 40%', end: 'top top', scrub: true },
      });
      ownTriggersRef.current.push(sl.scrollTrigger);
    }

    const overlay = overlayRef.current;
    const overlayProxy = { scrubOp: 0, tweenOp: 0 };
    const updateOverlay = () => {
      if (overlay) overlay.style.opacity = Math.max(0, Math.min(1, overlayProxy.scrubOp + overlayProxy.tweenOp));
    };

    // tl3: fade the overlay IN (black) to hide model during image-scrub
    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: '#image-scrub',
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        onEnter:     () => { zoneRef.current = 'scrub'; },
        onLeaveBack: () => { zoneRef.current = 'bio'; },
      },
    })
      .fromTo(overlayProxy,
        { scrubOp: 0 },
        { scrubOp: 1, ease: 'none', onUpdate: updateOverlay },
        0
      )
      .to(char.rotation, { x: 0, ease: 'none' }, 0);
    ownTriggersRef.current.push(tl3.scrollTrigger);

    // st4: after image-scrub ends (at skills), shift model right (cam.x = -7.5) and look left (rot.y = -0.6). Fade out overlay fully.
    const st4 = ScrollTrigger.create({
      trigger: '#skills',
      start: 'top 85%',
      onEnter: () => {
        zoneRef.current = 'post';
        // Reveal the model partially by dropping overlay proxy to -0.35 (overlay opacity = 0.65)
        gsap.to(overlayProxy,  { tweenOp: -0.35, duration: 1.8, ease: 'power2.inOut', onUpdate: updateOverlay });
        // Shift camera left so model goes to the RIGHT.
        gsap.to(cam.position,  { x: -7.5, z: 46, y: 11.5, duration: 1.8, ease: 'power2.inOut' });
        // Rotate body to face left towards the center content
        gsap.to(char.rotation, { y: -0.6, x: 0.03, duration: 1.8, ease: 'power2.inOut' });
      },
      onLeaveBack: () => {
        zoneRef.current = 'scrub';
        // Restore overlay to black to hide the model during image-scrub
        gsap.to(overlayProxy,  { tweenOp: 0, duration: 1.5, ease: 'power2.inOut', onUpdate: updateOverlay });
        // Restore camera and rotation to bio/scrub state (y: 0.7 makes it look right toward content)
        gsap.to(cam.position,  { x: 6.5, z: 50, y: 11.5, duration: 1.5, ease: 'power2.inOut' });
        gsap.to(char.rotation, { y: 0.7, x: 0, duration: 1.5, ease: 'power2.inOut' });
      },
    });
    ownTriggersRef.current.push(st4);

    // st5: Dim the model further when entering #resume and #contact (Let's Build Together / Got an idea)
    const st5 = ScrollTrigger.create({
      trigger: '#resume',
      start: 'top 75%',
      onEnter: () => {
        // Dim it more: overlay proxy to -0.15 (overlay opacity = 0.85)
        gsap.to(overlayProxy, { tweenOp: -0.15, duration: 1.5, ease: 'power2.out', onUpdate: updateOverlay });
      },
      onLeaveBack: () => {
        // Restore to the brighter #skills state
        gsap.to(overlayProxy, { tweenOp: -0.35, duration: 1.5, ease: 'power2.inOut', onUpdate: updateOverlay });
      },
    });
    ownTriggersRef.current.push(st5);

  }, [isReady]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 5,
        width: '100%',
        height: '100%',
        background: [
          'radial-gradient(ellipse 75% 65% at 55% 58%, rgba(60,4,4,0.55) 0%, transparent 70%)',
          'radial-gradient(ellipse 100% 50% at 50% 100%, rgba(30,0,0,0.6) 0%, transparent 60%)',
        ].join(', '),
      }}
    >
      <div ref={mountRef} className="w-full h-full" />
      {/* Overlay: starts transparent so model is visible at page load.
          GSAP animates this to black to hide model during image-scrub,
          then partially lifts it in skills section. Canvas opacity never changes. */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute', inset: 0,
          background: '#020000',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
