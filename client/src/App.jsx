import React, { useState } from 'react';
import Grid from "@mui/material/Grid";
import SearchBar from './components/SearchBar';
import ErrorMessage from './components/ErrorMessage';
import ImageCard from './components/ImageCard';
import './App.css';

export default function App() {
	const [images, setImages] = useState([]);
	const [errMsg, setErrMsg] = useState();
	return (
		<div className="App">
			<SearchBar setImages={setImages} setErrMsg={setErrMsg}/>
			<ErrorMessage errMsg={errMsg}/>
			<Grid container spacing={2}>
				{images.map((image) => <ImageCard url = {image}/>)}
			</Grid>
		</div>
  	);
}
