'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, Float, Sparkles, useScroll, ScrollControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Fire-like particles component
function FireParticles() {
    const particlesRef = useRef<THREE.Points>(null);
    const count = 200;

    const positionsArray = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 1] = Math.random() * -3 - 2;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
        return pos;
    }, []);

    const velocities = useMemo(() => {
        const vel = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            vel[i * 3] = (Math.random() - 0.5) * 0.02;
            vel[i * 3 + 1] = Math.random() * 0.03 + 0.01;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        return vel;
    }, []);

    useFrame(() => {
        if (!particlesRef.current) return;

        const posAttr = particlesRef.current.geometry.attributes.position;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            if (positions[i * 3 + 1] > 3) {
                positions[i * 3] = (Math.random() - 0.5) * 8;
                positions[i * 3 + 1] = -3;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
            }
        }

        posAttr.needsUpdate = true;
    });

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
        return geo;
    }, [positionsArray]);

    return (
        <points ref={particlesRef} geometry={geometry}>
            <pointsMaterial
                size={0.05}
                color="#B8CE20"
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}


// Animated 3D Text
function AnimatedText3D() {
    const textRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();

    // Scale based on viewport
    const scale = Math.min(viewport.width / 10, 1);

    useFrame((state) => {
        if (!textRef.current) return;
        textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
        textRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    });

    return (
        <group ref={textRef} scale={scale}>
            <Center>
                <Float
                    speed={2}
                    rotationIntensity={0.2}
                    floatIntensity={0.3}
                >
                    <Text3D
                        font="/fonts/Inter_Bold.json"
                        size={1.2}
                        height={0.3}
                        curveSegments={12}
                        bevelEnabled
                        bevelThickness={0.02}
                        bevelSize={0.02}
                        bevelOffset={0}
                        bevelSegments={5}
                    >
                        TALAREF
                        <meshStandardMaterial
                            color="#0a5a8c"
                            metalness={0.6}
                            roughness={0.2}
                            emissive="#003a5c"
                            emissiveIntensity={0.4}
                        />
                    </Text3D>
                </Float>
            </Center>
        </group>
    );
}

// Glowing Logo Mesh
function ForgeHammer() {
    const hammerRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!hammerRef.current) return;
        hammerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 0.2;
        hammerRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.1 + 2;
    });

    return (
        <group ref={hammerRef} position={[3.5, 2, 0]} scale={0.5}>
            {/* Hammer head */}
            <mesh position={[0, 0.5, 0]} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[1.5, 0.8, 0.6]} />
                <meshStandardMaterial
                    color="#B8CE20"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#B8CE20"
                    emissiveIntensity={0.3}
                />
            </mesh>
            {/* Handle */}
            <mesh position={[0.3, -0.5, 0]} rotation={[0, 0, 0.3]}>
                <cylinderGeometry args={[0.15, 0.15, 1.5, 16]} />
                <meshStandardMaterial
                    color="#004269"
                    metalness={0.5}
                    roughness={0.4}
                />
            </mesh>
            {/* Flame glow */}
            <pointLight color="#B8CE20" intensity={2} distance={3} position={[0, 1, 0]} />
        </group>
    );
}

// Background gradient sphere
function BackgroundSphere() {
    return (
        <mesh position={[0, 0, -10]} scale={20}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
                color="#001829"
                side={THREE.BackSide}
            />
        </mesh>
    );
}

// Main 3D Scene
function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#004269" />
            <pointLight position={[0, -2, 2]} intensity={1} color="#B8CE20" />

            <BackgroundSphere />
            <AnimatedText3D />
            <ForgeHammer />
            <FireParticles />

            <Sparkles
                count={100}
                size={2}
                speed={0.5}
                opacity={0.5}
                scale={[15, 10, 10]}
                color="#B8CE20"
            />
        </>
    );
}

// Fallback while loading
function Loader() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#004269" wireframe />
        </mesh>
    );
}

export default function Scene3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
            gl={{ antialias: true, alpha: true }}
        >
            <Suspense fallback={<Loader />}>
                <Scene />
            </Suspense>
        </Canvas>
    );
}
