"use client"

import React, { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const models = ["Merced River", "Tuolumne River", "San Joaquin River", "Stanislaus River"]

export default function ModelVisualization() {
  const [selectedModel, setSelectedModel] = useState(models[0])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Visualize FlowPywr Model Components</h1>
      <div className="flex justify-between items-start">
        <div className="w-64">
          <p className="text-sm font-medium mb-2">Select Model</p>
          <Select onValueChange={setSelectedModel} defaultValue={selectedModel}>
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
        <div className="flex-1">{/* We will add more components for visualization here later */}</div>
      </div>
    </div>
  )
}
