"use client"

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

  /* 
  To add coordinates for all possible nodes in each model:
        - Write a script that retrieves the coordinate attribute from each model's json file 
        - Use map.addLayer in a loop to map the array of retrieved coordinates objects
  */

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
          width: "1100px", // Adjusted width
          height: "800px", // Adjusted height
          borderRadius: "10px",
          overflow: "hidden",
        }}
      />
    );
  };
  
  export default Map;
