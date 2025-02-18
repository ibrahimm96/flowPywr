"use client";

import React, { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useGetModelData from "@/hooks/useGetModelData";
import AnimatedPopup from "mapbox-gl-animated-popup";
// Import GeoJSON types
import { Feature, FeatureCollection, LineString } from "geojson";


mapboxgl.accessToken =
  "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA";

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
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Fetch both node data and edges.
  const { coordinates, edges } = useGetModelData(modelNames);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Wrap addMarkers in useCallback so it is stable.
  const addMarkers = useCallback(
    (markerCoordinates: typeof coordinates) => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      markerCoordinates.forEach((item) => {
        if (item.coordinates.lat && item.coordinates.lon && mapRef.current) {
          // Choose an icon URL based on the node's type.
          let iconUrl = "/icons/default.svg"; // fallback
          if (item.type === "Hydropower") {
            iconUrl = "/hydropower.png";
          } else if (item.type === "Reservoir") {
            iconUrl = "/reservoir.png";
          } else if (item.type === "Catchment") {
            iconUrl = "/catchment.png";
          } else if (item.type === "Link") {
            iconUrl = "/link.svg";
          } else if (item.type === "InstreamFlowRequirement") {
            iconUrl = "/instream_flow_requirement.png";
          } else if (item.type === "BreakLink") {
            iconUrl = "/breakline.png";
          } else if (item.type === "Output") {
            iconUrl = "/output.png";
          }

          // Create an <img> element for the custom marker.
          const markerEl = document.createElement("img");
          markerEl.src = iconUrl;
          markerEl.alt = item.type || "default marker";
          markerEl.style.width = "30px";
          markerEl.style.height = "30px";

          const marker = new mapboxgl.Marker({ element: markerEl })
            .setLngLat([item.coordinates.lon, item.coordinates.lat])
            .addTo(mapRef.current);

          const popup = new AnimatedPopup({
            openingAnimation: {
              duration: 600,
              easing: "easeInOutElastic",
              transform: "scale",
            },
            closingAnimation: {
              duration: 300,
              easing: "easeInBack",
              transform: "scale",
            },
            offset: 33,
          }).setHTML(`
            <div style="text-align: center;">
              <h3 class="text-md font-bold mb-2">${item.name}</h3>
              <p class="text-xs font-medium mb-2">${item.type || "Unknown Node"}</p>
            </div>
          `);

          marker.setPopup(popup);

          // Attach hover events for component info.
          const markerElement = marker.getElement();
          markerElement.addEventListener("mouseenter", () => {
            if (onComponentClick) {
              onComponentClick(item);
            }
          });
          markerElement.addEventListener("mouseleave", () => {
            if (onComponentClick) {
              onComponentClick(null);
            }
          });

          markers.current.push(marker);
        }
      });
    },
    [onComponentClick]
  );

  // Filter nodes by type.
  const markerCoordinates =
    type === "All" ? coordinates : coordinates.filter((item) => item.type === type);

  // Initialize the map only once on mount with fixed center.
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style,
        center: [-119.93699070783447, 37.563100124794175],
        zoom: 8.1,
      });
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Only once

  // Update map style if it changes.
  useEffect(() => {
    if (mapRef.current && style) {
      mapRef.current.setStyle(style);
    }
  }, [style]);

  // Update markers when node data changes.
  useEffect(() => {
    if (mapRef.current) {
      addMarkers(markerCoordinates);
    }
  }, [modelNames, type, coordinates, markerCoordinates, addMarkers]);

  // Draw flow edges with directed arrows if showFlow is enabled.
  useEffect(() => {
    if (!mapRef.current) return;
  
    // Remove existing flow layers and sources
    if (mapRef.current.getLayer("line-dashed")) {
      mapRef.current.removeLayer("line-dashed");
    }
    if (mapRef.current.getLayer("line-background")) {
      mapRef.current.removeLayer("line-background");
    }
    if (mapRef.current.getSource("flowLines")) {
      mapRef.current.removeSource("flowLines");
    }
  
  
    if (showFlow && edges && edges.length > 0) {
      const lineFeatures: Feature<LineString, { source: string; target: string }>[]= 
        edges
          .map((edge) => {
            const [sourceName, targetName] = edge;
            const sourceNode = coordinates.find((n) => n.name === sourceName);
            const targetNode = coordinates.find((n) => n.name === targetName);
  
            if (!sourceNode || !targetNode) return null;
  
            const sourceCoordinates = sourceNode.coordinates;
            const targetCoordinates = targetNode.coordinates;
  
            if (sourceCoordinates?.lat != null && sourceCoordinates?.lon != null &&
              targetCoordinates?.lat != null && targetCoordinates?.lon != null) {
              return {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [sourceCoordinates.lon, sourceCoordinates.lat],
                    [targetCoordinates.lon, targetCoordinates.lat],
                  ],
                },
                properties: { source: sourceName, target: targetName },
              };
            }
            return null;
          })
          .filter((feature): feature is Feature<LineString, { source: string; target: string }> =>
            feature !== null
          );
  
      const flowGeojson: FeatureCollection<LineString, { source: string; target: string }> = {
        type: "FeatureCollection",
        features: lineFeatures,
      };
  
      // Add GeoJSON source with lineMetrics enabled
      mapRef.current.addSource("flowLines", {
        type: "geojson",
        data: flowGeojson,
        lineMetrics: true,
      });
  
      // Add the background line layer with low opacity
      if (!mapRef.current.getLayer("line-background")) {
        mapRef.current.addLayer({
          id: "line-background",
          type: "line",
          source: "flowLines",
          paint: {
            'line-color': 'blue',
            'line-width': 6,
            'line-opacity': 0.4
          }
        });
      }
  
      // Add the dashed line layer on top of the background line
      if (!mapRef.current.getLayer("line-dashed")) {
        mapRef.current.addLayer({
          id: "line-dashed",
          type: "line",
          source: "flowLines",
          paint: {
            'line-color': 'blue',
            'line-width': 6,
            'line-dasharray': [0, 4, 3]
          }
        });
      }
  
      // Define the dash array sequence for animation
      const dashArraySequence = [
        [0, 4, 3],
        [0.5, 4, 2.5],
        [1, 4, 2],
        [1.5, 4, 1.5],
        [2, 4, 1],
        [2.5, 4, 0.5],
        [3, 4, 0],
        [0, 0.5, 3, 3.5],
        [0, 1, 3, 3],
        [0, 1.5, 3, 2.5],
        [0, 2, 3, 2],
        [0, 2.5, 3, 1.5],
        [0, 3, 3, 1],
        [0, 3.5, 3, 0.5],
      ];
  
      let step = 0;
  
      const animateDashArray = (timestamp: number) => {
        // Calculate the new step based on the timestamp
        const newStep = Math.floor(timestamp / 50) % dashArraySequence.length;
  
        // If the step has changed, update the dash pattern
        if (newStep !== step) {
          const dashArray = dashArraySequence[newStep];
  
          // Apply the new dashArray to the dashed line layer
          mapRef.current?.setPaintProperty(
            'line-dashed',
            'line-dasharray',
            dashArray
          );
  
          step = newStep;  // Update step to the current step
        }
  
        // Request the next frame of the animation
        requestAnimationFrame(animateDashArray);
      };
  
      // Start the animation loop
      animateDashArray(0);
    }
  }, [showFlow, edges, coordinates]);  
  
  return (
    <div
      className="max-w-full max-h-full"
      ref={mapContainerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default Map;
