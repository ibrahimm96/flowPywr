"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useGetModelData from "@/hooks/useGetModelData";
import useAddMarkers from "@/hooks/useAddMarkers";
import useShowFlow from "@/hooks/useShowFlow";

mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA";

interface MapProps {
  modelNames: string[];
  style: string;
  type: string;
  showFlow: boolean;
  onComponentClick?: (node: {
    name: string;
    coordinates: { lat: number | null; lon: number | null };
    type?: string;
  } | null) => void;
}

const Map: React.FC<MapProps> = ({
  style,
  type,
  modelNames,
  showFlow,
  onComponentClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Map reference
  const [mapLoaded, setMapLoaded] = useState(false); // Tracks whether map is loaded
  const [styleLoaded, setStyleLoaded] = useState(false); // Tracks whether style is loaded

  const { coordinates, edges } = useGetModelData(modelNames);
  const addMarkers = useAddMarkers(mapRef, onComponentClick);
  const showFlowCallback = useShowFlow(mapRef, showFlow, edges, coordinates);
  const markerCoordinates = type === "All" ? coordinates : coordinates.filter((item) => item.type === type);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style,
        center: [-119.93699070783447, 37.563100124794175],
        zoom: 8.1,
      });

      mapRef.current.on('load', () => {
        setMapLoaded(true);
        console.log("Map loaded");
      });

      mapRef.current.on('idle', () => {
        if (mapRef.current?.isStyleLoaded()) {
          setStyleLoaded(true);
          console.log("Style loaded");
        }
      });
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Initial Map Load

  useEffect(() => {
    if (mapRef.current && style) {
      setStyleLoaded(false); // Reset style loaded state
      mapRef.current.setStyle(style);
    }
  }, [style]); // Style Change

  useEffect(() => {
    if (mapLoaded && styleLoaded) {
      addMarkers(markerCoordinates);
      showFlowCallback();
    }
  }, [mapLoaded, styleLoaded, addMarkers, markerCoordinates, showFlowCallback]); // Update markers, flow edges  

  return (
    <div
      className="max-w-full max-h-full"
      ref={mapContainerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default Map;