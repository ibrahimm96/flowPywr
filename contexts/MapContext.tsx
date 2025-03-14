"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ComponentData {
  name: string;
  coordinates: { lat: number | null; lon: number | null };
  type?: string;
  attributes?: Record<string, unknown>;
}

interface MapContextProps {
  style: string;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  selectedModels: string[];
  setSelectedModels: React.Dispatch<React.SetStateAction<string[]>>;
  showFlow: boolean;
  setShowFlow: React.Dispatch<React.SetStateAction<boolean>>;
  onComponentClick: (node: ComponentData | null) => void;
  setOnComponentClick: React.Dispatch<React.SetStateAction<(node: ComponentData | null) => void>>;
  lastSelectedNode: ComponentData | null;
  setLastSelectedNode: React.Dispatch<React.SetStateAction<ComponentData | null>>;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyle] = useState("mapbox://styles/ibrahimm96/cm7ch4lom006n01sogpqdguxa");
  const [type, setType] = useState("All");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [showFlow, setShowFlow] = useState(false);
  const [onComponentClick, setOnComponentClick] = useState<(node: ComponentData | null) => void>(() => () => {});
  const [lastSelectedNode, setLastSelectedNode] = useState<ComponentData | null>(null); // Add state for last selected node

  return (
    <MapContext.Provider
      value={{
        style,
        setStyle,
        type,
        setType,
        selectedModels,
        setSelectedModels,
        showFlow,
        setShowFlow,
        onComponentClick,
        setOnComponentClick,
        lastSelectedNode,
        setLastSelectedNode, // Provide setter for last selected node
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};