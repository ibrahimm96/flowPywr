"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMapContext } from "@/contexts/MapContext"; // Import useMapContext
import "./mapSidebarStyles.css";

const MapSidebar: React.FC = () => {
  const { style, setStyle, type, setType, modelNames, setModelNames, showFlow, setShowFlow } = useMapContext();
  const [selectedModels, setSelectedModels] = useState<string[]>(modelNames);
  const [selectedStyle, setSelectedStyle] = useState(style);
  const [selectedType, setSelectedType] = useState(type);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const models = [
    "Merced River",
    "Tuolumne River",
    "San Joaquin River",
    "Stanislaus River",
  ];

  const typeOptions = [
    "All",
    "Reservoir",
    "Hydropower",
    "Catchment",
    "Link",
    "River",
    "InstreamFlowRequirement",
    "BreakLink",
    "Output",
  ];

  useEffect(() => {
    setModelNames(selectedModels); // Update modelNames in MapContext
  }, [selectedModels, setModelNames]);


  const toggleMapStyle = () => {
    const newStyle =
      selectedStyle === "mapbox://styles/ibrahimm96/cm7ch4lom006n01sogpqdguxa"
        ? "mapbox://styles/ibrahimm96/cm7feth7600dh01rgha9l5j8c"
        : "mapbox://styles/ibrahimm96/cm7ch4lom006n01sogpqdguxa";
    setSelectedStyle(newStyle);
    setStyle(newStyle);
  };

  const handleModelToggle = (model: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(model)) {
        return prev.filter((m) => m !== model);
      } else {
        return [...prev, model];
      }
    });
  };

  const toggleShowFlow = () => {
    const newShowFlow = !showFlow;
    setShowFlow(newShowFlow);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        {/* Map Style Toggle Button */}
        <motion.button
          onClick={toggleMapStyle}
          className="style-toggle-button"
          style={{
            backgroundColor: "#1e3a8a",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            marginBottom: "20px",
            width: "100%",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {selectedStyle === "mapbox://styles/ibrahimm96/cm7ch4lom006n01sogpqdguxa"
            ? "Switch Satellite"
            : "Switch Standard"}
        </motion.button>

        {/* Model Selection - Multi-select Checkbox */}
        <div className="model-select" style={{ marginBottom: "20px" }}>
          <label
            htmlFor="modelSelect"
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
              color: "#000",
            }}
          >
            Select Model
          </label>
          <div id="modelSelect">
            {models.map((model) => (
              <label
                key={model}
                style={{
                  display: "block",
                  marginBottom: "5px",
                  cursor: "pointer",
                  color: "#000",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model)}
                  onChange={() => handleModelToggle(model)}
                  style={{ marginRight: "8px" }}
                />
                {model}
              </label>
            ))}
          </div>
        </div>

        {/* Custom Component Type Dropdown */}
        <div className="type-select" style={{ marginBottom: "20px", position: "relative" }}>
          <label
            htmlFor="typeFilter"
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
              color: "#000",
            }}
          >
            Select Component Type
          </label>
          <motion.div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #ccc",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {selectedType}
          </motion.div>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 10,
                }}
              >
                {typeOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setSelectedType(option);
                      setType(option);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      backgroundColor: selectedType === option ? "#f0f0f0" : "#fff",
                    }}
                  >
                    {option}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Show Flow Button */}
        <motion.button
          onClick={toggleShowFlow}
          className="flow-toggle-button"
          style={{
            backgroundColor: "#4a5568", // dark gray
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            marginBottom: "20px",
            width: "100%",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {showFlow ? "Hide Flow" : "Show Flow"}
        </motion.button>
      </div>
    </div>
  );
};

export default MapSidebar;