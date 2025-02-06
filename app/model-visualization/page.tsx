"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MapSidebar from "@/components/mapSidebar";
import Map from "@/components/map";
import { FaSpinner } from 'react-icons/fa';

const models = [
  "Merced River",
  "Tuolumne River",
  "San Joaquin River",
  "Stanislaus River",
];

export default function ModelVisualization() {
  const [selectedModel, setSelectedModel] = useState(models[0]); // default model
  const [selectedType, setSelectedType] = useState("All"); // default filter
  const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/streets-v11"); // default map style
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => { // Timer for initial mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 0.5s

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <FaSpinner fontSize={'40px'} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} // Start fully transparent
      animate={{ opacity: 1 }} // Fade in completely
      transition={{ duration: 1.5, ease: "easeInOut" }} // Effect lasts 1.5s
      className="relative h-screen"
    >
      <div className="relative h-screen">
        <div className="flex h-full">
          {/* Menu */}
          <div className="h-screen w-[250px] bg-gray-800">
            <MapSidebar
              onModelChange={(model) => setSelectedModel(model)}
              onStyleChange={(style) => setSelectedStyle(style)}
              onTypeChange={(type) => setSelectedType(type)}
            />
          </div>
    
          {/* Map */}
          <div className="h-full w-full -ml-[250px]">
            <Map
              modelName={selectedModel} // Directly pass the selected model
              type={selectedType}
              style={selectedStyle}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}