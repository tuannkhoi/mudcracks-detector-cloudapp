import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from "@mui/material/Grid";


export default function ProductCard(props) {
	return (
		<Grid item xs={12} md={6} lg={4}>
			<Card>
			<CardMedia
				component="img"
				height="500"
				image={props.image_url}
			/>
			</Card>
        </Grid>
	);
}