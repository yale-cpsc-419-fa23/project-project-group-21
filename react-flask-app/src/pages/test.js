import React, { useEffect, useState } from 'react';
import '../styles/test.css';
import Header from '../components/header';
import { Select, InputLabel, MenuItem, Button, Box, Typography } from '@mui/material';
import Flipflashcard from '../components/flipFlashcard';

function FlashcardContainer({ flashcards }) {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    };
  
    const handlePrevious = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };
  
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Flipflashcard word={flashcards[currentIndex]} />
        <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
          <Button variant="contained" onClick={handlePrevious}>
            Previous
          </Button>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    );
  }

function Test() {
  const [selectedValue, setSelectedValue] = React.useState('');
  const [tags, setTags] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardsMessage, setFlashcardsMessage] = useState('');

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
            setFlashcards(data);
          } else {
            setFlashcardsMessage('You have not created any flashcards yet.');
          }
        })
        .catch((error) => console.error('Error fetching flashcards:', error));
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Header />
      <div className="testing-container">
        {flashcards.length > 0 ? (
          <FlashcardContainer flashcards={flashcards} />
        ) : (
          <>
            <div className="label-container">
              <InputLabel id="flashcard-select-label" style={{ fontWeight: 'bold' }}>
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
