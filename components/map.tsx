"use client"

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";


const Map: React.FC = () => {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTY2dGphN3cwM3FoMmpvbGhicmw0dmpsIn0.jbBqfx5UiMuZ5lzxlQgXpg";
      
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 0], // [Longitude, Latitude]
        zoom: 3,
      });
  
      return () => {
        mapRef.current?.remove();
      };
    }, []);
  
    return (
      <div
        ref={mapContainerRef}
        style={{
          width: "600px", // Adjusted width
          height: "400px", // Adjusted height
          borderRadius: "10px",
          overflow: "hidden",
        }}
      />
    );
  };
  
  export default Map;