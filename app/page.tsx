"use client"

import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const images = ["/tuolumne.jpeg", "/home_img1.jpg", "/millerton.jpeg"]

export default function Home() {
  const { loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full mb-8">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index} className="outline-none">
              <div className="relative w-full h-[400px]">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Slide ${index + 1}`}
                  fill
                  style={{
                    objectFit: "cover", // Ensures the image fills the entire container width, cropping if needed
                    objectPosition: "bottom", // Centers the image to avoid awkward cropping
                  }}
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="flex-grow px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to FlowPywr</h1>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Water Resource and Hydropower Generation Optimization App
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            FlowPywr is an advanced optimization Web App designed to maximize the efficiency of water resource
            management and hydropower generation. By leveraging cutting-edge algorithms and real-time data analysis,
            FlowPywr helps stakeholders make informed decisions to balance environmental sustainability with energy
            production needs.
          </p>
          <div
            className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded inline-block text-left"
            role="alert"
          >
            <p className="font-bold">Get Started</p>
            <p>
              Use the sidebar to navigate through the application. Upload your model files or view analysis results.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

