"use client"

import { useState } from 'react';
import useGetCoordinates from '@/hooks/useGetCoordinates';

const Page = () => {
  const [modelName, setModelName] = useState('merced_pywr_model_updated');
  const { coordinates, title } = useGetCoordinates(modelName);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModelName(e.target.value);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{title}</h1>
      
      <div style={styles.selectorContainer}>
        <select onChange={handleModelChange} value={modelName} style={styles.selector}>
          <option value="merced_pywr_model_updated">Merced Model</option>
          <option value="stanislaus_pywr_model_updated">Stanislaus Model</option>
          <option value="tuolumne_pywr_model_updated">Tuolumne Model</option>
          <option value="upper_san_joaquin_pywr_model_updated">Upper San Joaquin Model</option>
        </select>
      </div>
      
      <h2 style={styles.subtitle}>Model Data:</h2>
      <ul style={styles.list}>
        {coordinates && coordinates.length > 0 ? (
          coordinates.map((item, index) => (
            <li key={index} style={styles.listItem}>
              <strong>Name:</strong> {item.name || 'No Name'}
              <br />
              <strong>Coordinates:</strong> 
              {item.coordinates.lat && item.coordinates.lon 
                ? `(${item.coordinates.lat}, ${item.coordinates.lon})` 
                : 'null'}
            </li>
          ))
        ) : (
          <p>No data available</p>
        )}
      </ul>
    </div>
  );
};

const styles: React.CSSProperties = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '2rem',
  },
  selectorContainer: {
    marginBottom: '20px',
  },
  selector: {
    padding: '10px',
    fontSize: '1rem',
  },
  subtitle: {
    marginBottom: '20px',
    fontSize: '1.5rem',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: '15px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '80%',
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
  },
};



export default Page;
