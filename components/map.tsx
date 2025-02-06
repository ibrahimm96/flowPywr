"use client"

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import useGetModelData from "@/hooks/useGetModelData";
import AnimatedPopup from "mapbox-gl-animated-popup";

mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA";

interface MapProps {
  modelName: string;
  style: string;
  type: string;
}

const getCenterCoordinate = (
  coordinates: { name: string; coordinates: { lat: number | null; lon: number | null } }[]
): { lat: number; lon: number } => {
  let latSum = 0, lonSum = 0, count = 0;

  coordinates.forEach(({ coordinates: { lat, lon } }) => {
    if (lat !== null && lon !== null) {
      latSum += lat;
      lonSum += lon;
      count++;
    }
  });

  return count > 0 ? { lat: latSum / count, lon: lonSum / count } : { lat: 0, lon: 0 };
};

const Map: React.FC<MapProps> = ({ style, type, modelName }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const { coordinates } = useGetModelData(modelName);

  const markers = useRef<mapboxgl.Marker[]>([]);

  const addMarkers = (markerCoordinates: typeof coordinates) => {
    // Remove any existing markers first
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    markerCoordinates.forEach((item) => {
      if (item.coordinates.lat && item.coordinates.lon && mapRef.current) {
        const markerColor = item.type === "Hydropower" ? "#ff4d4d" :
                            item.type === "Reservoir" ? "#007bff" :
                            "#dc3545";

        const marker = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([item.coordinates.lon, item.coordinates.lat])
          .addTo(mapRef.current);

        const popup = new AnimatedPopup({
          openingAnimation: {
            duration: 600,
            easing: 'easeInOutElastic',
            transform: 'scale',
          },
          closingAnimation: {
            duration: 300,
            easing: 'easeInBack',
            transform: 'scale',
          },
          offset: 33
        }).setHTML(`
          <div style="text-align: center;">  
            <h3 class="text-md font-bold mb-2">${item.name}</h3>  
            <p class="text-xs font-medium mb-2">${item.type || "Unknown Node"}</p>
          </div>
        `);

        marker.setPopup(popup);

        markers.current.push(marker);
      }
    });
  };

  const markerCoordinates = type === "All" 
    ? coordinates 
    : coordinates.filter((item) => item.type === type);

  // Initialize the map only once
  useEffect(() => {
    if (mapContainerRef.current) {
      const center = getCenterCoordinate(coordinates);
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style,  // You can update this to change the map's style without reinitializing
        center: center,
        zoom: 8.25,
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates]); // Only runs once when coordinates are initially available

  // Only update markers when model or type changes
  useEffect(() => {
    if (mapRef.current) {
      addMarkers(markerCoordinates);
    }
  }, [modelName, type, coordinates]); // Only reload markers when the model or type changes

  // Update the map style without resetting the map
  useEffect(() => {
    if (mapRef.current && style) {
      mapRef.current.setStyle(style);
    }
  }, [style]); // When style changes, update the map style without resetting

  return (
    <div   
      className="max-w-full max-h-full"
      ref={mapContainerRef} 
      style={{ height: "100%", width: "100%" }}
     />
  );
}

export default Map;