import { useCallback, useEffect } from "react";
import mapboxgl from "mapbox-gl";

const useAddBoundaries = (mapRef: React.RefObject<mapboxgl.Map | null>, modelNames: string[]) => {
  const models = [
    { name: "Merced River", geojsonUrl: "/model-boundaries/Merced.geojson" },
    { name: "Tuolumne River", geojsonUrl: "/model-boundaries/Tuolumne.geojson" },
    { name: "San Joaquin River", geojsonUrl: "/model-boundaries/SJN.geojson" },
    { name: "Stanislaus River", geojsonUrl: "/model-boundaries/Stanislaus.geojson" },
  ];

  const modelColors: { [key: string]: string } = {
    "Merced River": "#00FF00", // Green
    "Tuolumne River": "#FFFF00", // Yellow
    "San Joaquin River": "#FF0000", // Red
    "Stanislaus River": "#0000FF", // Blue
  };

  const addBoundaries = useCallback(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    const map = mapRef.current;

    // Remove layers and sources for models that are not selected
    models.forEach((model) => {
      if (!modelNames.includes(model.name)) {
        if (map.getLayer(model.name)) {
          map.removeLayer(model.name);
        }
        if (map.getLayer(model.name + "-border")) {
          map.removeLayer(model.name + "-border");
        }
        if (map.getSource(model.name)) {
          map.removeSource(model.name);
        }
      }
    });

    // Add layers and sources for selected models
    models.forEach((model) => {
      if (modelNames.includes(model.name) && !map.getSource(model.name)) {
        map.addSource(model.name, {
          type: "geojson",
          data: model.geojsonUrl,
        });

        map.addLayer({
          id: model.name,
          type: "fill",
          source: model.name,
          layout: {},
          paint: {
            "fill-color": modelColors[model.name] || "#088", // Use the color from the mapping or default to #088
            "fill-opacity": 0.2,
          },
        });

        map.addLayer({
          id: model.name + "-border",
          type: "line",
          source: model.name,
          layout: {},
          paint: {
            "line-color": "black",
            "line-width": 1,
          },
        });
      }
    });
  }, [mapRef, modelNames]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const handleStyleData = () => {
      if (map.isStyleLoaded()) {
        addBoundaries();
      }
    };

    map.on("styledata", handleStyleData);

    return () => {
      map.off("styledata", handleStyleData);
    };
  }, [mapRef, addBoundaries]);

  return addBoundaries;
};

export default useAddBoundaries;