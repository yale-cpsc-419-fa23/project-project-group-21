import React, { useEffect, useState } from 'react';
import '../styles/test.css';
import Header from '../components/header';
import {
  Select,
  InputLabel,
  MenuItem,
  Button,
  Box,
  Typography,
} from '@mui/material';

// New Flashcard component to render flashcard data
const FlashcardDisplay = ({ flashcards }) => (
  <div>
    <h2>All Flashcards</h2>
    <ul>
      {flashcards.map((flashcard, index) => (
        <li key={index}>
          <strong>Front:</strong> {flashcard[0]}
          <br />
          <strong>Back:</strong> {flashcard[1]}
          <br />
        </li>
      ))}
    </ul>
  </div>
);

function Test() {
  const [selectedValue, setSelectedValue] = React.useState('');
  const [tags, setTags] = useState([]);
  const [flashcards, setFlashcards] = useState([]); // State to store flashcards data
  const [flashcardsMessage, setFlashcardsMessage] = useState('');
  const [displayFlashcards, setDisplayFlashcards] = useState(false);

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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Handle success
        } else {
          // Handle other responses or errors
        }
      })
      .catch((error) => {
        // Handle errors if the request fails
      });
  };

  const handleAllFlashcards = () => {
    if (selectedValue) {
      getCardsTag(selectedValue);
    } else {
      fetch('/retrieve-all-cards')
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            // Set flashcards data and display the FlashcardDisplay component
            setFlashcards(data);
            setDisplayFlashcards(true);
          } else {
            setFlashcardsMessage('You have not created any flashcards yet.');
          }
        })
        .catch((error) => console.error('Error fetching flashcards:', error));
    }
  };

  return (
    <Box>
      <Header />
      <div className="testing-container">
        {/* Conditionally render original components or FlashcardDisplay */}
        {displayFlashcards ? (
          <FlashcardDisplay flashcards={flashcards} />
        ) : (
          <>
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
              <Typography
                variant="subtitle1"
                style={{ marginTop: '10px', marginLeft: '40px' }}
              >
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
            {flashcardsMessage && (
              <Typography
                variant="subtitle1"
                style={{ color: 'red', marginTop: '10px' }}
              >
                {flashcardsMessage}
              </Typography>
            )}
          </>
        )}
      </div>
    </Box>
  );
}

export default Test;
