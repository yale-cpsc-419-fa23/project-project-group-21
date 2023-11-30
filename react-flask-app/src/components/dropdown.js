import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import React, { useState, useEffect } from 'react';

function Dropdown({ setTagId }) {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch('/retrieve-all-tags'); // Replace with your API endpoint
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to update options when the Select menu is opened
  const handleMenuOpen = () => {
    fetchData(); // Fetch data every time the menu is opened
  };


  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
    setTagId(event.target.value[1]);
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="tag-dropdown-label">Tag</InputLabel>
        <Select
          id="tag-dropdown"
          label="Tag"
          value={selectedTag}
          onChange={handleTagChange}
          onOpen={handleMenuOpen}
        >
          {tags.map((tag, index) => (
            <MenuItem key={index} value={tag}>
              {tag[0]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}


export default Dropdown;