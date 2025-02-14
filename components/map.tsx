"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useGetModelData from "@/hooks/useGetModelData";
import AnimatedPopup from "mapbox-gl-animated-popup";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaWJyYWhpbW05NiIsImEiOiJjbTZqbmJsaGowMnAwMmtxOHJhZGtsa2UyIn0.VWsBiWtnRzwfh0BQoHD1dA";

interface MapProps {
  modelNames: string[];
  style: string;
  type: string;
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

const Map: React.FC<MapProps> = ({ style, type, modelNames, onComponentClick }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const { coordinates } = useGetModelData(modelNames);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const addMarkers = (markerCoordinates: typeof coordinates) => {
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    markerCoordinates.forEach((item) => {
      if (item.coordinates.lat && item.coordinates.lon && mapRef.current) {
        // Choose the appropriate icon based on the type:
        let iconUrl = "/icons/default.svg"; // default fallback
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

        // Create a custom marker element using an <img> element.
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

        // Use mouseenter/mouseleave events for hover display.
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

  const markerCoordinates =
    type === "All"
      ? coordinates
      : coordinates.filter((item) => item.type === type);

  useEffect(() => {
    if (mapContainerRef.current) {
      const center = getCenterCoordinate(coordinates);
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style,
        center: center,
        zoom: 8.1,
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates]);

  useEffect(() => {
    if (mapRef.current) {
      addMarkers(markerCoordinates);
    }
  }, [modelNames, type, coordinates]);

  useEffect(() => {
    if (mapRef.current && style) {
      mapRef.current.setStyle(style);
    }
  }, [style]);

  return (
    <div
      className="max-w-full max-h-full"
      ref={mapContainerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default Map;
