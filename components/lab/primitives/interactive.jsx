'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

// ─── Hint ──────────────────────────────────────────────────────────────────
// Floating tooltip with a wobbling arrow pointing at a 3D position.
// Use `show` to toggle visibility (e.g. show until first interaction).
export function Hint({ position = [0, 0, 0], text = 'Tap here', show = true, arrow = true }) {
  const bobRef = useRef();
  useFrame((state) => {
    if (!bobRef.current) return;
    bobRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.015;
  });
  if (!show) return null;
  return (
    <group ref={bobRef} position={position}>
      {arrow && (
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.02, 0.06, 16]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.95} />
        </mesh>
      )}
      <Html
        position={[0, 0.08, 0]}
        center
        distanceFactor={2}
        style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
      >
        <div className="bg-yellow-400 text-stone-900 text-xs font-bold px-2 py-1 rounded shadow-lg border border-yellow-600">
          {text}
        </div>
      </Html>
    </group>
  );
}

// ─── HoverHighlight ────────────────────────────────────────────────────────
// Wrap an interactive group with this to get cursor change + faint glow on hover.
// Pass `enabled={false}` to disable temporarily.
export function HoverHighlight({ enabled = true, children, color = '#facc15' }) {
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.cursor = enabled && hovered ? 'pointer' : 'default';
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.cursor = 'default';
    };
  }, [hovered, enabled]);
  return (
    <group
      onPointerOver={(e) => {
        if (!enabled) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
      {enabled && hovered && (
        <pointLight position={[0, 0, 0]} intensity={0.5} distance={0.3} color={color} />
      )}
    </group>
  );
}

// ─── RotaryDragger ─────────────────────────────────────────────────────────
// Wraps a child group and lets the user drag it to rotate within [min, max]
// radians around an axis. Calls onChange(angle) live.
// Pure pointer-event math — no extra libraries.
export function RotaryDragger({
  axis = 'z',
  min = 0,
  max = Math.PI / 2,
  value = 0,
  onChange,
  onDragStart,
  onDragEnd,
  sensitivity = 0.012,
  children,
}) {
  const groupRef = useRef();
  const dragging = useRef(false);
  const startPointer = useRef(null);
  const startValue = useRef(value);

  // Apply external `value` whenever it changes
  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation[axis] = value;
  }, [value, axis]);

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        dragging.current = true;
        startPointer.current = { x: e.clientX, y: e.clientY };
        startValue.current = value;
        e.target.setPointerCapture(e.pointerId);
        if (onDragStart) onDragStart();
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        e.stopPropagation();
        const dx = e.clientX - startPointer.current.x;
        const dy = e.clientY - startPointer.current.y;
        // Combine horizontal + vertical drag into one rotation amount
        const delta = (dx - dy) * sensitivity;
        const next = Math.max(min, Math.min(max, startValue.current + delta));
        if (onChange) onChange(next);
      }}
      onPointerUp={(e) => {
        if (!dragging.current) return;
        dragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        if (onDragEnd) onDragEnd();
      }}
    >
      {children}
    </group>
  );
}

// ─── Clickable ─────────────────────────────────────────────────────────────
// Wrap any 3D content with a click handler + hover cursor. Doesn't change
// visuals — pair with a label or hint to tell the student it's clickable.
export function Clickable({ onClick, children }) {
  return (
    <HoverHighlight>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
      >
        {children}
      </group>
    </HoverHighlight>
  );
}
