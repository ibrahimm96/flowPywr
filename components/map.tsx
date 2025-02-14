"use client";

import React, { useEffect, useRef } from "react";
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

const getCenterCoordinate = (
  coordinates: {
    name: string;
    coordinates: { lat: number | null; lon: number | null };
  }[]
): { lat: number; lon: number } => {
  let latSum = 0,
    lonSum = 0,
    count = 0;
  coordinates.forEach(({ coordinates: { lat, lon } }) => {
    if (lat !== null && lon !== null) {
      latSum += lat;
      lonSum += lon;
      count++;
    }
  });
  return count > 0 ? { lat: latSum / count, lon: lonSum / count } : { lat: 0, lon: 0 };
};

const Map: React.FC<MapProps> = ({ style, type, modelNames, showFlow, onComponentClick }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Fetch both node data and edges.
  const { coordinates, edges } = useGetModelData(modelNames);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Function to add custom markers for each node.
  const addMarkers = (markerCoordinates: typeof coordinates) => {
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

        // Attach hover events to trigger the component info display.
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
  };

  // Filter nodes by type if not "All".
  const markerCoordinates =
    type === "All" ? coordinates : coordinates.filter((item) => item.type === type);

  // Initialize the map.
  useEffect(() => {
    if (mapContainerRef.current) {
      const center = getCenterCoordinate(coordinates);
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style,
        center: [center.lon, center.lat],
        zoom: 8.1,
      });
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates, style]);

  // Add markers when node data changes.
  useEffect(() => {
    if (mapRef.current) {
      addMarkers(markerCoordinates);
    }
  }, [modelNames, type, coordinates]);

  // Update map style if it changes.
  useEffect(() => {
    if (mapRef.current && style) {
      mapRef.current.setStyle(style);
    }
  }, [style]);

  // Draw flow edges with directed arrows if showFlow is enabled.
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove any existing flow layers/sources.
    if (mapRef.current.getLayer("flowLines")) {
      mapRef.current.removeLayer("flowLines");
    }
    if (mapRef.current.getSource("flowLines")) {
      mapRef.current.removeSource("flowLines");
    }
    if (mapRef.current.getLayer("flowArrows")) {
      mapRef.current.removeLayer("flowArrows");
    }

    if (showFlow && edges && edges.length > 0) {
      // Build GeoJSON features for each edge.
      const lineFeatures: Feature<LineString, { source: string; target: string }>[] = edges
        .map((edge) => {
          const [sourceName, targetName] = edge;
          const sourceNode = coordinates.find((n) => n.name === sourceName);
          const targetNode = coordinates.find((n) => n.name === targetName);
          if (
            sourceNode &&
            targetNode &&
            sourceNode.coordinates.lat !== null &&
            targetNode.coordinates.lat !== null
          ) {
            return {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [sourceNode.coordinates.lon, sourceNode.coordinates.lat],
                  [targetNode.coordinates.lon, targetNode.coordinates.lat],
                ],
              },
              properties: {
                source: sourceName,
                target: targetName,
              },
            } as Feature<LineString, { source: string; target: string }>;
          }
          return null;
        })
        .filter(
          (feature): feature is Feature<LineString, { source: string; target: string }> =>
            feature !== null
        );

      const geojson: FeatureCollection<LineString, { source: string; target: string }> = {
        type: "FeatureCollection",
        features: lineFeatures,
      };

      // Add the GeoJSON source for flow lines.
      mapRef.current.addSource("flowLines", {
        type: "geojson",
        data: geojson,
      });

      // Add a line layer to display a solid, thick red flow line.
      mapRef.current.addLayer({
        id: "flowLines",
        type: "line",
        source: "flowLines",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#ff0000", // red color
          "line-width": 4,          // thick line
          // No dash array -> solid line
        },
      });

      // Add a symbol layer to place arrow markers along the flow lines.
      mapRef.current.addLayer({
        id: "flowArrows",
        type: "symbol",
        source: "flowLines",
        layout: {
          "symbol-placement": "line",
          "icon-image": "triangle-11", // Built-in Maki arrow icon.
          "icon-size": 0.8,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-rotation-alignment": "map",
        },
      });
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
