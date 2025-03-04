"use client";

import { useEffect, useState } from "react";

interface Coordinates {
  lat: number | null;
  lon: number | null;
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

interface Edge {
  source: string;
  target: string;
}

const useGetModelData = () => {
  const [nodeData, setNodeData] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [title, setTitle] = useState<string>("");

  // Map from friendly names to internal filenames
  const modelNameMap: Record<string, string> = {
    "Merced River": "merced_pywr_model_updated",
    "Tuolumne River": "tuolumne_pywr_model_updated",
    "San Joaquin River": "upper_san_joaquin_pywr_model_updated",
    "Stanislaus River": "stanislaus_pywr_model_updated",
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const allData = await Promise.all(
          Object.keys(modelNameMap).map(async (modelName) => {
            const internalModelName = modelNameMap[modelName];
            if (!internalModelName) return { nodes: [], metadata: {}, edges: [] };
            const response = await fetch(`/models/${internalModelName}.json`);
            const data = await response.json();
            return data;
          })
        );

        // Combine nodes from all models.
        const combinedNodes = allData.flatMap((data) => {
          return data.nodes.map((node: { name: string; coordinates?: number[]; type?: string }) => {
            const { name, type, coordinates, ...rest } = node;
            return {
              name,
              type,
              coordinates: coordinates
                ? { lat: coordinates[0], lon: coordinates[1] }
                : { lat: null, lon: null },
              attributes: rest as NodeAttributes, // Include dynamic attributes with type safety
            };
          });
        });
        setNodeData(combinedNodes);

        // Combine edges from all models (if available)
        const combinedEdges = allData.flatMap((data) => data.edges ? data.edges.map(([source, target]: [string, string]) => ({ source, target })) : []);
        setEdges(combinedEdges);

        // Set title based on number of models
        const titles = allData.map(
          (data, index) => data.metadata?.title || Object.keys(modelNameMap)[index]
        );
        setTitle(titles.join(" | "));

        // Log the fetched data
        console.log("Fetched data:", { combinedNodes, combinedEdges, title });

      } catch (error) {
        console.error("Error loading the JSON data:", error);
        setNodeData([]);
        setEdges([]);
        setTitle("Error Loading Title");
      }
    };

    fetchAllData();
  }, []); // Empty dependency array to run only once

  return { nodeData, title, edges };
};

export default useGetModelData;