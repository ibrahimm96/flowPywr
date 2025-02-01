"use client"

import React, { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Map from "@/components/map"

const models = ["Merced River", "Tuolumne River", "San Joaquin River", "Stanislaus River"];

export default function ModelVisualization() {
  const [selectedModel, setSelectedModel] = useState(models[0]);   // No default display created yet
  const modelNames = {
    "Merced River": "merced_pywr_model_updated",
    "Tuolumne River": "tuolumne_pywr_model_updated",
    "San Joaquin River": "upper_san_joaquin_pywr_model_updated",
    "Stanislaus River": "stanislaus_pywr_model_updated",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Visualize FlowPywr Model Components</h1>
      <div className="flex justify-between items-start">
        <div className="w-64">
          <p className="text-sm font-medium mb-2">Select Model</p>
          <Select onValueChange={(value) => setSelectedModel(value)} defaultValue={selectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 ml-8">
          <h2 className="text-xl font-semibold mb-4">{selectedModel} Model</h2>
          {/* Pass the modelName to Map component */}
          <Map modelName={modelNames[selectedModel as keyof typeof modelNames]}
           />
        </div>
      </div>
    </div>
  );
}