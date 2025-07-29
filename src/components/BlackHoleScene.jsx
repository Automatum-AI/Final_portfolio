import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProgressRef } from '../scrollControl';

export default function BlackHoleScene() {
  const coreRef = useRef();
  const diskRef = useRef();
  const haloRef = useRef();
  const lightBendingRef = useRef();
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scroll = scrollProgressRef.current;

    // improved scroll interpolation
    const initialZ = -200;
    const targetZ = -30;
    const scrollMax = 5000;
    const scrollNorm = Math.min(scroll / scrollMax, 1);
    const newZ = initialZ + (targetZ - initialZ) * scrollNorm;

    const distanceFactor = 1 - (newZ - targetZ) / (initialZ - targetZ);
    const scale = 1 + distanceFactor * 3;

    // animate disk and core rotation
    if (diskRef.current) {
      diskRef.current.position.z = newZ;
      diskRef.current.scale.set(scale, scale, scale);
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.1;
      coreRef.current.position.z = newZ;
      coreRef.current.scale.set(scale, scale, scale);
    }

    if (haloRef.current) {
      haloRef.current.position.z = newZ;
      haloRef.current.scale.set(scale, scale, scale);
    }

    if (lightBendingRef.current) {
      lightBendingRef.current.rotation.z = t * 0.05;
      lightBendingRef.current.position.z = newZ;
      lightBendingRef.current.scale.set(scale, scale, scale);
    }

  });

  return (
    <>
      {/* Black Hole Core */}
      <mesh ref={coreRef} position={[0, 0, -50]}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial
          emissive={new THREE.Color(0.05, 0.05, 0.05)}
          emissiveIntensity={3}
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      {/* Accretion Disk */}
      <mesh ref={diskRef} position={[0, 0, -50]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[20, 0.6, 64, 256]} />
        <meshStandardMaterial
          color={new THREE.Color(1, 1, 1)}
          emissive={new THREE.Color(1, 1, 1)}
          emissiveIntensity={6}
          roughness={0.05}
          metalness={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gravitational Halo */}
      <mesh ref={haloRef} position={[0, 0, -50]} rotation={[0, 0, 0]}>
        <torusGeometry args={[22, 0.2, 64, 256]} />
        <meshStandardMaterial
          color={new THREE.Color(1, 1, 1)}
          emissive={new THREE.Color(1, 1, 1)}
          emissiveIntensity={3.5}
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Light Bending Ring */}
      <mesh ref={lightBendingRef} position={[0, 0, -50]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[24, 28, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(1, 1, 1)}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lighting */}
      <pointLight position={[0, 0, -30]} intensity={2} color={0xffaa88} />
      <ambientLight intensity={0.1} />
    </>
  );
}
