"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export default function UploadModelFiles() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/json") {
      setSelectedFile(file)
      toast({
        title: "File selected",
        description: `${file.name} has been selected.`,
      })
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a .json file.",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a .json file before uploading.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Upload started",
      description: "Uploading your file...",
    })

    try {
      const storageRef = ref(storage, `model_files/${selectedFile.name}`)
      await uploadBytes(storageRef, selectedFile)
      const downloadURL = await getDownloadURL(storageRef)

      toast({
        title: "Upload complete",
        description: `${selectedFile.name} has been uploaded successfully.`,
      })

      console.log("File available at", downloadURL)
    } catch (error) {
      console.error("Upload failed", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Upload Model Files</h1>
      <div className="mb-4">
        <Label htmlFor="modelFile">Select Model JSON File</Label>
        <Input
          id="modelFile"
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="flex gap-4 mt-2">
          <Button type="button" onClick={() => fileInputRef.current?.click()} className="bg-blue-500 hover:bg-blue-600">
            Select File
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            className="bg-green-500 hover:bg-green-600"
            disabled={!selectedFile}
          >
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </Button>
        </div>
      </div>
      {selectedFile && <p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>}
    </div>
  )
}

