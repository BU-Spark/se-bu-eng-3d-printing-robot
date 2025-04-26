/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

const STLViewer = ({ stlUrl }: { stlUrl: string | null }) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (stlUrl) {
      fetchSTL(stlUrl);
    }
  }, [stlUrl]);

  const fetchSTL = async (url: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to load STL: ${response.statusText}`);

      const arrayBuffer = await response.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("STL file is empty or corrupt");
      }

      const loader = new STLLoader();
      const geo = loader.parse(arrayBuffer);
      setGeometry(geo);
    } catch (error) {
      console.error("STL Load Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
      />

      {/* OrbitControls with autoRotate */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enableDamping
        dampingFactor={0.1}
      />

      {isLoading ? (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" wireframe />
        </mesh>
      ) : geometry ? (
        <mesh geometry={geometry} scale={[0.06, 0.06, 0.06]}>
          <meshStandardMaterial
            color="#CC00000"
            roughness={0}
            metalness={1}
            emissive={new THREE.Color(0.3, 0, 0)}
            flatShading
            wireframe
          />
        </mesh>
      ) : (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" wireframe />
        </mesh>
      )}
    </Canvas>
  );
};

export default STLViewer;
