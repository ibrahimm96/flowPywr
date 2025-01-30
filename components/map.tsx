"use client"

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import useGetCoordinates from "@/hooks/useGetCoordinates";
import 'mapbox-gl/dist/mapbox-gl.css';

  /* 
  To add coordinates for all possible nodes in each model:
        - Write a script that retrieves the coordinate attribute from each model's json file 
        - Use map.addLayer in a loop to map the array of retrieved coordinates objects
  */

mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA";

interface MapProps {
  modelName: string;
}

const Map: React.FC<MapProps> = ({ modelName }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Reference to map container
  const mapRef = useRef<mapboxgl.Map | null>(null); // Reference to the map instance

  const { coordinates } = useGetCoordinates(modelName); // Get coordinates directly

  useEffect(() => {
    if (mapContainerRef.current) {
      // Create a Mapbox map instance
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v11", // Hybrid style (satellite + streets)
        center: [coordinates[0]?.coordinates.lon || -120.4820, coordinates[0]?.coordinates.lat || 37.3021], // Center on first coordinate (or fallback)
        zoom: 9,
      });

      // Add markers for each coordinate only if mapRef.current is available
      coordinates.forEach((item) => {
        if (item.coordinates.lat && item.coordinates.lon && mapRef.current) {
          new mapboxgl.Marker()
            .setLngLat([item.coordinates.lon, item.coordinates.lat])
            .addTo(mapRef.current);
        }
      });
    }

    return () => {
      // Cleanup the map on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates]); // Re-run when coordinates change

  return <div ref={mapContainerRef} style={{ height: "800px", width: "100%" }} />;
};

export default Map;