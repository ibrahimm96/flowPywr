"use client";

import { useEffect, useState } from 'react';

const useGetCoordinates = (modelName: string) => {
    const [coordinates, setCoordinates] = useState<{ 
        name: string; 
        coordinates: { lat: number | null; lon: number | null }; 
        type?: string;
    }[]>([]);
    
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
      const fetchData = async () => {
        try {
          const filePath = `/models/${modelName}.json`; // Adjust the path based on modelName input
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
    }, [modelName]);

    return { coordinates, title };
};

export default useGetCoordinates;