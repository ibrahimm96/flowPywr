"use client"

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import useGetCoordinates from "@/hooks/useGetCoordinates";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA";

interface MapProps {
  modelName: string;
}

const Map: React.FC<MapProps> = ({ modelName }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Reference to map container
  const mapRef = useRef<mapboxgl.Map | null>(null); // Reference to the map instance
  const [selectedType, setSelectedType] = useState("All"); // State for selected filter type

  const { coordinates } = useGetCoordinates(modelName); // Get coordinates directly

  // Store markers so they can be removed when the filter changes
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => { 
    if (mapContainerRef.current) {
      // Create a Mapbox map instance
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v11", // Hybrid style (satellite + streets)
        center: [coordinates[0]?.coordinates.lon || -120.4820, coordinates[0]?.coordinates.lat || 37.3021], // Center on first coordinate (or fallback)
        zoom: 9,
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
  const addMarkers = (filteredCoordinates: typeof coordinates) => {
    clearMarkers(); // Clear existing markers

    filteredCoordinates.forEach((item) => {
      if (item.coordinates.lat && item.coordinates.lon && mapRef.current) {
        // Determine marker color based on type
        const markerColor = item.type === "Hydropower" ? "#ff4d4d" : //
                            item.type === "Reservoir" ? "#007bff" : //
                            "#dc3545"; // Default to red if type is unknown
        
        const marker = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([item.coordinates.lon, item.coordinates.lat])
          .addTo(mapRef.current);

        // Create the popup (hidden by default)
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${item.name}</h3><p>Type: ${item.type || "Unknown"}</p>`);

        // Show popup only when marker is clicked
        marker.setPopup(popup);

        markers.current.push(marker); // Store marker for cleanup
      }
    });
  };

  // Filter coordinates based on selected type
  const filteredCoordinates = selectedType === "All" 
    ? coordinates 
    : coordinates.filter((item) => item.type === selectedType);

  // Update markers when the filter changes
  useEffect(() => {
    if (mapRef.current) {
      addMarkers(filteredCoordinates);
    }
  }, [selectedType, coordinates]); // Re-run on filter or coordinates change

  return (
    <div>
      {/* Filter menu */}
      <div>
        <label htmlFor="typeFilter">Select Type: </label>
        <select id="typeFilter" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="All">All</option>
          <option value="Reservoir">Reservoir</option>
          <option value="Hydropower">Hydropower</option>
        </select>
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} style={{ height: "700px", width: "100%" }} />
    </div>
  );
};

export default Map;