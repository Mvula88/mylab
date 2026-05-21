'use client';

// ─── RetortStand ───────────────────────────────────────────────────────────
// Heavy base + vertical rod. Origin at floor.
export function RetortStand({ position = [0, 0, 0], rodHeight = 0.9, baseSize = [0.3, 0.02, 0.18], children }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh receiveShadow castShadow position={[0.06, baseSize[1] / 2, 0]}>
        <boxGeometry args={baseSize} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Vertical rod */}
      <mesh castShadow position={[-0.08, baseSize[1] + rodHeight / 2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, rodHeight, 16]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.85} roughness={0.25} />
      </mesh>
      {children}
    </group>
  );
}

// ─── BossClamp ─────────────────────────────────────────────────────────────
// Holds a burette/flask to the retort stand rod. Position is the centre of
// the clamping ring relative to the stand origin.
export function BossClamp({ position = [0, 0, 0], ringRadius = 0.025 }) {
  return (
    <group position={position}>
      {/* Boss (attaches to rod) */}
      <mesh position={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.04]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Horizontal arm */}
      <mesh position={[-0.04, 0, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.08, 12]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Clamping ring (open at top — visual only) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[ringRadius, 0.004, 8, 32, Math.PI * 1.6]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

// ─── TubeRack ──────────────────────────────────────────────────────────────
// Wooden 4-hole rack. Origin at floor; tube sockets are at y=top of base.
export function TubeRack({
  position = [0, 0, 0],
  slots = 4,
  spacing = 0.18,
  baseColor = '#8b5a2b',
  topColor = '#a06a36',
  children,
}) {
  const width = spacing * slots + 0.08;
  return (
    <group position={position}>
      {/* Lower plank */}
      <mesh receiveShadow castShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[width, 0.04, 0.18]} />
        <meshStandardMaterial color={baseColor} roughness={0.75} />
      </mesh>
      {/* Upper plank with sockets */}
      <mesh receiveShadow castShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[width, 0.025, 0.18]} />
        <meshStandardMaterial color={topColor} roughness={0.7} />
      </mesh>
      {/* Two end posts */}
      {[-1, 1].map((s) => (
        <mesh key={s} castShadow position={[s * (width / 2 - 0.02), 0.07, 0]}>
          <boxGeometry args={[0.025, 0.1, 0.18]} />
          <meshStandardMaterial color={baseColor} roughness={0.75} />
        </mesh>
      ))}
      {/* Dark "holes" so eye reads sockets */}
      {Array.from({ length: slots }).map((_, i) => (
        <mesh key={i} position={[(i - (slots - 1) / 2) * spacing, 0.114, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 24]} />
          <meshStandardMaterial color="#1a0e05" roughness={0.9} />
        </mesh>
      ))}
      {children}
    </group>
  );
}
