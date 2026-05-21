'use client';

import { forwardRef } from 'react';
import { Html } from '@react-three/drei';

// ─── Glass material ────────────────────────────────────────────────────────
// Real lab glass is mostly transparent with subtle reflections at the edges,
// not a sparkly diamond. Using standard transparent physical material rather
// than MeshTransmissionMaterial gives a much more realistic, calmer look.
function GlassMaterial(props) {
  return (
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
      {...props}
    />
  );
}

// ─── Water-like liquid material ────────────────────────────────────────────
// Slight tint, real surface, soft refraction — like actual lab water.
function WaterMaterial({ color = '#cfe9ff', ...props }) {
  return (
    <meshPhysicalMaterial
      color={color}
      transparent
      opacity={0.78}
      transmission={0.35}
      thickness={0.3}
      roughness={0.1}
      ior={1.33}
      clearcoat={0.3}
      clearcoatRoughness={0.15}
      reflectivity={0.2}
      {...props}
    />
  );
}

// ─── Graduations ───────────────────────────────────────────────────────────
// Tiny horizontal tick marks etched into a cylindrical glass surface.
// `numbered` adds floating number labels at major ticks.
function Graduations({
  radius = 0.04,
  fromY = 0,
  toY = 0.5,
  majorEvery = 0.1,    // major tick every N metres of height
  minorPerMajor = 10,
  numbersStartAt = 0,
  numbersStep = 10,
  numbersUnit = 'cm³',
  numbered = true,
}) {
  const ticks = [];
  const total = toY - fromY;
  const minorStep = majorEvery / minorPerMajor;
  const count = Math.floor(total / minorStep);
  for (let i = 0; i <= count; i++) {
    const y = fromY + i * minorStep;
    const isMajor = i % minorPerMajor === 0;
    const width = isMajor ? radius * 0.7 : radius * 0.35;
    ticks.push(
      <mesh key={i} position={[radius + 0.0005, y, 0]}>
        <boxGeometry args={[0.0015, 0.0008, width]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>,
    );
  }
  const numbers = [];
  if (numbered) {
    const majorCount = Math.floor(total / majorEvery);
    for (let i = 0; i <= majorCount; i++) {
      const y = fromY + i * majorEvery;
      const value = numbersStartAt + i * numbersStep;
      numbers.push(
        <Html
          key={`n${i}`}
          position={[radius + 0.015, y, 0]}
          center
          distanceFactor={3.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-[8px] font-mono text-stone-700 select-none">{value}</div>
        </Html>,
      );
    }
  }
  return <>{ticks}{numbers}</>;
}

// ─── TestTube ──────────────────────────────────────────────────────────────
export const TestTube = forwardRef(function TestTube(
  { position = [0, 0, 0], height = 0.55, radius = 0.067, label, children },
  ref,
) {
  return (
    <group ref={ref} position={position}>
      <mesh castShadow position={[0, height / 2 + radius, 0]}>
        <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
        <GlassMaterial />
      </mesh>
      <mesh castShadow position={[0, radius, 0]}>
        <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <GlassMaterial />
      </mesh>
      <mesh position={[0, height + radius, 0]}>
        <torusGeometry args={[radius, 0.004, 8, 32]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.3} metalness={0.1} />
      </mesh>
      {label && (
        <Html position={[0, -0.04, radius + 0.01]} center distanceFactor={2} style={{ pointerEvents: 'none' }}>
          <div className="text-white text-xs font-bold bg-black/50 px-1.5 py-0.5 rounded">{label}</div>
        </Html>
      )}
      {children}
    </group>
  );
});

export function TubeLiquid({ tubeHeight = 0.55, tubeRadius = 0.067, level = 0.4, color = '#cfe9ff' }) {
  if (level <= 0) return null;
  const hemiHeight = tubeRadius;
  const totalFillHeight = level * (tubeHeight + hemiHeight);
  const cylFillHeight = Math.max(0, totalFillHeight - hemiHeight);
  return (
    <group>
      <mesh position={[0, tubeRadius, 0]}>
        <sphereGeometry args={[tubeRadius * 0.95, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <WaterMaterial color={color} />
      </mesh>
      {cylFillHeight > 0 && (
        <mesh position={[0, tubeRadius + cylFillHeight / 2, 0]}>
          <cylinderGeometry args={[tubeRadius * 0.95, tubeRadius * 0.95, cylFillHeight, 32]} />
          <WaterMaterial color={color} />
        </mesh>
      )}
      <mesh position={[0, tubeRadius + cylFillHeight + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[tubeRadius * 0.95, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} side={2} />
      </mesh>
    </group>
  );
}

// ─── Beaker ────────────────────────────────────────────────────────────────
export const Beaker = forwardRef(function Beaker(
  { position = [0, 0, 0], height = 0.18, radius = 0.09, liquidLevel = 0, liquidColor = '#a8d8ff', graduated = true, children },
  ref,
) {
  return (
    <group ref={ref} position={position}>
      <mesh castShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
        <GlassMaterial />
      </mesh>
      <mesh position={[0, 0.002, 0]}>
        <cylinderGeometry args={[radius * 0.98, radius * 0.98, 0.004, 32]} />
        <GlassMaterial />
      </mesh>
      <mesh position={[0, height, 0]}>
        <torusGeometry args={[radius, 0.005, 8, 32]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.3} />
      </mesh>
      {graduated && (
        <Graduations
          radius={radius}
          fromY={0.02}
          toY={height - 0.01}
          majorEvery={(height - 0.03) / 5}
          minorPerMajor={5}
          numbersStartAt={50}
          numbersStep={50}
          numbersUnit="ml"
        />
      )}
      {liquidLevel > 0 && (
        <>
          <mesh position={[0, (liquidLevel * height) / 2 + 0.004, 0]}>
            <cylinderGeometry args={[radius * 0.97, radius * 0.97, liquidLevel * height, 32]} />
            <WaterMaterial color={liquidColor} />
          </mesh>
          <mesh position={[0, liquidLevel * height + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius * 0.97, 32]} />
            <meshStandardMaterial color={liquidColor} roughness={0.15} side={2} />
          </mesh>
        </>
      )}
      {children}
    </group>
  );
});

// ─── ConicalFlask (Erlenmeyer) — with graduations ──────────────────────────
export const ConicalFlask = forwardRef(function ConicalFlask(
  { position = [0, 0, 0], liquidLevel = 0, liquidColor = '#cfe9ff', graduated = true, children },
  ref,
) {
  return (
    <group ref={ref} position={position}>
      {/* Cone body */}
      <mesh castShadow position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.03, 0.09, 0.15, 32, 1, true]} />
        <GlassMaterial />
      </mesh>
      {/* Neck */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.028, 0.03, 0.06, 32, 1, true]} />
        <GlassMaterial />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.088, 0.088, 0.004, 32]} />
        <GlassMaterial />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0.21, 0]}>
        <torusGeometry args={[0.028, 0.004, 8, 32]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.3} />
      </mesh>
      {/* Graduations along the cone — 50 / 100 / 150 / 200 cm³ marks */}
      {graduated && (
        <FlaskGraduations />
      )}
      {/* Liquid */}
      {liquidLevel > 0 && (() => {
        const h = liquidLevel * 0.14;
        const topR = 0.03 + (0.09 - 0.03) * (1 - liquidLevel);
        return (
          <>
            <mesh position={[0, h / 2 + 0.004, 0]}>
              <cylinderGeometry args={[topR, 0.088, h, 32]} />
              <WaterMaterial color={liquidColor} />
            </mesh>
            <mesh position={[0, h + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[topR, 32]} />
              <meshStandardMaterial color={liquidColor} roughness={0.15} side={2} />
            </mesh>
          </>
        );
      })()}
      {children}
    </group>
  );
});

// Erlenmeyer flasks get short tick marks on the sloping wall + cm³ numbers.
function FlaskGraduations() {
  // Major marks at 4 evenly-spaced heights of the cone (50, 100, 150, 200 cm³)
  const marks = [
    { y: 0.025, value: 50,  r: 0.082 },
    { y: 0.055, value: 100, r: 0.074 },
    { y: 0.090, value: 150, r: 0.062 },
    { y: 0.120, value: 200, r: 0.048 },
  ];
  return (
    <>
      {marks.map((m, i) => (
        <group key={i} position={[0, m.y, 0]}>
          <mesh position={[m.r + 0.0008, 0, 0]}>
            <boxGeometry args={[0.0018, 0.001, 0.025]} />
            <meshStandardMaterial color="#222" roughness={0.6} />
          </mesh>
          <Html
            position={[m.r + 0.018, 0, 0]}
            center
            distanceFactor={3.5}
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-[7px] font-mono text-stone-700 select-none">{m.value}</div>
          </Html>
        </group>
      ))}
    </>
  );
}

// ─── Burette ───────────────────────────────────────────────────────────────
export const Burette = forwardRef(function Burette(
  { position = [0, 0, 0], length = 0.7, radius = 0.018, liquidLevel = 0.9, liquidColor = '#1e88e5', stopcockAngle = 0, graduated = true },
  ref,
) {
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.012, 0]}>
        <coneGeometry args={[0.004, 0.024, 16]} />
        <GlassMaterial />
      </mesh>
      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[0.05, 0.022, 0.022]} />
        <meshStandardMaterial color="#e9e2c8" roughness={0.6} />
      </mesh>
      <group position={[0.025, 0.035, 0]} rotation={[0, 0, stopcockAngle]}>
        <mesh position={[0.018, 0, 0]}>
          <boxGeometry args={[0.036, 0.005, 0.005]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>
      <mesh castShadow position={[0, 0.05 + length / 2, 0]}>
        <cylinderGeometry args={[radius, radius, length, 32, 1, true]} />
        <GlassMaterial />
      </mesh>
      {/* Liquid — drawn from TOP downward as the burette empties.
          NB: in a real burette, 0 mark is at top, 50 at bottom. */}
      {liquidLevel > 0 && (
        <>
          <mesh position={[0, 0.05 + (liquidLevel * length) / 2, 0]}>
            <cylinderGeometry args={[radius * 0.92, radius * 0.92, liquidLevel * length, 24]} />
            <WaterMaterial color={liquidColor} />
          </mesh>
          <mesh position={[0, 0.05 + liquidLevel * length + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius * 0.92, 24]} />
            <meshStandardMaterial color={liquidColor} roughness={0.2} side={2} />
          </mesh>
        </>
      )}
      <mesh position={[0, 0.05 + length, 0]}>
        <torusGeometry args={[radius, 0.003, 8, 32]} />
        <meshStandardMaterial color="#cfd6dd" roughness={0.3} />
      </mesh>
      {/* Graduations: 0 at the TOP, 50 at the BOTTOM, every 10 cm³ labelled. */}
      {graduated && (
        <BuretteGraduations length={length} radius={radius} />
      )}
    </group>
  );
});

function BuretteGraduations({ length, radius }) {
  const ticks = [];
  const numbers = [];
  // 51 minor ticks (1 cm³ each), 11 major (every 10), with 0 at top, 50 at bottom
  const top = 0.05 + length;
  const usable = length;
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const y = top - t * usable;
    const isMajor = i % 10 === 0;
    const tickLen = isMajor ? 0.012 : 0.005;
    ticks.push(
      <mesh key={i} position={[radius + 0.0006, y, 0]}>
        <boxGeometry args={[0.0015, 0.0006, tickLen]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>,
    );
    if (isMajor) {
      numbers.push(
        <Html
          key={`n${i}`}
          position={[radius + 0.018, y, 0]}
          center
          distanceFactor={3.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-[7px] font-mono text-stone-700 select-none">{i}</div>
        </Html>,
      );
    }
  }
  return <>{ticks}{numbers}</>;
}
