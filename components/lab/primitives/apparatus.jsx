'use client';

import { Html } from '@react-three/drei';

const GLASS = (
  <meshPhysicalMaterial
    color="#f8fbff"
    transparent
    opacity={0.18}
    transmission={0.85}
    thickness={0.05}
    roughness={0.12}
    metalness={0}
    ior={1.45}
    clearcoat={0.4}
    clearcoatRoughness={0.2}
    reflectivity={0.25}
    side={2}
  />
);

// ─── Funnel ───────────────────────────────────────────────────────────────
// Glass cone with a long thin stem. Origin at the stem tip.
export function Funnel({ position = [0, 0, 0], radius = 0.07, height = 0.13, stemLength = 0.1, stemRadius = 0.008 }) {
  return (
    <group position={position}>
      {/* Stem (narrow tube downward from origin upward) */}
      <mesh position={[0, stemLength / 2, 0]}>
        <cylinderGeometry args={[stemRadius, stemRadius, stemLength, 16, 1, true]} />
        {GLASS}
      </mesh>
      {/* Cone (funnel body) */}
      <mesh position={[0, stemLength + height / 2, 0]}>
        <cylinderGeometry args={[radius, stemRadius * 1.2, height, 32, 1, true]} />
        {GLASS}
      </mesh>
      {/* Rim */}
      <mesh position={[0, stemLength + height, 0]}>
        <torusGeometry args={[radius, 0.003, 8, 32]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── FilterPaper ──────────────────────────────────────────────────────────
// A cone of white paper that sits inside a Funnel.
export function FilterPaper({ position = [0, 0, 0], radius = 0.06, height = 0.1 }) {
  return (
    <mesh position={[position[0], position[1] + height / 2, position[2]]}>
      <coneGeometry args={[radius, height, 24, 1, true]} />
      <meshStandardMaterial color="#f0ede4" roughness={0.95} side={2} />
    </mesh>
  );
}

// ─── Mortar + Pestle ──────────────────────────────────────────────────────
export function Mortar({ position = [0, 0, 0], radius = 0.08, contains = null }) {
  return (
    <group position={position}>
      {/* Outer hemisphere bowl */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.85} />
      </mesh>
      {/* Inner cavity (slightly smaller) for depth */}
      <mesh position={[0, 0.005, 0]}>
        <sphereGeometry args={[radius * 0.85, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#d8d2c8" roughness={0.95} side={2} />
      </mesh>
      {/* Optional contents (rock salt etc.) */}
      {contains && (
        <mesh position={[0, -radius * 0.4, 0]}>
          <sphereGeometry args={[radius * 0.75, 16, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color={contains} roughness={0.95} />
        </mesh>
      )}
    </group>
  );
}

export function Pestle({ position = [0, 0, 0], length = 0.1, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Handle */}
      <mesh castShadow position={[0, length / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.012, length, 16]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.8} />
      </mesh>
      {/* Rounded grinding end at the bottom */}
      <mesh castShadow position={[0, -0.004, 0]}>
        <sphereGeometry args={[0.018, 16, 12]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.85} />
      </mesh>
    </group>
  );
}

// ─── EvaporatingBasin ─────────────────────────────────────────────────────
// Shallow ceramic dish for evaporation.
export function EvaporatingBasin({ position = [0, 0, 0], radius = 0.075, depth = 0.025, crystalGrowth = 0 }) {
  return (
    <group position={position}>
      {/* Outer shallow bowl */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.85, depth, 32, 1, true]} />
        <meshStandardMaterial color="#f4f0e8" roughness={0.6} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -depth / 2, 0]}>
        <cylinderGeometry args={[radius * 0.85, radius * 0.85, 0.004, 32]} />
        <meshStandardMaterial color="#f4f0e8" roughness={0.6} />
      </mesh>
      {/* Rim ring */}
      <mesh position={[0, depth / 2, 0]}>
        <torusGeometry args={[radius, 0.003, 8, 32]} />
        <meshStandardMaterial color="#ddd6c8" roughness={0.5} />
      </mesh>
      {/* Crystals (growing as crystalGrowth → 1) */}
      {crystalGrowth > 0 && (
        <group position={[0, -depth / 2 + 0.003 + crystalGrowth * 0.005, 0]}>
          <mesh>
            <cylinderGeometry args={[radius * 0.8, radius * 0.78, 0.005 + crystalGrowth * 0.012, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} metalness={0.05} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ─── StirringRod ──────────────────────────────────────────────────────────
export function StirringRod({ position = [0, 0, 0], length = 0.22, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[0.0035, 0.0035, length, 12]} />
        <meshPhysicalMaterial color="#f8fbff" transmission={0.7} opacity={0.5} transparent thickness={0.08} roughness={0.1} ior={1.45} />
      </mesh>
    </group>
  );
}

// ─── DeliveryTube ─────────────────────────────────────────────────────────
// Right-angled glass tube — used to lead gas from a flask to a collection
// vessel (over water, etc.). Simple L-shape made from two cylinders.
export function DeliveryTube({ position = [0, 0, 0], vertical = 0.15, horizontal = 0.25, radius = 0.005 }) {
  return (
    <group position={position}>
      {/* Vertical leg from origin upward */}
      <mesh position={[0, vertical / 2, 0]}>
        <cylinderGeometry args={[radius, radius, vertical, 12]} />
        {GLASS}
      </mesh>
      {/* Elbow */}
      <mesh position={[radius, vertical, 0]}>
        <sphereGeometry args={[radius * 1.3, 12, 12]} />
        {GLASS}
      </mesh>
      {/* Horizontal leg */}
      <mesh position={[horizontal / 2, vertical, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, horizontal, 12]} />
        {GLASS}
      </mesh>
    </group>
  );
}
