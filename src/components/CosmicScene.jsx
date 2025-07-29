import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProgressRef } from '../scrollControl';

export default function CosmicScene() {
  const starRef = useRef();

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
    const scroll = scrollProgressRef.current;


    if (starRef.current) {
      starRef.current.rotation.y = t * 0.05;
      starRef.current.position.y = -scroll * 0.02;
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