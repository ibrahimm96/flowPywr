"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MapSidebar from "@/components/mapSideBar";
import Map from "@/components/map";
import { FaSpinner } from "react-icons/fa";

export default function ModelVisualization() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner fontSize={"40px"} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="relative h-screen"
    >
      <div className="relative h-screen">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="h-screen w-[250px] bg-gray-800">
            <MapSidebar />
          </div>
          {/* Map */}
          <div className="h-full w-full -ml-[250px]">
            <Map />
          </div>
        </div>
      </div>
    </motion.div>
  );
}