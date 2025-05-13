import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import { ArrowHelper, Vector3 } from 'three';

interface BlochSphereProps {
  x: number; y: number; z: number;
}

export default function BlochSphere({ x, y, z }: BlochSphereProps) {
  // Prepare the ArrowHelper object exactly once per change
  const arrow = useMemo(() => {
    const dir = new Vector3(x, y, z).normalize();
    const origin = new Vector3(0, 0, 0);
    const length = Math.sqrt(x*x + y*y + z*z);
    return new ArrowHelper(dir, origin, length, 0xffaa00, 0.1, 0.05);
  }, [x, y, z]);

  return (
    <Canvas style={{ height: 300, width: 300, background: '#111' }}>
      <OrbitControls enablePan={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Wireframe Sphere */}
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial wireframe opacity={0.3} transparent />
      </Sphere>

      {/* ArrowHelper primitive */}
      <primitive object={arrow} />

      {/* Label */}
      <Html position={[x, y, z]} center>
        <div style={{ color: 'white', fontSize: 12 }}>
          ({x.toFixed(2)}, {y.toFixed(2)}, {z.toFixed(2)})
        </div>
      </Html>
    </Canvas>
  );
}
