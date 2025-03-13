"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./pageStyles.css";

const Page = () => {
  const [formData, setFormData] = useState({
    scenario_set: "",
    start_year: "",
    end_year: "",
    gcm_model: "",
    lgcm_model: ""
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    // Prefill the years and model name based on the selected scenario set
    if (formData.scenario_set === "LOCA2 GCMS") {
      setFormData(prev => ({
        ...prev,
        start_year: "2020",
        end_year: "2050",
        gcm_model: "LOCA2 Model",
        lgcm_model: "LOCA2 GCM"
      }));
    } else if (formData.scenario_set === "GCMS") {
      setFormData(prev => ({
        ...prev,
        start_year: "2020",
        end_year: "2050",
        gcm_model: "GCM Model",
        lgcm_model: "GCM"
      }));
    } else if (formData.scenario_set === "HISTORICAL LIVENH") {
      setFormData(prev => ({
        ...prev,
        start_year: "1980",
        end_year: "2010",
        gcm_model: "Historical Model",
        lgcm_model: "Historical GCM"
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        start_year: "",
        end_year: "",
        gcm_model: "",
        lgcm_model: ""
      }));
    }
  }, [formData.scenario_set]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log(formData);
  };

  return (
    <div className="container">
      <h1 className="title">Model Parameter and Inputs</h1>
      <form onSubmit={handleSubmit} className="form">        
        <div className="form-group">
          <label htmlFor="scenario_set" className="label">Scenario Set</label>
          <select
            name="scenario_set"
            value={formData.scenario_set}
            onChange={handleChange}
            className={`input ${submitted && formData.scenario_set === "" ? "borderRed" : ""}`}
          >
            <option value="">Select a scenario</option>
            <option value="LOCA2 GCMS">LOCA2 GCMS</option>
            <option value="GCMS">GCMS</option>
            <option value="HISTORICAL LIVENH">HISTORICAL LIVENH</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="start_year" className="label">Start Year</label>
          <input
            type="text"
            name="start_year"
            value={formData.start_year}
            onChange={handleChange}
            className={`input ${submitted && formData.start_year === "" ? "borderRed" : ""}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="end_year" className="label">End Year</label>
          <input
            type="text"
            name="end_year"
            value={formData.end_year}
            onChange={handleChange}
            className={`input ${submitted && formData.end_year === "" ? "borderRed" : ""}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gcm_model" className="label">GCM Model Name</label>
          <input
            type="text"
            name="gcm_model"
            value={formData.gcm_model}
            onChange={handleChange}
            className={`input ${submitted && formData.gcm_model === "" ? "borderRed" : ""}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lgcm_model" className="label">LOCA2 GCM Model Name</label>
          <input
            type="text"
            name="lgcm_model"
            value={formData.lgcm_model}
            onChange={handleChange}
            className={`input ${submitted && formData.lgcm_model === "" ? "borderRed" : ""}`}
          />
        </div>

        <motion.button
          type="submit"
          className="submit-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
        >
          Submit
        </motion.button>
      </form>
    </div>
  );
};

export default Page;