import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CosmicVortex() {
  const vortexRef = useRef();

  const vortex = useMemo(() => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const radius = 300;
    const spiralTurns = 8;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 * spiralTurns;
      const r = (i / particleCount) * radius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = (Math.random() - 0.5) * 200;
      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (vortexRef.current) {
      vortexRef.current.rotation.z = t * 0.03;
      vortexRef.current.rotation.y = t * 0.01;
    }
  });

  return (
    <points ref={vortexRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={vortex.length / 3}
          array={vortex}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color(0.4, 0.7, 1)}
        size={1.5}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
}