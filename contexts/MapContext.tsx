"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MapContextProps {
  style: string;
  setStyle: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  modelNames: string[];
  setModelNames: React.Dispatch<React.SetStateAction<string[]>>;
  showFlow: boolean;
  setShowFlow: React.Dispatch<React.SetStateAction<boolean>>;
  onComponentClick?: (node: {
    name: string;
    coordinates: { lat: number | null; lon: number | null };
    type?: string;
  } | null) => void;
  setOnComponentClick: React.Dispatch<React.SetStateAction<((node: {
    name: string;
    coordinates: { lat: number | null; lon: number | null };
    type?: string;
  } | null) => void) | undefined>>;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyle] = useState("mapbox://styles/ibrahimm96/cm7ch4lom006n01sogpqdguxa");
  const [type, setType] = useState("All");
  const [modelNames, setModelNames] = useState(["Merced River", "Tuolumne River", "San Joaquin River", "Stanislaus River"]);
  const [showFlow, setShowFlow] = useState(false);
  const [onComponentClick, setOnComponentClick] = useState<((node: {
    name: string;
    coordinates: { lat: number | null; lon: number | null };
    type?: string;
  } | null) => void) | undefined>(undefined);

  return (
    <MapContext.Provider value={{ style, setStyle, type, setType, modelNames, setModelNames, showFlow, setShowFlow, onComponentClick, setOnComponentClick }}>
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