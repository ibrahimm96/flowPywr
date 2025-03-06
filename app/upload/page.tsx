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
        {[
          { name: "multiprocessing", label: "Multiprocessing" },
          { name: "num_cores", label: "Number of Cores" },
          { name: "scenario_set", label: "Scenario Set" },
          { name: "start_year", label: "Start Year" },
          { name: "end_year", label: "End Year" },
          { name: "years", label: "Years to Run" },
          { name: "run_name", label: "Run Name" },
          { name: "data_path", label: "Path to the Data Directory" },
          { name: "gcm_model", label: "GCM Model Name" },
          { name: "lgcm_model", label: "LOCA2 GCM Model Name" }
        ].map(({ name, label }) => (
          <div key={name} className="form-group">
            <label htmlFor={name} className="label">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              className={`input ${submitted && formData[name as keyof typeof formData] === "" ? "borderRed" : ""}`}
            />
          </div>
        ))}

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
