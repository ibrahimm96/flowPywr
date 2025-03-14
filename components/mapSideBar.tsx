"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMapContext } from "@/contexts/MapContext";
import "./mapSidebarStyles.css";

const MapSidebar: React.FC = () => {
  const { style, setStyle, type, setType, selectedModels, setSelectedModels, showFlow, setShowFlow, lastSelectedNode } = useMapContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to track sidebar visibility
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleMapStyle = () => {
    const newStyle =
      style === "mapbox://styles/ibrahimm96/cm7ch4lom006n01sogpqdguxa"
        ? "mapbox://styles/ibrahimm96/cm7feth7600dh01rgha9l5j8c"
        : "mapbox://styles/ibrahimm96/cm7ch4lom006n01sogpqdguxa";
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
    setShowFlow(!showFlow);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="sidebar-container">
      <AnimatePresence>
        {isSidebarVisible && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="sidebar-content"
          >
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
              {style === "mapbox://styles/ibrahimm96/cm7ch4lom006n01sogpqdguxa"
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
              <div
                ref={dropdownRef}
                onClick={handleDropdownToggle}
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
                {type}
              </div>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "100%",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      maxHeight: "150px", // Fixed height for scrollability
                      overflowY: "auto", // Enable vertical scrolling
                    }}
                    onClick={(e) => e.stopPropagation()} // Stop event propagation
                  >
                    {typeOptions.map((option) => (
                      <div
                        key={option}
                        onClick={(e) => {
                          e.stopPropagation(); // Stop event propagation
                          setType(option);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          backgroundColor: type === option ? "#f0f0f0" : "#fff",
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
            {/* Display last selected node data */}
            {lastSelectedNode && (
              <motion.div
                key={lastSelectedNode.name} // key to trigger re-render
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="p-4 bg-gray-200 text-black shadow-lg"
                style={{ maxHeight: "400px", overflowY: "auto", borderRadius: "5px" }}
              >
                <h2 className="text-lg font-bold">{lastSelectedNode.name}</h2>
                <p><strong>Type:</strong> {lastSelectedNode.type}</p>
                <p><strong>Coordinates:</strong> {lastSelectedNode.coordinates.lat}, {lastSelectedNode.coordinates.lon}</p>
                {lastSelectedNode.attributes && (
                  <div>
                    <h3 className="text-md font-bold mt-2">Attributes:</h3>
                    {Object.entries(lastSelectedNode.attributes)
                      .filter(([key]) => key !== "comment") // Filter out the comment attribute
                      .map(([key, value]) => (
                        value !== null && value !== undefined && value !== "" && (
                          <p key={key}><strong>{key}:</strong> {String(value)}</p>
                        )
                      ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="toggle-sidebar-button"
        style={{
          position: "absolute",
          top: "800px",
          left: "126px",
          // transform: "translateY(-50%)",
          zIndex: 1000,
          padding: "10px 15px",
          backgroundColor: "#1e3a8a",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.3s, transform 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#163a8a")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e3a8a")}
      >
        {isSidebarVisible ? "Open" : "Close"}
      </button>
    </div>
  );
};

export default MapSidebar;