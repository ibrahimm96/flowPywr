"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import useGetModelData from "@/hooks/useGetModelData";

interface Coordinates {
  lat: number | null;
  lon: number | null;
}

interface Edge {
  source: string;
  target: string;
}

interface NodeAttributes {
  comment?: string;
  min_volume?: number;
  initial_volume?: number;
  max_volume?: number;
  level?: string;
  cost?: string;
  gauge?: string;
  turbine_capacity?: string;
  flow_capacity?: string;
  water_elevation_reservoir?: string;
  tailwater_elevation?: number;
  costs?: number[];
  max_flows?: (string | null)[];
  nsteps?: number;
  head?: number;
  min_flow_cost?: number;
  min_flows?: string;
  max_flow_cost?: number;
  ifr_type?: string;
  max_flow?: number;
}

interface Node<T = NodeAttributes> {
  name: string;
  coordinates: Coordinates;
  type?: string;
  attributes?: T; // Dynamic attributes
}

interface DataContextProps {
  nodeData: Node[]; 
  edges: Edge[];
  modelNames: string[];
  setModelNames: React.Dispatch<React.SetStateAction<string[]>>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [modelNames, setModelNames] = useState(["Merced River", "Tuolumne River", "San Joaquin River", "Stanislaus River"]);
  const { nodeData, edges } = useGetModelData(modelNames); // Will only run on modelName change, but modelNames are pre-set and will not change
    
  return (
    <DataContext.Provider value={{ nodeData, edges, modelNames, setModelNames }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};