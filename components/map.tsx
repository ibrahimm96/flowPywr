"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useAddMarkers from "@/hooks/useAddMarkers";
import useShowFlow from "@/hooks/useShowFlow";
import useAddBoundaries from "@/hooks/useAddBoundaries";
import { useDataContext } from "@/contexts/ModelDataContext";
import { useMapContext } from "@/contexts/MapContext";

mapboxgl.accessToken = "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA";

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Map reference
  const [mapLoaded, setMapLoaded] = useState(false); // Tracks whether map is loaded
  const [styleLoaded, setStyleLoaded] = useState(false); // Tracks whether style is loaded

  const { modelData } = useDataContext();
  const { style, type, selectedModels, showFlow, onComponentClick } = useMapContext();
  const addMarkers = useAddMarkers(mapRef, onComponentClick);


  // Filter nodes and edges based on selected models
  const filteredNodes = modelData
    .filter(model => selectedModels.includes(model.modelName))
    .flatMap(model => model.nodeData);

  const filteredEdges = modelData
    .filter(model => selectedModels.includes(model.modelName))
    .flatMap(model => model.edges);
    
  const showFlowCallback = useShowFlow(mapRef, showFlow, filteredEdges, filteredNodes);
  const addBoundaries = useAddBoundaries(mapRef, selectedModels);

  const markerCoordinates = type === "All" ? filteredNodes : filteredNodes.filter((item) => item.type === type);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style,
        center: [-119.93699070783447, 37.563100124794175],
        zoom: 7.9,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl());

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
      addBoundaries();
      addMarkers(markerCoordinates);
      showFlowCallback();
    }
  }, [mapLoaded, styleLoaded, addMarkers, markerCoordinates, showFlowCallback, addBoundaries]); // Update markers, flow edges

  return (
    <div
      className="max-w-full max-h-full"
      ref={mapContainerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default Map;