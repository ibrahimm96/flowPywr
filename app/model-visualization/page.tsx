"use client";

import React, { useState } from "react";
import MapSideBar from "@/components/mapSideBar"; 
import Map from "@/components/map";

const models = [
  "Merced River",
  "Tuolumne River",
  "San Joaquin River",
  "Stanislaus River",
];

export default function ModelVisualization() {
  const [selectedModel, setSelectedModel] = useState(models[0]); // default
  const [selectedStyle, setSelectedStyle] = useState(
    "mapbox://styles/mapbox/streets-v11"
  );
  const [selectedType, setSelectedType] = useState("All");

  const modelNames = {
    "Merced River": "merced_pywr_model_updated",
    "Tuolumne River": "tuolumne_pywr_model_updated",
    "San Joaquin River": "upper_san_joaquin_pywr_model_updated",
    "Stanislaus River": "stanislaus_pywr_model_updated",
  };

  return (
    <div className="relative h-screen">
      {/* Map Section */}
      <div className="flex h-full">
        {/* Floating Sidebar */}
        <div className="h-screen w-[250px] bg-gray-800">
          <MapSideBar
            onModelChange={(model) => setSelectedModel(model)}
            onStyleChange={(style) => setSelectedStyle(style)}
            onTypeChange={(type) => setSelectedType(type)}
          />
        </div>
  
        {/* Map Section, filling 250px to the left */}
        <div className="h-full w-full -ml-[250px]">
          <Map
            modelName={modelNames[selectedModel as keyof typeof modelNames]}
            type={selectedType}
            style={selectedStyle}
          />
        </div>
      </div>
    </div>
  );
}