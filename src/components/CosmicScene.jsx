import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGlobalScroll } from '../scrollControl';

export default function CosmicScene() {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(0x000000);
  }, [scene]);
  const starRef = useRef();
  const { progress } = useGlobalScroll();

  // Generate stars only once
  const stars = useMemo(() => {
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 1000;
    }
    return positions;
  }, []);

  // Star material
  const starMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color(1, 1, 1),
      size: 0.7,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  // Animate subtle movement
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (starRef.current) {
      starRef.current.rotation.y = t * 0.05;
      starRef.current.position.y = -progress * 100 * 0.02; // scale progress (0-1) to match old scroll
    }
  });

  return (
    <>
      {/* Starfield */}
      <points ref={starRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={stars.length / 3}
            array={stars}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={starMaterial} attach="material" />
      </points>
    </>
  );
}