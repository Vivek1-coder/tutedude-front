"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const AnimatedSphere = () => {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#006d77" roughness={0.2} metalness={0.8} />
    </mesh>
  );
};

export const Hero3D = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f3f4] to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-[#293241] dark:text-white mb-6"
        >
          Ethical<span className="text-[#006d77]">MD</span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl md:text-2xl text-[#293241]/80 dark:text-gray-300 mb-8 leading-relaxed"
        >
          AI-powered healthcare assistant with explainable diagnosis,
          <br />
          lab report interpretation, and ethical transparency.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#006d77] hover:bg-[#006d77]/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f28482] hover:bg-[#f28482]/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-[#006d77] rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-[#006d77] rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
