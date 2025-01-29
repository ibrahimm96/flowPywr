"use client"

import { useEffect, useState } from 'react';

const Page = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }[]>([]);

  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch('/models/merced_pywr_model_updated.json')
      .then((response) => response.json())
      .then((data) => {
        const coords = data.nodes.map((node: { coordinates: { lat: number; lon: number } }) => node.coordinates);
        setCoordinates(coords);
      })
      .catch((error) => {
        console.error('Error loading the JSON data:', error);
      });
  }, []);

  return (
    <div>
      <h1>**Coordinates Testing**</h1>
      <pre>{JSON.stringify(coordinates, null, 2)}</pre>
    </div>
  );
};

export default Page;