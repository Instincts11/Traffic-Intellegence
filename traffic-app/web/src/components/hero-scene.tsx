"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";

function seeded(n: number) {
  const x = Math.sin(n * 999.13) * 43758.5453;
  return x - Math.floor(x);
}

function RoadGraph() {
  const group = useRef<Group>(null);

  const { lines, cars } = useMemo(() => {
    const nodes: [number, number, number][] = [];
    const cols = 8;
    const rows = 6;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const jx = (seeded(x * 11 + y) - 0.5) * 0.35;
        const jy = (seeded(y * 17 + x) - 0.5) * 0.35;
        nodes.push([(x - (cols - 1) / 2) * 1.35 + jx, 0, (y - (rows - 1) / 2) * 1.2 + jy]);
      }
    }

    const lines: [number, number, number][][] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (x < cols - 1) lines.push([nodes[i], nodes[i + 1]]);
        if (y < rows - 1) lines.push([nodes[i], nodes[i + cols]]);
      }
    }

    const cars = lines.slice(0, 22).map((seg, i) => ({
      seg,
      speed: 0.12 + seeded(i + 3) * 0.22,
      offset: seeded(i + 40),
    }));

    return { lines, cars };
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.18;
      group.current.rotation.x = -0.42 + Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
    }
  });

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      {lines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color={i % 7 === 0 ? "#f43e01" : "#9c9c90"}
          lineWidth={i % 7 === 0 ? 1.6 : 1}
          transparent
          opacity={i % 7 === 0 ? 0.9 : 0.35}
        />
      ))}
      {cars.map((car, i) => (
        <MovingDot key={i} seg={car.seg} speed={car.speed} offset={car.offset} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh
          key={`tower-${i}`}
          position={[
            (seeded(i) - 0.5) * 8,
            0.35 + seeded(i + 2) * 0.7,
            (seeded(i + 9) - 0.5) * 6,
          ]}
        >
          <boxGeometry args={[0.12, 0.7 + seeded(i + 4) * 0.9, 0.12]} />
          <meshStandardMaterial color="#cecebf" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function MovingDot({
  seg,
  speed,
  offset,
}: {
  seg: [number, number, number][];
  speed: number;
  offset: number;
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const t = ((state.clock.elapsedTime * speed + offset) % 1);
    const a = seg[0];
    const b = seg[1];
    if (!ref.current || !a || !b) return;
    ref.current.position.set(
      a[0] + (b[0] - a[0]) * t,
      0.06,
      a[2] + (b[2] - a[2]) * t,
    );
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color="#f43e01"
          emissive="#f43e01"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[10px] bg-[#2a2a25] md:h-[520px]">
      <Canvas camera={{ position: [0, 6.2, 7.4], fov: 42 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#2a2a25"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 8, 3]} intensity={1.1} color="#f3f3ee" />
        <pointLight position={[-3, 3, 2]} intensity={12} color="#f43e01" distance={12} />
        <RoadGraph />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.35}
          minPolarAngle={0.7}
          maxPolarAngle={1.15}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <p className="font-mono text-[11px] tracking-[0.14em] text-[#cecebf] uppercase">
          Live graph · 250 nodes · 598 edges
        </p>
        <p className="font-mono text-[11px] tracking-[0.14em] text-[#f43e01] uppercase">
          Ember vehicles
        </p>
      </div>
    </div>
  );
}
