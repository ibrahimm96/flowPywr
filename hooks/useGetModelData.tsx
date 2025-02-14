"use client";

import { useEffect, useState } from "react";

const useGetModelData = (modelNames: string[]) => {
  const [coordinates, setCoordinates] = useState<
    {
      name: string;
      coordinates: { lat: number | null; lon: number | null };
      type?: string;
    }[]
  >([]);

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
          modelNames.map(async (modelName) => {
            const internalModelName = modelNameMap[modelName];
            if (!internalModelName) return { nodes: [], metadata: {} };
            const response = await fetch(`/models/${internalModelName}.json`);
            const data = await response.json();
            return data;
          })
        );

        // Combine nodes from all models
        const combinedNodes = allData.flatMap((data) => {
          return data.nodes.map((node: { name: string; coordinates?: number[]; type?: string }) => ({
            name: node.name,
            coordinates: node.coordinates
              ? { lat: node.coordinates[0], lon: node.coordinates[1] }
              : { lat: null, lon: null },
            type: node.type || "Unknown",
          }));
        });

        setCoordinates(combinedNodes);

        if (modelNames.length === 1) {
          setTitle(allData[0].metadata?.title || "Untitled Model");
        } else {
          // Combine titles from all selected models
          const titles = allData.map(
            (data, index) => data.metadata?.title || modelNames[index]
          );
          setTitle(titles.join(" | "));
        }
      } catch (error) {
        console.error("Error loading the JSON data:", error);
        setCoordinates([]);
        setTitle("Error Loading Title");
      }
    };

    if (modelNames.length > 0) {
      fetchAllData();
    } else {
      setCoordinates([]);
      setTitle("");
    }
  }, [modelNames]);

  return { coordinates, title };
};

export default useGetModelData;
