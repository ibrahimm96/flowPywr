"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MapSidebar from "@/components/mapSidebar";
import Map from "@/components/map";
import { FaSpinner } from "react-icons/fa";

const models = [
  "Merced River",
  "Tuolumne River",
  "San Joaquin River",
  "Stanislaus River",
];

export default function ModelVisualization() {
  // Now an array of selected models
  const [selectedModels, setSelectedModels] = useState<string[]>([models[0]]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/streets-v11");
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<{
    name: string;
    coordinates: { lat: number | null; lon: number | null };
    type?: string;
  } | null>(null);
  // New state for showing flow edges
  const [showFlow, setShowFlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner fontSize={"40px"} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="relative h-screen"
    >
      <div className="relative h-screen">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="h-screen w-[250px] bg-gray-800">
            <MapSidebar
              onModelChange={(models) => setSelectedModels(models)}
              onStyleChange={(style) => setSelectedStyle(style)}
              onTypeChange={(type) => setSelectedType(type)}
              onShowFlowChange={(show) => setShowFlow(show)}
              selectedComponent={selectedComponent}
            />
          </div>
          {/* Map */}
          <div className="h-full w-full -ml-[250px]">
            <Map
              modelNames={selectedModels}
              type={selectedType}
              style={selectedStyle}
              showFlow={showFlow}
              onComponentClick={(component) => setSelectedComponent(component)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
