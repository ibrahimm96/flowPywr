"use client"

import { useEffect, useState } from 'react';

const Page = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }[]>([]);
  const [title, setTitle] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch('/models/merced_pywr_model_updated.json')
      .then((response) => response.json())
      .then((data) => {
        const coords = data.nodes.map((node: { coordinates: { lat: number; lon: number } }) => node.coordinates);
        const nodeNames = data.nodes.map((node: { name: string }) => node.name);
        setCoordinates(coords);
        setNames(nodeNames);
        setTitle(data.metadata?.title || "Unkown Model");
      })
      .catch((error) => {
        console.error('Error loading the JSON data:', error);
      });
  }, []);

  return (
    <div>
      <h1>**Coordinates Testing**</h1>
      <h1>{title}</h1>
      <pre>{JSON.stringify(names.map((name, index) => ({ name, coordinates: coordinates[index] })), null, 3)}</pre>
    </div>
  );
};

export default Page;