"use client"

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

  /* 
  To add coordinates for all possible nodes in each model:
        - Write a script that retrieves the coordinate attribute from each model's json file 
        - Use map.addLayer in a loop to map the array of retrieved coordinates objects
  */

mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTY2dGphN3cwM3FoMmpvbGhicmw0dmpsIn0.jbBqfx5UiMuZ5lzxlQgXpg";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Reference to map container
  const mapRef = useRef<mapboxgl.Map | null>(null); // Reference to the map instance

  useEffect(() => {
    if (mapContainerRef.current) {
      // Create a Mapbox map instance
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v11', // Hybrid style (satellite + streets)
        center: [-120.4820, 37.3021], // [Longitude, Latitude]
        zoom: 10,
      });

      // Add a waypoint (marker) at the given coordinates
      new mapboxgl.Marker()
        .setLngLat([-120.4820, 37.3021]) // [Longitude, Latitude]
        .addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Cleanup the map on component unmount
      }
    };
  }, []);

  return <div ref={mapContainerRef} style={{ height: '800px', width: '100%' }} />;
};
  
export default Map;
