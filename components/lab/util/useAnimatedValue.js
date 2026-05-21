'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

// useAnimatedValue — smoothly lerp a value toward `target` over `duration` seconds.
// Returns the current value. Re-renders each frame while animating.
export function useAnimatedValue(target, duration = 0.5) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(null);
  const targetRef = useRef(target);

  useEffect(() => {
    fromRef.current = value;
    targetRef.current = target;
    startRef.current = null;
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    if (value === targetRef.current) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - startRef.current) / duration);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const next = fromRef.current + (targetRef.current - fromRef.current) * eased;
    setValue(t >= 1 ? targetRef.current : next);
  });

  return value;
}

// useAnimatedColor — smoothly lerp between two hex colors.
export function useAnimatedColor(target, duration = 0.5) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(parseHex(target));
  const startRef = useRef(null);
  const targetRef = useRef(parseHex(target));

  useEffect(() => {
    fromRef.current = parseHex(value);
    targetRef.current = parseHex(target);
    startRef.current = null;
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    if (value === target) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - startRef.current) / duration);
    const r = Math.round(fromRef.current.r + (targetRef.current.r - fromRef.current.r) * t);
    const g = Math.round(fromRef.current.g + (targetRef.current.g - fromRef.current.g) * t);
    const b = Math.round(fromRef.current.b + (targetRef.current.b - fromRef.current.b) * t);
    setValue(t >= 1 ? target : toHex(r, g, b));
  });

  return value;
}

function parseHex(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex(r, g, b) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}
