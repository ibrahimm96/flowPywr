import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import useGetModelData from "@/hooks/useGetModelData";
import AnimatedPopup from "mapbox-gl-animated-popup";
import { motion } from "framer-motion";  


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
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v11"); // State for map style

  const { coordinates } = useGetModelData(modelName); // Use hook to get model coordinates
  console.log(coordinates);

  // Store markers so they can be removed when the filter changes
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => { 
    if (mapContainerRef.current) {
      const center = getCenterCoordinate(coordinates); // Dynamic Centering
      // Create a Mapbox map instance
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle, // Initially set the style from the state
        center: center, 
        zoom: 8.25,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right'); // Add zoom buttons to top-right corner
    }

    return () => {
      // Cleanup the map on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates, mapStyle]); // Re-run on coordinates or mapStyle change

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

  // Toggle map style
  const buttonLabel = mapStyle === "mapbox://styles/mapbox/satellite-streets-v11" ? "Standard" : "Satellite";

  const toggleMapStyle = () => {
    const newStyle = mapStyle === "mapbox://styles/mapbox/streets-v11" 
      ? "mapbox://styles/mapbox/satellite-streets-v11" 
      : "mapbox://styles/mapbox/streets-v11";
      
    if (mapRef.current) {
      mapRef.current.setStyle(newStyle);
      setMapStyle(newStyle); // Update the style state
      setTimeout(() => addMarkers(markerCoordinates), 100); // Re-add markers after style change
    }
  };

  return (
    <div style={{ position: "relative", height: "700px", width: "100%" }}>
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: "100%", 
          width: "100%", 
          borderRadius: "5px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)", 
        }} 
      />
      <div 
        style={{
          position: "absolute", 
          top: "20px", 
          left: "20px", 
          backgroundColor: "white", 
          padding: "10px", 
          borderRadius: "5px", 
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          zIndex: 1,
          width: "320px", 
          height: "50px", 
          display: "flex",
          alignItems: "center", 
          justifyContent: "space-between", 
          gap: "20px",
        }}
      >
        <motion.label
          htmlFor="typeFilter"
          whileHover={{ scale: 1.00 }}
          whileTap={{ scale: 1.00}}
        >
          Type:
        </motion.label>
  
        {/* Selector with a fixed width */}
        <motion.select 
          id="typeFilter" 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          whileHover={{ scale: 1.10 }} 
          whileTap={{ scale: 0.90 }}
          style={{ width: "120px" }} // Fixed width for the selector
        >
          <option value="All">All</option>
          <option value="Reservoir">Reservoir</option>
          <option value="Hydropower">Hydropower</option>
        </motion.select>
  
        {/* Button with framer-motion */}
        <motion.button 
          onClick={toggleMapStyle} 
          style={{ 
            padding: "5px 10px", 
            backgroundColor: "#007bff", 
            color: "#fff", 
            border: "none", 
            borderRadius: "3px",
            height: "30px", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "100px", // Fixed width for the button to prevent resizing
          }}
          whileHover={{ scale: 1.04 }} 
          whileTap={{ scale: 0.96 }}
        >
          {buttonLabel}
        </motion.button>
      </div>
    </div>
  );
};

export default Map;