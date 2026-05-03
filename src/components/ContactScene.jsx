import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function ContactParticles() {
  const count = 250;
  const groupRef = useRef(null);
  const { mouse } = useThree();

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color('#6c63ff');
    const color2 = new THREE.Color('#43e8d8');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;

      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0.003 + Math.random() * 0.002;
      vel[i * 3 + 2] = 0;

      const c = Math.random() > 0.5 ? color1 : color2;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, vel, col];
  }, []);

  const positionsRef = useRef(positions);
  const velocitiesRef = useRef(velocities);

  useFrame(() => {
    const pos = positionsRef.current;
    const vel = velocitiesRef.current;
    const mx = mouse.x * 5;
    const my = mouse.y * 5;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Drift upward
      pos[iy] += vel[iy];

      // Wrap
      if (pos[iy] > 5) pos[iy] = -5;

      // Mouse repulsion
      const dx = pos[ix] - mx;
      const dy = pos[iy] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.5) {
        const force = (1.5 - dist) * 0.08;
        pos[ix] += (dx / dist) * force;
        pos[iy] += (dy / dist) * force;
      }
    }

    if (groupRef.current) {
      const geometry = groupRef.current.geometry;
      geometry.attributes.position.array = pos;
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={groupRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function ContactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ContactParticles />
    </Canvas>
  );
}
