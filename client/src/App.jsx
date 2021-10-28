import React, { useState } from 'react';
import Grid from "@mui/material/Grid";
import SearchBar from './components/SearchBar';
import ImageCard from './components/ImageCard';
import './App.css';
 
export default function App() {
  const [images, setImages] = useState([])
  return (
    <div className="App">
      <SearchBar setImages={setImages}/>
      <p>Mud Cracks Detector app</p>
      <Grid container spacing={2}>
                {images.map(image => <ImageCard {...images}/>)}
		    </Grid>
    </div>
  );
}