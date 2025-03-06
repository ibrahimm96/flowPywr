"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./pageStyles.css";

const Page = () => {
  const [formData, setFormData] = useState({
    multiprocessing: "",
    num_cores: "",
    scenario_set: "",
    start_year: "",
    end_year: "",
    years: "",
    run_name: "",
    data_path: "/content/cen_sierra_pywr_new/data/",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <label htmlFor="multiprocessing" className="label">Multiprocessing</label>
          <input
            type="text"
            name="multiprocessing"
            value={formData.multiprocessing}
            onChange={handleChange}
            className={`input ${submitted && formData.multiprocessing === "" ? "borderRed" : ""}`}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="num_cores" className="label">Number of Cores</label>
          <input
            type="text"
            name="num_cores"
            value={formData.num_cores}
            onChange={handleChange}
            className={`input ${submitted && formData.num_cores === "" ? "borderRed" : ""}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="scenario_set" className="label">Scenario Set</label>
          <input
            type="text"
            name="scenario_set"
            value={formData.scenario_set}
            onChange={handleChange}
            className={`input ${submitted && formData.scenario_set === "" ? "borderRed" : ""}`}
          />
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
          <label htmlFor="years" className="label">Years to Run</label>
          <input
            type="text"
            name="years"
            value={formData.years}
            onChange={handleChange}
            className={`input ${submitted && formData.years === "" ? "borderRed" : ""}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="run_name" className="label">Run Name</label>
          <input
            type="text"
            name="run_name"
            value={formData.run_name}
            onChange={handleChange}
            className={`input ${submitted && formData.run_name === "" ? "borderRed" : ""}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="data_path" className="label">Path to the Data Directory</label>
          <input
            type="text"
            name="data_path"
            value={formData.data_path}
            onChange={handleChange}
            className={`input ${submitted && formData.data_path === "" ? "borderRed" : ""}`}
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
