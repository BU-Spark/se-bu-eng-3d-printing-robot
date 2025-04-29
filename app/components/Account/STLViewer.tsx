/* eslint-disable react/no-unknown-property */

import React, { useEffect, useState } from "react";

// Import libraries to render 3D models
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

/**
 * STLViewer Component
 * 
 * A 3D viewer for STL files with the following features:
 * - Loads and displays STL files from URLs
 * - Auto-rotating orbit controls
 * - Loading states and error handling
 * - Customizable material properties
 * 
 * @param {Object} props - Component props
 * @param {string | null} props.stlUrl - URL of the STL file to load
 * @returns {JSX.Element} - The STL viewer component
 */
const STLViewer = ({ stlUrl }: { stlUrl: string | null }) => {
  // State to store the loaded geometry 
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load the STL file when the URL changes
  useEffect(() => {
    if (stlUrl) {
      fetchSTL(stlUrl);
    }
  }, [stlUrl]);

  /**
   * Fetches and parses an STL file from a URL
   * @param {string} url - The URL of the STL file
   * @returns {Promise<void>} - A promise that resolves when the STL file is loaded
   */
  const fetchSTL = async (url: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(url);

      // Check for HTTP errors
      if (!response.ok)
        throw new Error(`Failed to load STL: ${response.statusText}`);

      const arrayBuffer = await response.arrayBuffer();

      // Validate the file content
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("STL file is empty or corrupt");
      }

      // Parse the STL file
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
      {/* Set the camera position */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
      />

      {/* Interactive controls with auto-rotation */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enableDamping
        dampingFactor={0.1}
      />

      {/* Loading state - shows a wireframe cube */}
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
