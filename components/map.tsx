"use client" 

import React, { useEffect, useRef } from "react"; 
import mapboxgl from "mapbox-gl"; 
import 'mapbox-gl/dist/mapbox-gl.css'; 
import useGetModelData from "@/hooks/useGetModelData"; 
import AnimatedPopup from "mapbox-gl-animated-popup"; 

mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA"; // Mapbox access token

// Define TypeScript interface for map component props
interface MapProps { 
  modelName: string; 
  style: string; 
  type: string; 
}

// Function to compute the center of a set of coordinates
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

// Map Component 
const Map: React.FC<MapProps> = ({ style, type, modelName }) => { 
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Reference to map container
  const mapRef = useRef<mapboxgl.Map | null>(null); // Reference to map instance

  const { coordinates } = useGetModelData(modelName); // Fetch model data based on model name
  const markers = useRef<mapboxgl.Marker[]>([]); // Reference to marker instances

  const addMarkers = (markerCoordinates: typeof coordinates) => { // Function to add markers to map
    markers.current.forEach(marker => marker.remove()); // Remove existing markers
    markers.current = []; // Reset markers array

    markerCoordinates.forEach((item) => { // Loop through marker coordinates
      if (item.coordinates.lat && item.coordinates.lon && mapRef.current) { // Check for valid coordinates
        const markerColor = item.type === "Hydropower" ? "#ff4d4d" : // Assign marker color based on type
                            item.type === "Reservoir" ? "#007bff" :
                            "#dc3545";

        const marker = new mapboxgl.Marker({ color: markerColor }) // Create a new marker
          .setLngLat([item.coordinates.lon, item.coordinates.lat]) // Set marker position
          .addTo(mapRef.current); // Add marker to map

        const popup = new AnimatedPopup({ // Popup Logic
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

        marker.setPopup(popup); // Attach popup to marker
        markers.current.push(marker); // Store marker in reference array
      }
    });
  };

  const markerCoordinates = type === "All"  // Filter markers based on selected type
    ? coordinates 
    : coordinates.filter((item) => item.type === type);

  useEffect(() => { // Effect to initialize the map
    if (mapContainerRef.current) { // Ensure container exists
      const center = getCenterCoordinate(coordinates); // Compute map center
      mapRef.current = new mapboxgl.Map({ // Create new Mapbox instance
        container: mapContainerRef.current,
        style: style, // Apply selected map style
        center: center,
        zoom: 8.1,
      });
    }

    return () => { // Cleanup function to remove map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates]); // Runs only when coordinates change

  useEffect(() => { // Effect to update markers when data changes
    if (mapRef.current) { // Ensure map exists
      addMarkers(markerCoordinates); // Add new markers
    }
  }, [modelName, type, coordinates]); // Runs when model, type, or coordinates change

  useEffect(() => { // Effect to update map style dynamically
    if (mapRef.current && style) { // Ensure map instance exists
      mapRef.current.setStyle(style); // Apply new map style
    }
  }, [style]); // Runs when style changes

  return ( // Render map container
    <div   
      className="max-w-full max-h-full"
      ref={mapContainerRef}  // Attach ref to div
      style={{ height: "100%", width: "100%" }}
     />
  );
}

export default Map; // Export Map component
