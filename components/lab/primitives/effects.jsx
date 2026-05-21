'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StirringRod as _StirringRodGeom } from './apparatus';

// ─── FallingDrop ───────────────────────────────────────────────────────────
// Animates a single sphere falling from `from` to `to` under gravity-ish ease.
// Calls onLand() when it arrives. Render as <FallingDrop ... /> in your scene.
export function FallingDrop({
  from = [0, 1, 0],
  to = [0, 0, 0],
  duration = 0.5,
  color = '#9ec8ff',
  radius = 0.012,
  onLand,
}) {
  const ref = useRef();
  const start = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - start.current) / duration);
    // Quadratic ease-in for gravity feel
    const eased = t * t;
    ref.current.position.x = from[0] + (to[0] - from[0]) * eased;
    ref.current.position.y = from[1] + (to[1] - from[1]) * eased;
    ref.current.position.z = from[2] + (to[2] - from[2]) * eased;
    if (t >= 1 && onLand) {
      onLand();
      start.current = -Infinity; // disarm
    }
  });
  return (
    <mesh ref={ref} position={from}>
      <sphereGeometry args={[radius, 12, 12]} />
      <meshPhysicalMaterial color={color} transmission={0.5} thickness={0.3} roughness={0.1} emissive={color} emissiveIntensity={0.15} />
    </mesh>
  );
}

// ─── Splash ────────────────────────────────────────────────────────────────
// Spawns 3 small droplets that fly outward from `at`, arc, and fall back.
// Auto-removes after `duration` seconds via onDone callback.
export function Splash({ at = [0, 0, 0], color = '#9ec8ff', duration = 0.6, onDone }) {
  const refs = [useRef(), useRef(), useRef()];
  const start = useRef(null);
  // Pre-compute trajectories
  const vels = useRef(
    [0, 1, 2].map((i) => {
      const angle = (i / 3) * Math.PI * 2 + Math.random();
      return {
        vx: Math.cos(angle) * 0.18,
        vz: Math.sin(angle) * 0.18,
        vy: 0.5 + Math.random() * 0.2,
      };
    }),
  );
  useFrame((state) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    refs.forEach((r, i) => {
      if (!r.current) return;
      const v = vels.current[i];
      r.current.position.set(at[0] + v.vx * t, at[1] + v.vy * t - 4.9 * t * t, at[2] + v.vz * t);
      const opacity = Math.max(0, 1 - t / duration);
      if (r.current.material) r.current.material.opacity = opacity;
    });
    if (t >= duration && onDone) {
      onDone();
      start.current = Infinity;
    }
  });
  return (
    <>
      {refs.map((r, i) => (
        <mesh key={i} ref={r} position={at}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
      ))}
    </>
  );
}

// ─── Bubbles ───────────────────────────────────────────────────────────────
// N rising bubbles inside a cylindrical container (water bath).
// `on` toggles spawning; existing bubbles finish their rise.
export function Bubbles({ on = false, count = 8, radius = 0.07, bottomY = 0, topY = 0.15, color = '#e0f4ff' }) {
  const groupRef = useRef();
  const bubbles = useRef(
    Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * radius * 1.6,
      z: (Math.random() - 0.5) * radius * 1.6,
      y: bottomY + Math.random() * (topY - bottomY),
      speed: 0.06 + Math.random() * 0.08,
      size: 0.005 + Math.random() * 0.005,
      active: false,
    })),
  );
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    bubbles.current.forEach((b, i) => {
      const mesh = groupRef.current.children[i];
      if (!mesh) return;
      if (on && !b.active && Math.random() < 0.02) b.active = true;
      if (b.active) {
        b.y += b.speed * delta;
        if (b.y > topY) {
          b.y = bottomY;
          b.x = (Math.random() - 0.5) * radius * 1.6;
          b.z = (Math.random() - 0.5) * radius * 1.6;
          b.active = on;
        }
      }
      mesh.position.set(b.x, b.y, b.z);
      mesh.visible = b.active;
    });
  });
  return (
    <group ref={groupRef}>
      {bubbles.current.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]} visible={false}>
          <sphereGeometry args={[b.size, 8, 8]} />
          <meshPhysicalMaterial color={color} transmission={0.85} roughness={0.05} thickness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── WaterStream ───────────────────────────────────────────────────────────
// A continuous thin cylinder of water from `from` down to `to` with a slight
// taper and a wobble. Use this when a tap is open. `on` toggles visibility.
export function WaterStream({ from = [0, 1, 0], to = [0, 0, 0], radius = 0.0035, color = '#1e88e5', on = true }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    // Subtle horizontal wobble for "real water" feel
    const t = state.clock.elapsedTime;
    meshRef.current.position.x = (from[0] + to[0]) / 2 + Math.sin(t * 8) * 0.0008;
  });
  if (!on) return null;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const midY = (from[1] + to[1]) / 2;
  return (
    <mesh
      ref={meshRef}
      position={[from[0], midY, from[2]]}
    >
      <cylinderGeometry args={[radius * 0.8, radius * 1.2, length, 8]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.7}
        transmission={0.3}
        roughness={0.05}
        ior={1.33}
      />
    </mesh>
  );
}

// ─── ContinuousDrops ───────────────────────────────────────────────────────
// Spawns a slow trickle of drops falling from `from` to `to` while `on`.
// Use for "drop-by-drop" mode (tap barely open).
export function ContinuousDrops({ from = [0, 1, 0], to = [0, 0, 0], on = true, rate = 2, color = '#1e88e5', radius = 0.008 }) {
  const [drops, setDrops] = useState([]);
  const lastSpawn = useRef(0);
  const counter = useRef(0);
  useFrame((state) => {
    if (!on) return;
    const t = state.clock.elapsedTime;
    if (t - lastSpawn.current > 1 / rate) {
      lastSpawn.current = t;
      counter.current += 1;
      setDrops((d) => [...d, { id: counter.current, born: t }]);
    }
    // Remove drops older than ~1s
    setDrops((d) => d.filter((dr) => t - dr.born < 0.9));
  });
  return (
    <>
      {drops.map((d) => (
        <FallingDrop
          key={d.id}
          from={from}
          to={to}
          duration={0.6}
          color={color}
          radius={radius}
        />
      ))}
    </>
  );
}

// ─── StirringRodAnimated ───────────────────────────────────────────────────
// A stirring rod that circles around a beaker centre when `stirring` is on.
// Parks at the rim when off. Drop into any beaker via:
//   <Beaker ...><StirringRodAnimated stirring={isStirring} /></Beaker>
export function StirringRodAnimated({ stirring, radius = 0.05, rodLength = 0.22, parkX = 0.06, parkY = 0.2 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    if (stirring) {
      const t = state.clock.elapsedTime;
      ref.current.position.x = Math.cos(t * 5) * radius;
      ref.current.position.z = Math.sin(t * 5) * radius;
      ref.current.position.y = parkY;
      ref.current.rotation.x = Math.sin(t * 5) * 0.15;
      ref.current.rotation.z = -Math.cos(t * 5) * 0.15;
    } else {
      ref.current.position.x = parkX;
      ref.current.position.z = 0;
      ref.current.position.y = parkY;
      ref.current.rotation.x = 0;
      ref.current.rotation.z = 0.3;
    }
  });
  return (
    <group ref={ref} position={[parkX, parkY, 0]}>
      <_StirringRodGeom length={rodLength} />
    </group>
  );
}

// ─── SwirlIndicator ────────────────────────────────────────────────────────
// Three thin spokes inside a liquid that rotate when stirring is on.
// Visible cue that the water itself is being moved, not just the rod.
export function SwirlIndicator({ stirring, color = '#a0b8c8', radius = 0.07, y = 0.05 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (stirring) {
      ref.current.rotation.y += delta * 6;
      ref.current.visible = true;
    } else {
      ref.current.visible = false;
    }
  });
  return (
    <group ref={ref} position={[0, y, 0]} visible={false}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <boxGeometry args={[radius, 0.001, 0.005]} />
          <meshStandardMaterial color={color} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Wobble ────────────────────────────────────────────────────────────────
// Wraps children and wobbles them for a short period when `intensity > 0`.
// Used for shaking emulsion tubes, swirling flasks, etc.
export function Wobble({ intensity = 0, frequency = 12, axis = 'z', children }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    if (intensity > 0) {
      const t = state.clock.elapsedTime;
      ref.current.rotation[axis] = Math.sin(t * frequency) * 0.12 * intensity;
    } else {
      ref.current.rotation[axis] *= 0.9;
    }
  });
  return <group ref={ref}>{children}</group>;
}

// ─── DropStream ────────────────────────────────────────────────────────────
// Manages a list of currently-falling drops + splashes. Use the imperative
// `useDropStream()` hook from `useDropStream.js` to spawn into it.
export function DropStream({ drops = [], onDropLand, onSplashDone }) {
  return (
    <>
      {drops.map((d) =>
        d.type === 'drop' ? (
          <FallingDrop
            key={d.id}
            from={d.from}
            to={d.to}
            duration={d.duration}
            color={d.color}
            radius={d.radius}
            onLand={() => onDropLand(d.id, d)}
          />
        ) : (
          <Splash
            key={d.id}
            at={d.at}
            color={d.color}
            onDone={() => onSplashDone(d.id)}
          />
        ),
      )}
    </>
  );
}
