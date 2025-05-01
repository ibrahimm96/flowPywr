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
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
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
          {/* Map */}
          <div className="flex-1 relative">
            <Map />
            {/* Sidebar */}
            <div className="absolute top-0 left-0 h-screen w-[250px] z-10">
              <MapSidebar />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}