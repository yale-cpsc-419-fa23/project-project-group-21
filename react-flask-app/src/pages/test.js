import React from 'react';
import '../styles/test.css';
import Header from "../components/header";
import { Select, InputLabel, MenuItem, Button, Box, Typography } from "@mui/material";

const tagOptions = ['Tag 1', 'Tag 2', 'Tag 3'];

function Test() {
    // This state will store the selected value from the dropdown.
    const [selectedValue, setSelectedValue] = React.useState('');
  
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
  
    return (
        <Box>
            <Header/>
            <div className="testing-container">
                <div className="label-container">
                    <InputLabel 
                        id="flashcard-select-label" 
                        style={{ fontWeight: 'bold' }}
                    >
                        Choose which flashcards you would like to test
                    </InputLabel>
                </div>
                <div className="button-dropdown-container">
                    <Button variant="contained">All flashcards</Button>
                    <Typography variant="subtitle1" style={{ marginTop: '10px', marginLeft: '40px' }}>
                        Choose a tag:
                    </Typography>
                    <Select
                        labelId="flashcard-select-label"
                        id="flashcard-select"
                        value={selectedValue}
                        onChange={handleChange}
                    >
                        <MenuItem disabled value="">
                            <em>Choose a tag</em>
                        </MenuItem>
                        {tagOptions.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
        </Box>
    );
  }
  
  export default Test;
  