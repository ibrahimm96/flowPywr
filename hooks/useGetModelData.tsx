"use client";

import { useEffect, useState } from 'react';

const useGetModelData = (modelName: string) => {
  const [coordinates, setCoordinates] = useState<{ 
        name: string; 
        coordinates: { lat: number | null; lon: number | null }; 
        type?: string;
  }[]>([]);
    
  const [title, setTitle] = useState<string>('');

  // Mapping model names to internal model filenames
  const modelNames: Record<string, string> = {
    "Merced River": "merced_pywr_model_updated",
    "Tuolumne River": "tuolumne_pywr_model_updated",
    "San Joaquin River": "upper_san_joaquin_pywr_model_updated",
    "Stanislaus River": "stanislaus_pywr_model_updated",
  };

  // Get the internal model filename based on the selected model name
  const internalModelName = modelNames[modelName];

  useEffect(() => {
    if (internalModelName) {
      const fetchData = async () => {
        try {
          const filePath = `/models/${internalModelName}.json`; // Use internal model filename here
          const response = await fetch(filePath);
          const data = await response.json();

          // Extract names, coordinates, and type
          const nodesWithCoordinates = data.nodes.map((node: { name: string, coordinates?: number[], type?: string }) => ({
            name: node.name,
            coordinates: node.coordinates ? { lat: node.coordinates[0], lon: node.coordinates[1] } : { lat: null, lon: null },
            type: node.type || "Unknown" // Default to "Unknown" if type is missing
          }));

          setCoordinates(nodesWithCoordinates);
          setTitle(data.metadata?.title || "Untitled Model");
        } catch (error) {
          console.error('Error loading the JSON data:', error);
          setCoordinates([]);
          setTitle("Error Loading Title");
        }
      };

      fetchData();
    }
  }, [modelName, internalModelName]); // Re-fetch data when modelName changes

  return { coordinates, title };
};

export default useGetModelData;