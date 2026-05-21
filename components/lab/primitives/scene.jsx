'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

// ─── Bench ─────────────────────────────────────────────────────────────────
// Default workbench surface. Origin centred at y=0; top of bench at y=0.18.
export function Bench({ width = 3, depth = 1.4, tile = true }) {
  return (
    <>
      <mesh position={[0, 0.075, 0]} receiveShadow>
        <boxGeometry args={[width, 0.05, depth]} />
        <meshStandardMaterial color="#d8d2c4" roughness={0.85} />
      </mesh>
      {tile && (
        <mesh position={[0, 0.103, 0]} receiveShadow>
          <boxGeometry args={[1.6, 0.005, 0.8]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.4} />
        </mesh>
      )}
    </>
  );
}

// ─── LabScene ──────────────────────────────────────────────────────────────
// Standard <Canvas> wrapper with lighting, environment, shadows, orbit.
// Pass scene contents as children; pass `orbit={false}` to disable controls.
export function LabScene({
  children,
  cameraPosition = [0, 0.9, 1.8],
  cameraFov = 45,
  background = '#e8e2d4',
  envPreset = 'warehouse',
  orbit = true,
  orbitTarget = [0, 0.4, 0],
  className = '',
}) {
  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: cameraFov }}
      gl={{ antialias: true }}
      className={className}
    >
      <Suspense fallback={null}>
        <color attach="background" args={[background]} />
        <Environment preset={envPreset} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <ambientLight intensity={0.3} />
        {children}
        <ContactShadows position={[0, 0.105, 0]} opacity={0.4} scale={3} blur={2} far={1} />
        {orbit && (
          <OrbitControls
            target={orbitTarget}
            minDistance={0.8}
            maxDistance={3}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.1}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
