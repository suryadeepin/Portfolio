import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function MorphingCrystal() {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.distort = THREE.MathUtils.lerp(meshRef.current.distort, 0.4 + Math.sin(t) * 0.2, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[1, 100, 100]} scale={1.8}>
        <MeshDistortMaterial
          ref={meshRef}
          color="#6c63ff"
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      {/* Wireframe shell */}
      <Sphere args={[1, 32, 32]} scale={1.82}>
        <meshBasicMaterial color="#43e8d8" wireframe transparent opacity={0.15} />
      </Sphere>
    </Float>
  );
}

function OrbitingRings() {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial color="#6c63ff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#43e8d8" transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[4, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ff6584" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const count = 4000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#6c63ff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

import { useMemo } from 'react';

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#6c63ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#43e8d8" />
      
      {/* Shift the entire scene to the right */}
      <group position={[2.5, 0, 0]}>
        <MorphingCrystal />
        <OrbitingRings />
      </group>
      
      <FloatingParticles />
    </Canvas>
  );
}
