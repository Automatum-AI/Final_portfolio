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


  // Trail parameters
  const starCount = 500;
  const trailLength = 30; // number of trail segments per star
  const trailFade = 0.008; // how much opacity fades per segment

  // Each star has a random angle, radius, and speed
  const starData = useMemo(() => {
    return Array.from({ length: starCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 20 + Math.random() * 10,
      y: (Math.random() - 0.5) * 2,
      speed: 0.3 + Math.random() * 0.3,
    }));
  }, []);


  // For trails, we need to update all trail points and their colors per frame
  const trailPositions = useRef(new Float32Array(starCount * trailLength * 5));
  const trailColors = useRef(new Float32Array(starCount * trailLength * 5));
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scroll = scrollProgressRef.current;

    const initialZ = -100;
    const targetZ = -30;
    const scrollNorm = Math.min(scroll / 5000, 1);
    const newZ = initialZ + (targetZ - initialZ) * scrollNorm;
    const distanceFactor = 1 - (newZ - targetZ) / (initialZ - targetZ);
    const scale = 3.5 + distanceFactor * 7.5;

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.1;
      coreRef.current.position.z = newZ;
      coreRef.current.scale.set(scale, scale, scale);
    }

    if (glowRef.current) {
      glowRef.current.position.z = newZ;
      glowRef.current.scale.set(scale * 1.4, scale * 1.4, scale * 1.4);
      glowRef.current.rotation.y = t * 0.2;
      glowRef.current.rotation.x = t * 0.1;
    }

    // Update trail positions
    const arr = trailPositions.current;
    const colorArr = trailColors.current;
    for (let i = 0; i < starCount; i++) {
      const { angle, radius, y, speed } = starData[i];
      for (let j = 0; j < trailLength; j++) {
        const trailT = t - j * 0.015;
        const a = (angle + trailT * speed) % (Math.PI * 2);
        const r = radius;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const yTrail = y + Math.sin(trailT * 0.5 + i) * 0.5 * (i % 2 === 0 ? 1 : -1);
        const idx = (i * trailLength + j) * 3;
        arr[idx] = x;
        arr[idx + 1] = yTrail;
        arr[idx + 2] = z;
        // Color: pure deep orange trail (no white)
        const fade = (trailLength - j) / trailLength;
        colorArr[idx] = 1.0 * fade; // R
        colorArr[idx + 1] = 0.3 * fade; // G
        colorArr[idx + 2] = 0.0; // B
      }
    }
    if (starGeometryRef.current) {
      starGeometryRef.current.attributes.position.array.set(arr);
      starGeometryRef.current.attributes.position.needsUpdate = true;
      if (starGeometryRef.current.attributes.color) {
        starGeometryRef.current.attributes.color.array.set(colorArr);
        starGeometryRef.current.attributes.color.needsUpdate = true;
      }
    }
    if (starsRef.current) {
      starsRef.current.position.z = newZ;
      starsRef.current.scale.set(scale, scale, scale);
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI / 10;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Black Hole Core */}
        <mesh ref={coreRef} position={[0, 0, -50]}>
          <sphereGeometry args={[10, 64, 64]} />
          <meshStandardMaterial
            color="black"
            metalness={0.9}
            roughness={0.4}
          />
        </mesh>

        {/* Glow Around Core */}
        <mesh ref={glowRef} position={[0, 0, -50]}>
          <sphereGeometry args={[7.5, 64, 64]} />
          <meshStandardMaterial
            emissive={new THREE.Color('orange')}
            emissiveIntensity={5}
            transparent
            opacity={200}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            roughness={0.5}
            metalness={1}
          />
        </mesh>

        {/* Spiral Stars (Accretion Disk) with Trails */}
        <points ref={starsRef} position={[0, 0, -50]}>
          <bufferGeometry ref={starGeometryRef}>
            <bufferAttribute
              attach="attributes-position"
              count={trailPositions.current.length / 7}
              array={trailPositions.current}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={trailColors.current.length / 3}
              array={trailColors.current}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.5}
            sizeAttenuation={true}
            transparent={true}
            vertexColors={true}
            opacity={0.6}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
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
      <pointLight position={[0, 0, -30]} intensity={100} color={0xffcc88} />
      <ambientLight intensity={0.09} />
    </>
  );
}