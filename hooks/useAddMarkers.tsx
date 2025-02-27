"use client";

import { useCallback, useRef } from "react";
import mapboxgl from "mapbox-gl";
import AnimatedPopup from "mapbox-gl-animated-popup";

interface Coordinates {
  lat: number | null;
  lon: number | null;
}

interface MarkerItem {
  name: string;
  type?: string;
  coordinates: Coordinates;
}

type MapRef = React.RefObject<mapboxgl.Map | null>;

const useAddMarkers = (
  mapRef: MapRef,
  onComponentClick?: (node: MarkerItem | null) => void
) => {
  const markers = useRef<mapboxgl.Marker[]>([]);

  const addMarkers = useCallback(
    (markerCoordinates: MarkerItem[]) => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      // Marker .pngs are 16px by default
      markerCoordinates.forEach((item) => {
        if (item.coordinates.lat && item.coordinates.lon && mapRef.current) {
          let iconUrl = "/icons/default.svg";
          if (item.type === "Hydropower") iconUrl = "/hydropower.png";
          else if (item.type === "Reservoir") iconUrl = "/reservoir.png";
          else if (item.type === "Catchment") iconUrl = "/catchment.png";
          else if (item.type === "Link") iconUrl = "/link.png";
          else if (item.type === "InstreamFlowRequirement") iconUrl = "/instream_flow_requirement.png";
          else if (item.type === "BreakLink") iconUrl = "/breakline.png";
          else if (item.type === "Output") iconUrl = "/output.png";
          else if (item.type === "PiecewiseLink") iconUrl = "/piecewiseLink.png";
          else iconUrl = "/catchment.png";


          const markerEl = document.createElement("img");
          markerEl.src = iconUrl;
          markerEl.alt = item.type || "default marker";
          markerEl.style.width = "16px";
          markerEl.style.height = "16px";

          const marker = new mapboxgl.Marker({ element: markerEl })
            .setLngLat([item.coordinates.lon, item.coordinates.lat])
            .addTo(mapRef.current);

          const popup = new AnimatedPopup({
            openingAnimation: { duration: 600, easing: "easeInOutElastic", transform: "scale" },
            closingAnimation: { duration: 300, easing: "easeInBack", transform: "scale" },
            offset: 33,
          }).setHTML(`
            <div style="text-align: center;">
              <h3 class="text-md font-bold mb-2">${item.name}</h3>
              <p class="text-xs font-medium mb-2">${item.type || "Unknown Node"}</p>
            </div>
          `);

          marker.setPopup(popup);

          const markerElement = marker.getElement();
          markerElement.addEventListener("mouseenter", () => onComponentClick?.(item));
          markerElement.addEventListener("mouseleave", () => onComponentClick?.(null));

          markers.current.push(marker);
        }
      });
    },
    [mapRef]
  );

  return addMarkers;
};

export default useAddMarkers;