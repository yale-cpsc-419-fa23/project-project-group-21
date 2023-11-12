import React from 'react';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

function Test() {
    // This state will store the selected value from the dropdown.
    const [selectedValue, setSelectedValue] = React.useState('');
  
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
  
    return (
      <div>
        <InputLabel id="flashcard-select-label">Choose which flashcards you would like to test</InputLabel>
        <Select
          labelId="flashcard-select-label"
          id="flashcard-select"
          value={selectedValue}
          onChange={handleChange}
        >
          {/* You can map over your flashcard options and create menu items dynamically */}
          <MenuItem value="flashcard1">Flashcard 1</MenuItem>
          <MenuItem value="flashcard2">Flashcard 2</MenuItem>
          <MenuItem value="flashcard3">Flashcard 3</MenuItem>
          {/* Add more menu items as needed */}
        </Select>
      </div>
    );
  }
  
  export default Test;
  