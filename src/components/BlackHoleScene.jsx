import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProgressRef } from '../scrollControl';

export default function BlackHoleScene() {
  const coreRef = useRef();
  const glowRef = useRef();
  const starsRef = useRef();
  const starGeometryRef = useRef();
  const groupRef = useRef();
  const { camera } = useThree();

  const starCount = 2000;

  const starPositions = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 10;
      const y = (Math.random() - 0.5) * 2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  const starVelocities = useMemo(() => {
    const velocities = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      velocities[i] = 0.01 + Math.random() * 0.02; // angular speed
    }
    return velocities;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scroll = scrollProgressRef.current;

    const initialZ = -200;
    const targetZ = -30;
    const scrollNorm = Math.min(scroll / 5000, 1);
    const newZ = initialZ + (targetZ - initialZ) * scrollNorm;
    const distanceFactor = 1 - (newZ - targetZ) / (initialZ - targetZ);
    const scale = 1 + distanceFactor * 3;

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.1;
      coreRef.current.position.z = newZ;
      coreRef.current.scale.set(scale, scale, scale);
    }

    if (glowRef.current) {
      glowRef.current.position.z = newZ;
      glowRef.current.scale.set(scale * 1.4, scale * 1.4, scale * 1.4);
    }

    if (starsRef.current && starGeometryRef.current) {
      const positions = starGeometryRef.current.attributes.position.array;
      for (let i = 0; i < starCount; i++) {
        const angle = t * starVelocities[i] + i;
        const radius = 20 + (i % 100) * 0.1;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (i % 2 === 0 ? 1 : -1) * Math.sin(t * 0.5 + i) * 0.5;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      starGeometryRef.current.attributes.position.needsUpdate = true;

      starsRef.current.position.z = newZ;
      starsRef.current.scale.set(scale, scale, scale);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI / 10; // slight tilt
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Black Hole Core */}
        <mesh ref={coreRef} position={[0, 0, -50]}>
          <sphereGeometry args={[10, 64, 64]} />
          <meshBasicMaterial color="black" />
        </mesh>

        {/* Glow Around Core */}
        <mesh ref={glowRef} position={[0, 0, -50]}>
          <sphereGeometry args={[10.5, 64, 64]} />
          <meshBasicMaterial
            color={new THREE.Color(1, 0.8, 0.2)}
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Spiral Stars (Accretion Disk) */}
        <points ref={starsRef} position={[0, 0, -50]}>
          <bufferGeometry ref={starGeometryRef}>
            <bufferAttribute
              attach="attributes-position"
              count={starPositions.length / 3}
              array={starPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.4}
            sizeAttenuation
            transparent
            opacity={0.8}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color={new THREE.Color(1, 0.9, 0.6)}
          />
        </points>

        {/* Light Bending (Gravitational Lensing Ring) */}
        <mesh position={[0, 0, -50]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[24, 26, 128]} />
          <meshBasicMaterial
            color={new THREE.Color(1, 1, 1)}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Lighting */}
      <pointLight position={[0, 0, -30]} intensity={3} color={0xffcc88} />
      <ambientLight intensity={0.05} />
    </>
  );
}