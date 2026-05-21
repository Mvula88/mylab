'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

// ─── Electrode ─────────────────────────────────────────────────────────────
// Vertical rod that dips into a beaker. Origin at the top (where the wire
// clips to it). Materials: 'carbon' (dark grey), 'copper' (orange), 'platinum'.
const ELECTRODE_COLORS = {
  carbon: { color: '#1a1a1a', metalness: 0.2, roughness: 0.7 },
  copper: { color: '#c87533', metalness: 0.85, roughness: 0.25 },
  platinum: { color: '#cfd6dd', metalness: 0.9, roughness: 0.15 },
  graphite: { color: '#2a2a2a', metalness: 0.15, roughness: 0.7 },
};

export function Electrode({ position = [0, 0, 0], length = 0.28, radius = 0.008, material = 'carbon', deposit = null, depositThickness = 0 }) {
  const m = ELECTRODE_COLORS[material] || ELECTRODE_COLORS.carbon;
  return (
    <group position={position}>
      {/* Rod — extends downward from origin */}
      <mesh castShadow position={[0, -length / 2, 0]}>
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshStandardMaterial {...m} />
      </mesh>
      {/* Optional deposit (e.g. shiny copper plating) — slightly fatter sleeve */}
      {deposit && depositThickness > 0 && (
        <mesh position={[0, -length / 2 - 0.02, 0]}>
          <cylinderGeometry args={[radius + depositThickness, radius + depositThickness, length * 0.7, 16]} />
          <meshStandardMaterial color={deposit} metalness={0.85} roughness={0.3} />
        </mesh>
      )}
      {/* Crocodile clip stub */}
      <mesh position={[0, 0.012, 0]} castShadow>
        <boxGeometry args={[0.025, 0.018, 0.014]} />
        <meshStandardMaterial color="#b8392c" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ─── Battery ───────────────────────────────────────────────────────────────
// Simple two-cell battery box with + and - terminals visible.
export function Battery({ position = [0, 0, 0], on = false }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.08, 0.1]} />
        <meshStandardMaterial color="#222" roughness={0.4} />
      </mesh>
      {/* Terminals */}
      <mesh position={[-0.08, 0.05, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.02, 16]} />
        <meshStandardMaterial color="#aa3333" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 0.05, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.02, 16]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* On-light */}
      <mesh position={[0, 0.045, 0.051]}>
        <sphereGeometry args={[0.008, 12, 12]} />
        <meshStandardMaterial
          color={on ? '#ff5555' : '#330000'}
          emissive={on ? '#ff3333' : '#000'}
          emissiveIntensity={on ? 0.8 : 0}
        />
      </mesh>
    </group>
  );
}

// ─── Wire ──────────────────────────────────────────────────────────────────
// A flexible wire drawn as a Catmull-Rom curve between two points.
// `color` lets you pick red (positive) or black (negative).
export function Wire({ from = [0, 0, 0], to = [0, 0, 0], color = '#b8392c', sag = 0.05 }) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y -= sag;
    return new THREE.CatmullRomCurve3([start, mid, end]);
  }, [from.join(','), to.join(','), sag]); // eslint-disable-line
  return (
    <mesh>
      <tubeGeometry args={[curve, 24, 0.004, 8, false]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
}
