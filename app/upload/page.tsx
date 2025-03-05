"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./pageStyles.css";

const Page = () => {
  const [formData, setFormData] = useState({
    basin: 'upper_san_joaquin',
    debug: false,
    multiprocessing: '',
    num_cores: '',
    include_planning: false,
    planning_months: 8,
    blocks: 5,
    scenario_set: '',
    start_year: '',
    end_year: '',
    years: '',
    run_name: '',
    progress_bar: false,
    no_suffix: false,
    data_path: '/content/cen_sierra_pywr_new/data/',
    gcm_model: '',
    lgcm_model: ''
  });

  useEffect(() => {
    // Add class to body to prevent scrolling
    document.body.classList.add("no-scroll");

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container">
      <h1 className="title">Model Parameter and Inputs</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="basin" className="label">Basin</label>
          <select name="basin" value={formData.basin} onChange={handleChange} className="input">
            <option value="stanislaus">Stanislaus</option>
            <option value="tuolumne">Tuolumne</option>
            <option value="merced">Merced</option>
            <option value="upper_san_joaquin">Upper San Joaquin</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="debug" className="label">Debug</label>
          <select name="debug" value={formData.debug ? 1 : 0} onChange={handleChange} className="input">
            <option value={0}>False</option>
            <option value={1}>True</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="multiprocessing" className="label">Multiprocessing</label>
          <input type="text" name="multiprocessing" value={formData.multiprocessing} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="num_cores" className="label">Number of Cores</label>
          <input type="number" name="num_cores" value={formData.num_cores} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="include_planning" className="label">Include Planning Model</label>
          <select name="include_planning" value={formData.include_planning ? 1 : 0} onChange={handleChange} className="input">
            <option value={0}>False</option>
            <option value={1}>True</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="planning_months" className="label">Planning Months</label>
          <input type="number" name="planning_months" value={formData.planning_months} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="blocks" className="label">Number of Piecewise Blocks</label>
          <input type="number" name="blocks" value={formData.blocks} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="scenario_set" className="label">Scenario Set</label>
          <input type="text" name="scenario_set" value={formData.scenario_set} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="start_year" className="label">Start Year</label>
          <input type="text" name="start_year" value={formData.start_year} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="end_year" className="label">End Year</label>
          <input type="text" name="end_year" value={formData.end_year} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="years" className="label">Years to Run</label>
          <input type="text" name="years" value={formData.years} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="run_name" className="label">Run Name</label>
          <input type="text" name="run_name" value={formData.run_name} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="progress_bar" className="label">Show Progress Bar</label>
          <input type="checkbox" name="progress_bar" checked={formData.progress_bar} onChange={handleChange} className="mr-2" />
        </div>
        <div className="form-group">
          <label htmlFor="no_suffix" className="label">Suppress File Date Suffix in Output</label>
          <input type="checkbox" name="no_suffix" checked={formData.no_suffix} onChange={handleChange} className="mr-2" />
        </div>
        <div className="form-group">
          <label htmlFor="data_path" className="label">Path to the Data Directory</label>
          <input type="text" name="data_path" value={formData.data_path} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="gcm_model" className="label">GCM Model Name</label>
          <input type="text" name="gcm_model" value={formData.gcm_model} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="lgcm_model" className="label">LOCA2 GCM Model Name</label>
          <input type="text" name="lgcm_model" value={formData.lgcm_model} onChange={handleChange} className="input" />
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