import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
const axios = require('axios');

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
	  backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
	  marginLeft: theme.spacing(1),
	  width: 'auto',
	},
  	}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
  	}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
	  padding: theme.spacing(1, 1, 1, 0),
	  // vertical padding + font size from searchIcon
	  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
	  transition: theme.transitions.create('width'),
	  margin: 'dense',
	  width: '100%',
	  [theme.breakpoints.up('sm')]: {
		width: '20ch',
		'&:focus': {
		  width: '40ch',
		},
	  },
	},
  	}));

export default function SearchBar({setImages, setErrMsg}) {
	const [searchTerm, setSearchTerm] = useState('');
	const handleTermChange = event => {
		setSearchTerm(event.target.value);
	}

	const [limit, setLimit] = useState();
	const handleLimitChange = event => {
		setLimit(event.target.value);
	}

	const handleSearch = event => {
		if (event.key === 'Enter') {
		axios
			.get('http://127.0.0.1:4001/api/v1/nasa', {
			params: {
				search: searchTerm,
				limit,
			}
			})
			.then((response) => {
				const { data } = response.data;
				setImages(data);
				setErrMsg(null);
				
			})
			.catch((error) => {
				setErrMsg(error.response.data.errorMessage);
			})
		}
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
		  <AppBar position="static">
			<Toolbar>
			  <Typography
				variant="h6"
				noWrap
				component="div"
				sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
				align="left"
			  >
				Mud Cracks Detector
			  </Typography>
			  <Search>
				<StyledInputBase
					placeholder="Number of images"
					inputProps={{ 'aria-label': 'number' }}
					value={limit}
					onChange={handleLimitChange}
				/>
			  </Search>
			  <Search>
				<SearchIconWrapper>
				  <SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					placeholder="Search…"
					inputProps={{ 'aria-label': 'search' }}
					value={searchTerm}
					onChange={handleTermChange}
					onKeyPress={handleSearch}
				/>
			  </Search>
			</Toolbar>
		  </AppBar>
		</Box>
	  );
}