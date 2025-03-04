"use client";

import { useCallback } from "react";
import { Feature, FeatureCollection, LineString } from "geojson";
import mapboxgl from "mapbox-gl";

interface Coordinates {
  lat: number | null;
  lon: number | null;
}

interface Edge {
  source: string;
  target: string;
}

type MapRef = React.RefObject<mapboxgl.Map | null>;

const useShowFlow = (
  mapRef: MapRef,
  showFlow: boolean,
  edges: Edge[],
  coordinates: { name: string; coordinates: Coordinates }[]
) => {
  const showFlowCallback = useCallback(() => {
    if (!mapRef.current) return;

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
      const lineFeatures: Feature<LineString, { source: string; target: string }>[] = edges
        .map((edge) => {
          const sourceNode = coordinates.find((n) => n.name === edge.source);
          const targetNode = coordinates.find((n) => n.name === edge.target);

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
              properties: { source: edge.source, target: edge.target },
            };
          }
          return null;
        })
        .filter((feature): feature is Feature<LineString, { source: string; target: string }> => feature !== null);

      const flowGeojson: FeatureCollection<LineString, { source: string; target: string }> = {
        type: "FeatureCollection",
        features: lineFeatures,
      };

      mapRef.current.addSource("flowLines", {
        type: "geojson",
        data: flowGeojson,
        lineMetrics: true,
      });

      if (!mapRef.current.getLayer("line-background")) {
        mapRef.current.addLayer({
          id: "line-background",
          type: "line",
          source: "flowLines",
          paint: {
            'line-color': 'blue',
            'line-width': 4,
            'line-opacity': 0.4
          }
        });
      }

      if (!mapRef.current.getLayer("line-dashed")) {
        mapRef.current.addLayer({
          id: "line-dashed",
          type: "line",
          source: "flowLines",
          paint: {
            'line-color': 'blue',
            'line-width': 4,
            'line-dasharray': [0, 4, 3]
          }
        });
      }

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
        const newStep = Math.floor(timestamp / 80) % dashArraySequence.length; // Updates Animation Speed

        if (newStep !== step) {
          const dashArray = dashArraySequence[newStep];

          if (mapRef.current?.getLayer('line-dashed')) {
            mapRef.current.setPaintProperty(
              'line-dashed',
              'line-dasharray',
              dashArray
            );
          }

          step = newStep;
        }

        requestAnimationFrame(animateDashArray);
      };

      animateDashArray(0);
    }
  }, [mapRef, showFlow, edges, coordinates]);

  return showFlowCallback;
};

export default useShowFlow;