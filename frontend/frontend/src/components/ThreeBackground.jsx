import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float } from '@react-three/drei';

const FloatingGeometry = () => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += 0.001;
      ref.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[-5, 2, -10]}>
        <icosahedronGeometry args={[3, 0]} />
        <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh position={[6, -4, -15]}>
        <octahedronGeometry args={[4, 0]} />
        <meshBasicMaterial color="#9d00ff" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh position={[0, 0, -25]}>
        <torusGeometry args={[15, 0.05, 16, 100]} />
        <meshBasicMaterial color="#ff00c8" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
        <Sparkles count={150} scale={20} size={2} speed={0.2} opacity={0.3} color="#ffffff" />
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
           <FloatingGeometry />
        </Float>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617] pointer-events-none" />
    </div>
  );
};

export default ThreeBackground;
