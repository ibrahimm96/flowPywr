"use client";

import React, { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useGetModelData from "@/hooks/useGetModelData";
import AnimatedPopup from "mapbox-gl-animated-popup";
// Import GeoJSON types
import { Feature, FeatureCollection, LineString, Point } from "geojson";

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
    if (mapRef.current.getSource("flowArrows")) {
      mapRef.current.removeSource("flowArrows");
    }

    if (showFlow && edges && edges.length > 0) {
      // Build GeoJSON features for each edge.
      const lineFeatures: Feature<LineString, { source: string; target: string }>[] =
        edges
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

      const flowGeojson: FeatureCollection<LineString, { source: string; target: string }> =
        {
          type: "FeatureCollection",
          features: lineFeatures,
        };

      // Add the GeoJSON source for flow lines.
      mapRef.current.addSource("flowLines", {
        type: "geojson",
        data: flowGeojson,
      });

      // Add a line layer for a solid, thick red flow line.
      mapRef.current.addLayer({
        id: "flowLines",
        type: "line",
        source: "flowLines",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#ff0000",
          "line-width": 4,
        },
      });

      // Compute midpoints and arrow rotation for arrow placement.
      const arrowFeatures: Feature<Point, { rotation: number }>[] = lineFeatures.map(
        (lineFeature) => {
          const coords = lineFeature.geometry.coordinates;
          const midLon = (coords[0][0] + coords[1][0]) / 2;
          const midLat = (coords[0][1] + coords[1][1]) / 2;
          const dx = coords[1][0] - coords[0][0];
          const dy = coords[1][1] - coords[0][1];
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI; // Angle in degrees.
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [midLon, midLat],
            },
            properties: { rotation: angle },
          } as Feature<Point, { rotation: number }>;
        }
      );

      const arrowGeojson: FeatureCollection<Point, { rotation: number }> = {
        type: "FeatureCollection",
        features: arrowFeatures,
      };

      // Add a new source for arrow markers.
      mapRef.current.addSource("flowArrows", {
        type: "geojson",
        data: arrowGeojson,
      });

      // Add a symbol layer for arrow markers.
      mapRef.current.addLayer({
        id: "flowArrows",
        type: "symbol",
        source: "flowArrows",
        layout: {
          "symbol-placement": "point",
          "icon-image": "arrow-15",
          "icon-size": 1.0,
          "icon-allow-overlap": true,
          "icon-rotation-alignment": "map",
          "icon-rotate": ["get", "rotation"],
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
