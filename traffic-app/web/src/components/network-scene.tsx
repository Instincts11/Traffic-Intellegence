"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function NetworkMesh({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const group = useRef<Group>(null);
  const nodes = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const ring = Math.floor(i / 12);
      const a = ((i % 12) / 12) * Math.PI * 2 + ring * 0.2;
      const r = 1.4 + ring * 1.15 + hash(i) * 0.35;
      return {
        i,
        p: [Math.cos(a) * r, (hash(i + 3) - 0.5) * 0.4, Math.sin(a) * r] as [
          number,
          number,
          number,
        ],
        attention: 0.2 + hash(i + 7) * 0.8,
      };
    });
  }, []);

  const edges = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      const n = 2 + Math.floor(hash(i + 21) * 3);
      for (let k = 1; k <= n; k++) {
        const j = (i + k * 5) % nodes.length;
        list.push([i, j]);
      }
    }
    return list;
  }, [nodes]);

  useFrame((s) => {
    if (group.current) group.current.rotation.y = s.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={group}>
      {edges.map(([a, b], i) => {
        const hot = a === selected || b === selected;
        return (
          <Line
            key={i}
            points={[nodes[a].p, nodes[b].p]}
            color={hot ? "#f43e01" : "#69695d"}
            lineWidth={hot ? 1.8 : 0.7}
            transparent
            opacity={hot ? 0.95 : 0.28}
          />
        );
      })}
      {nodes.map((n) => (
        <NodeDot
          key={n.i}
          position={n.p}
          hot={n.i === selected}
          attention={n.attention}
          onClick={() => onSelect(n.i)}
        />
      ))}
    </group>
  );
}

function NodeDot({
  position,
  hot,
  attention,
  onClick,
}: {
  position: [number, number, number];
  hot: boolean;
  attention: number;
  onClick: () => void;
}) {
  const ref = useRef<Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const pulse = 0.12 + attention * 0.1 + (hot ? Math.sin(s.clock.elapsedTime * 4) * 0.04 : 0);
    ref.current.scale.setScalar(pulse * 8);
  });
  return (
    <mesh ref={ref} position={position} onClick={onClick}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={hot ? "#f43e01" : "#f3f3ee"}
        emissive={hot ? "#f43e01" : "#cecebf"}
        emissiveIntensity={hot ? 1.2 : 0.15}
      />
    </mesh>
  );
}

export function NetworkScene() {
  const [selected, setSelected] = useState(7);

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-[10px] bg-[#1f1f1b]">
      <Canvas camera={{ position: [0, 5.5, 8], fov: 45 }}>
        <color attach="background" args={["#1f1f1b"]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 4, 3]} intensity={20} color="#f43e01" distance={16} />
        <directionalLight position={[6, 8, 4]} intensity={0.8} />
        <NetworkMesh selected={selected} onSelect={setSelected} />
        <Html position={[0, 3.2, 0]} center>
          <div className="pointer-events-none rounded-[5px] bg-[#2a2a25] px-3 py-1 font-mono text-[11px] tracking-[0.12em] text-[#f43e01] uppercase">
            GAT attention · node {selected.toString().padStart(3, "0")}
          </div>
        </Html>
        <OrbitControls enablePan={false} minDistance={5} maxDistance={14} />
      </Canvas>
    </div>
  );
}
