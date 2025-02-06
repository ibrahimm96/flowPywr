"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useGetModelData from "@/hooks/useGetModelData";
import "./mapSidebarStyles.css";

/* Will Add Sidebar functionality soon, for now it is a fixed floating menu */

type MapSideBarProps = {
  onModelChange: (model: string) => void;
  onStyleChange: (style: string) => void;
  onTypeChange: (type: string) => void;
};

// Map Sidebar Component
const MapSidebar: React.FC<MapSideBarProps> = ({
  onModelChange,
  onStyleChange,
  onTypeChange,
}) => {
  const [selectedModel, setSelectedModel] = useState("Merced River");
  const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/streets-v11");
  const [selectedType, setSelectedType] = useState("All");

  const models = [
    "Merced River",
    "Tuolumne River",
    "San Joaquin River",
    "Stanislaus River",
  ];

  const { coordinates, title } = useGetModelData(selectedModel); // Fetch data when model changes
  console.log("*SIDEBAR DATA REQUEST*", coordinates)
  
  useEffect(() => {
    onModelChange(selectedModel); // Notify parent of model change whenever the model changes
  }, [selectedModel, onModelChange]);

  const toggleMapStyle = () => {
    const newStyle =
      selectedStyle === "mapbox://styles/mapbox/streets-v11"
        ? "mapbox://styles/mapbox/satellite-streets-v11"
        : "mapbox://styles/mapbox/streets-v11";
    setSelectedStyle(newStyle);
    onStyleChange(newStyle); // Notify parent of style change
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        {/* Model Selection */}
        <div className="model-select">
          <label htmlFor="modelSelect">Model:</label>
          <motion.select
            id="modelSelect"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)} // Set selected model
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </motion.select>
        </div>
  
        {/* Type Selection */}
        <div className="type-select">
          <label htmlFor="typeFilter">Type:</label>
          <motion.select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => {
              const newType = e.target.value;
              setSelectedType(newType);
              onTypeChange(newType); // Notify parent of type change
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <option value="All">All</option>
            <option value="Reservoir">Reservoir</option>
            <option value="Hydropower">Hydropower</option>
          </motion.select>
        </div>
  
        {/* Style Toggle */}
        <motion.button
          onClick={toggleMapStyle}
          className="style-toggle-button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {selectedStyle === "mapbox://styles/mapbox/satellite-streets-v11" ? "Standard" : "Satellite"}
        </motion.button>
  
        {/* Coordinates Data Display */}
        {coordinates && coordinates.length > 0 ? (
          <div className="coordinates-data">
            <h3>{title}</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {coordinates.map((coordinate, index) =>
                coordinate.coordinates.lat && coordinate.coordinates.lon ? (
                  <li key={index} style={{ marginBottom: "20px" }}>
                    <div
                      className={`coordinate-name ${coordinate.type ? coordinate.type.toLowerCase() : ""}`}
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                        color:
                          coordinate.type === "Reservoir"
                            ? "blue"
                            : coordinate.type === "Hydropower"
                            ? "red"
                            : "black", // Conditional color
                      }}
                    >
                      {coordinate.name}
                    </div>
                    <div className="coordinate-details">
                      <strong>Type:</strong> {coordinate.type || "Unknown"} {/* Fallback to "Unknown" if type is undefined */}
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        ) : (
          <p>No coordinates available for the selected model.</p>
        )}
      </div>
    </div>
  );
};

export default MapSidebar;