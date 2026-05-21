'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// ─── Flame ─────────────────────────────────────────────────────────────────
// Three-layer Bunsen flame: inner blue cone, middle orange, outer yellow.
// Flickers based on time when `on`.
export function Flame({ on = false, scale = 1, position = [0, 0, 0] }) {
  const inner = useRef();
  const middle = useRef();
  const outer = useRef();
  useFrame((state) => {
    if (!on || !inner.current) return;
    const t = state.clock.elapsedTime;
    inner.current.scale.y = 1 + Math.sin(t * 22) * 0.07;
    middle.current.scale.y = 1 + Math.sin(t * 17 + 0.7) * 0.1;
    outer.current.scale.y = 1 + Math.sin(t * 13 + 1.5) * 0.12;
  });
  if (!on) return null;
  return (
    <group position={position} scale={scale}>
      <mesh ref={outer} position={[0, 0.12, 0]}>
        <coneGeometry args={[0.055, 0.28, 18]} />
        <meshBasicMaterial color="#ffd56e" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh ref={middle} position={[0, 0.09, 0]}>
        <coneGeometry args={[0.04, 0.2, 16]} />
        <meshBasicMaterial color="#ff8a3d" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <mesh ref={inner} position={[0, 0.055, 0]}>
        <coneGeometry args={[0.022, 0.12, 14]} />
        <meshBasicMaterial color="#4aa6ff" transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <pointLight color="#ffaa66" intensity={2.5} distance={2} decay={1.5} />
    </group>
  );
}

// ─── Bunsen burner ─────────────────────────────────────────────────────────
// Base + barrel. Origin at base.
export function Bunsen({ position = [0, 0, 0], flameOn = false, children }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.04, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Air collar */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.03, 24]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.024, 0.18, 24]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Top opening */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.022, 0.002, 8, 24]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.4} />
      </mesh>
      <Flame on={flameOn} position={[0, 0.22, 0]} />
      {children}
    </group>
  );
}

// ─── Tripod + Wire gauze ───────────────────────────────────────────────────
// 3-legged steel stand with a wire gauze on top. Origin at floor.
export function Tripod({ position = [0, 0, 0], height = 0.42, ringRadius = 0.075 }) {
  return (
    <group position={position}>
      {/* 3 legs */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * ringRadius * 1.6, height / 2, Math.sin(a) * ringRadius * 1.6]}
            rotation={[0, -a, Math.atan2(ringRadius * 0.6, height)]}
            castShadow
          >
            <cylinderGeometry args={[0.005, 0.005, height * 1.04, 8]} />
            <meshStandardMaterial color="#888" metalness={0.85} roughness={0.25} />
          </mesh>
        );
      })}
      {/* Top ring */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[ringRadius, 0.004, 8, 32]} />
        <meshStandardMaterial color="#888" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Wire gauze square sitting on the ring */}
      <mesh position={[0, height + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[0.22, 0.22]} />
        <meshStandardMaterial color="#666" metalness={0.4} roughness={0.7} side={2} />
      </mesh>
      {/* Ceramic centre patch */}
      <mesh position={[0, height + 0.0045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.045, 24]} />
        <meshStandardMaterial color="#e8d9b0" roughness={0.9} />
      </mesh>
    </group>
  );
}
