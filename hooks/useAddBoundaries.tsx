import { useCallback } from "react";
import mapboxgl from "mapbox-gl";

const useAddBoundaries = (mapRef: React.RefObject<mapboxgl.Map | null>) => {
  const models = [
    { name: "SJN", geojsonUrl: "/model-boundaries/SJN.geojson" },
    { name: "Merced", geojsonUrl: "/model-boundaries/Merced.geojson" },
    { name: "Stanislaus", geojsonUrl: "/model-boundaries/Stanislaus.geojson" },
    { name: "Tuolumne", geojsonUrl: "/model-boundaries/Tuolumne.geojson" },
  ];

//   const modelNameMap: Record<string, string> = {
//     "Merced River": "merced_pywr_model_updated",
//     "Tuolumne River": "tuolumne_pywr_model_updated",
//     "San Joaquin River": "upper_san_joaquin_pywr_model_updated",
//     "Stanislaus River": "stanislaus_pywr_model_updated",
//   };

  const modelColors: { [key: string]: string } = {
    "SJN": "#FF0000", // Red
    "Merced": "#00FF00", // Green
    "Stanislaus": "#0000FF", // Blue
    "Tuolumne": "#FFFF00", // Yellow
  };

  const addBoundaries = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    models.forEach((model) => {
      if (!map.getSource(model.name)) {
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
  }, [mapRef]);

  return addBoundaries;
};

export default useAddBoundaries;