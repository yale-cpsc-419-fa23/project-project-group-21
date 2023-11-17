import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/test.css';
import Header from "../components/header";
import { Select, InputLabel, MenuItem, Button, Box, Typography } from "@mui/material";

function Test() {
    // This state will store the selected value from the dropdown.
    const [selectedValue, setSelectedValue] = React.useState('');
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Make a GET request to your Flask API endpoint
        fetch('/retrieve-all-tags')
          .then((response) => response.json())
          .then((data) => setTags(data))
          .catch((error) => console.error('Error fetching data:', error));
    }, []);
  
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
      getCardsTag(event.target.value);
    };

    const getCardsTag = (tag) => {
        fetch('retrieve-cards-tag', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tag }),
        })
        .then((response) => {
            // Handle the response from the server if needed
            if (response.status === 200) {
                // Handle success
            } else {
                // Handle other responses or errors
            }
        })
        .catch((error) => {
            // Handle errors if the request fails
        });
    }

    const handleAllFlashcards = () => {
        // If a tag is selected, fetch flashcards for that tag
        if (selectedValue) {
            getCardsTag(selectedValue);
        } else {
            // Fetch all flashcards
            fetch('/retrieve-all-cards')
                .then((response) => response.json())
                .then((data) => {
                    // Redirect to a new page with the flashcards data
                    navigate('/flashcards', {
                        state: { flashcards: data }
                    });
                })
                .catch((error) => console.error('Error fetching flashcards:', error));
        }
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
                    <Button variant="contained" onClick={handleAllFlashcards}>
                        All flashcards
                    </Button>
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
                        {tags.map((tag) => (
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
  