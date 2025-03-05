"use client";

import { createContext, useContext, ReactNode } from "react";
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

interface Model {
  modelName: string;
  nodeData: Node[];
  edges: Edge[];
}

interface DataContextProps {
  modelData: Model[];
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { modelData } = useGetModelData(); // Fetch model data using the hook

  console.log("*********** FETCHED DATA ************");
  console.log("MODEL DATA:  ", modelData);

  return (
    <DataContext.Provider value={{ modelData }}>
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