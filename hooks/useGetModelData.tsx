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

interface Model {
  modelName: string;
  nodeData: Node[];
  edges: Edge[];
}

const useGetModelData = () => {
  const [modelData, setModelData] = useState<Model[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const modelNameMap: Record<string, string> = {
        "Merced River": "merced_pywr_model_updated",
        "Tuolumne River": "tuolumne_pywr_model_updated",
        "San Joaquin River": "upper_san_joaquin_pywr_model_updated",
        "Stanislaus River": "stanislaus_pywr_model_updated",
      };
      try {
        const allData = await Promise.all(
          Object.keys(modelNameMap).map(async (modelName) => {
            const internalModelName = modelNameMap[modelName];
            if (!internalModelName) return { nodes: [], metadata: {}, edges: [] };
            const response = await fetch(`/models/${internalModelName}.json`);
            const data = await response.json();
            return { ...data, modelName }; // Include model name in the data
          })
        );

        // Combine nodes and edges from all models.
        const combinedModels = allData.map((data) => {
          const nodes = data.nodes.map((node: { name: string; coordinates?: number[]; type?: string }) => {
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

          const edges = data.edges ? data.edges.map(([source, target]: [string, string]) => ({
            source,
            target,
          })) : [];

          return { modelName: data.modelName, nodeData: nodes, edges };
        });
        setModelData(combinedModels);
      } catch (error) {
        console.error("Error loading the JSON data:", error);
        setModelData([]);
      }
    };

    fetchAllData();
  }, []); // Empty dependency array to run only once

  return { modelData };
};

export default useGetModelData;