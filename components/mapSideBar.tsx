"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useGetModelData from "@/hooks/useGetModelData";

/* Will Add Sidebar functionality soon, for now it is a fixed floating menu */

type MapSideBarProps = {
  onModelChange: (model: string) => void;
  onStyleChange: (style: string) => void;
  onTypeChange: (type: string) => void;
};

// Map Sidebar Component
const MapSideBar: React.FC<MapSideBarProps> = ({
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
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          zIndex: 1,
          width: "260px",
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
            onChange={(e) => setSelectedModel(e.target.value)} // Set selected model
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ width: "100%" }}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </motion.select>
        </div>
  
        {/* Type Selection */}
        <motion.div style={{ marginBottom: "20px" }} whileHover={{ scale: 1.00 }} whileTap={{ scale: 1.00 }}>
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
            height: "40px",
            minWidth: "100px",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {selectedStyle === "mapbox://styles/mapbox/satellite-streets-v11"
            ? "Standard"
            : "Satellite"}
        </motion.button>
        {/* Coordinates Data Display */}
        <div
        style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            maxHeight: "300px", // Adjust height as needed
            overflowY: "auto", // Add vertical scroll
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        >
        <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px" }}>
            Model Data
        </h3>
        {coordinates && coordinates.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
            {coordinates.map((coordinate, index) => (
                <li key={index} style={{ marginBottom: "20px" }}>
                <div
                    style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    textDecoration: "underline",
                    }}
                >
                    {coordinate.name}
                </div>
                <div style={{ fontSize: "1rem", marginBottom: "8px" }}>
                    <strong>Type:</strong> {coordinate.type}
                </div>
                <div style={{ fontSize: "1rem" }}>
                    <strong>Coordinates:</strong>{" "}
                    Latitude: {coordinate.coordinates.lat}, Longitude:{" "}
                    {coordinate.coordinates.lon}
                </div>
                </li>
            ))}
            </ul>
        ) : (
            <p style={{ fontSize: "1rem", color: "#6c757d" }}>
            No coordinates available for the selected model.
            </p>
        )}
        </div>
      </div>
    </div>
  );
};

export default MapSideBar;