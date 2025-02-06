"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";

type MapSideBarProps = {
  onModelChange: (model: string) => void;
  onStyleChange: (style: string) => void;
  onTypeChange: (type: string) => void;
};

const MapSideBar: React.FC<MapSideBarProps> = ({
  onModelChange,
  onStyleChange,
  onTypeChange,
}) => {
  const [selectedModel, setSelectedModel] = useState("Merced River");
  const [selectedStyle, setSelectedStyle] = useState(
    "mapbox://styles/mapbox/streets-v11"
  );
  const [selectedType, setSelectedType] = useState("All");

  const models = [
    "Merced River",
    "Tuolumne River",
    "San Joaquin River",
    "Stanislaus River",
  ];

  const toggleMapStyle = () => {
    const newStyle =
      selectedStyle === "mapbox://styles/mapbox/streets-v11"
        ? "mapbox://styles/mapbox/satellite-streets-v11"
        : "mapbox://styles/mapbox/streets-v11";
    setSelectedStyle(newStyle);
    onStyleChange(newStyle); // Notify parent of style change
  };

  return (
    <div
      style={{
        position: "relative",
        height: "700px",
        width: "100%",
        padding: "10px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "white",
          padding: "20px", // Keep padding for overall space
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          zIndex: 1,
          width: "260px", // Reduced width for the menu
          height: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Model Selection */}
        <div style={{ marginBottom: "20px" }}>
            <label htmlFor="modelSelect">Model:</label>
            <motion.select
                id="modelSelect"
                value={selectedModel}
                onChange={(e) => {
                const newModel = e.target.value;
                setSelectedModel(newModel);
                onModelChange(newModel); // Notify parent of model change
                }}
                whileHover={{ scale: 1.05 }} // Add hover effect to the select
                whileTap={{ scale: 0.95 }} // Add tap effect to the select
                style={{ width: "100%" }} // Optionally, you can make the select fill the available width
            >
                {models.map((model) => (
                <option key={model} value={model}>
                    {model}
                </option>
                ))}
            </motion.select>
        </div>
  
        {/* Type Selection */}
        <motion.div
          style={{ marginBottom: "20px" }} // Increased vertical spacing
          whileHover={{ scale: 1.00 }}
          whileTap={{ scale: 1.00 }}
        >
          <label htmlFor="typeFilter">Type:</label>
          <motion.select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => {
              const newType = e.target.value;
              setSelectedType(newType);
              onTypeChange(newType); // Notify parent of type change
            }}
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.90 }}
            style={{ width: "120px" }}
          >
            <option value="All">All</option>
            <option value="Reservoir">Reservoir</option>
            <option value="Hydropower">Hydropower</option>
          </motion.select>
        </motion.div>
  
        {/* Style Toggle */}
        <motion.button
          onClick={toggleMapStyle}
          style={{
            padding: "10px 20px", // Increased padding for a bigger button
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "3px",
            height: "40px", // Make button a bit taller
            minWidth: "100px",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {selectedStyle === "mapbox://styles/mapbox/satellite-streets-v11"
            ? "Standard"
            : "Satellite"}
        </motion.button>
      </div>
    </div>
  );
};

export default MapSideBar;