"use client"

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import useGetModelData from "@/hooks/useGetModelData";
import AnimatedPopup from "mapbox-gl-animated-popup";

mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA";

interface MapProps {
  modelName: string;
}

// Dynamic map centering
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


const Map: React.FC<MapProps> = ({ modelName }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Reference to map container
  const mapRef = useRef<mapboxgl.Map | null>(null); // Reference to the map instance
  const [selectedType, setSelectedType] = useState("All"); // State for selected filter type

  const { coordinates } = useGetModelData(modelName); // Get coordinates directly
  console.log(coordinates);

  // Store markers so they can be removed when the filter changes
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => { 
    if (mapContainerRef.current) {
      const center = getCenterCoordinate(coordinates); // Dynamic Centering
      // Create a Mapbox map instance
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v11", // Hybrid style (satellite + streets)
        center: center, 
        zoom: 8.5,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right'); // Add zoom buttons to top-right corner
    }

    return () => {
      // Cleanup the map on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates]); // Only run when coordinates change

  // Function to clear all markers from the map
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = []; // Reset markers array
  };

  // Function to add markers based on filtered coordinates
  const addMarkers = (markerCoordinates: typeof coordinates) => {
    clearMarkers(); // Clear existing markers on data change, and add new markers.

    markerCoordinates.forEach((item) => {
      if (item.coordinates.lat && item.coordinates.lon && mapRef.current) {
        // Determine marker color based on type
        const markerColor = item.type === "Hydropower" ? "#ff4d4d" : // Red
                            item.type === "Reservoir" ? "#007bff" : // Blue
                            "#dc3545"; // Default
        
        const marker = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([item.coordinates.lon, item.coordinates.lat])
          .addTo(mapRef.current);

        // Create the popup (hidden by default)
        const popup = new AnimatedPopup({
          openingAnimation: {
            duration: 400,
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
        
        // Show popup only when marker is clicked
        marker.setPopup(popup);

        markers.current.push(marker); // Store marker for cleanup
      }
    });
  };

  // Filter coordinates based on selected type
  const markerCoordinates = selectedType === "All" 
    ? coordinates 
    : coordinates.filter((item) => item.type === selectedType);

  // Update markers when the filter changes
  useEffect(() => {
    if (mapRef.current) {
      addMarkers(markerCoordinates);
    }
  }, [selectedType, coordinates]); // Re-run on filter or coordinates change

  return (
    <div style={{ position: "relative", height: "700px", width: "100%" }}>
      {/* Map container */}
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />

      {/* Filter menu positioned on the map */}
      <div 
        style={{
          position: "absolute", 
          top: "20px", 
          left: "20px", 
          backgroundColor: "white", 
          padding: "10px", 
          borderRadius: "5px", 
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          zIndex: 1
        }}
      >
        <label htmlFor="typeFilter">Select Type: </label>
        <select 
          id="typeFilter" 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Reservoir">Reservoir</option>
          <option value="Hydropower">Hydropower</option>
        </select>
      </div>
    </div>
  );
};

export default Map;
