import React, { useEffect, useState, } from 'react';
import { Select, InputLabel, MenuItem, Button, Box, Typography } from '@mui/material';

import Header from '../components/header';
import Flipflashcard from '../components/flipFlashcard';

import '../styles/test.css';


function FlashcardContainer({ flashcards, setFlashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0); // state to keep track of flashcard counter

  const handleNext = () => { // Update flashcard counter on 'next'
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => { // Update flashcard counter on 'previous'
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const shuffleCards = () => {
    // Use Fisher-Yates shuffle algorithm
    const shuffledFlashcards = [...flashcards];
    for (let i = shuffledFlashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledFlashcards[i], shuffledFlashcards[j]] = [shuffledFlashcards[j], shuffledFlashcards[i]];
    }
    setFlashcards(shuffledFlashcards);
    setCurrentIndex(0); // Reset currentIndex to the first card after shuffling
  };

  const flashcardCounter = `${currentIndex + 1}/${flashcards.length}`; // actual counter 'component'

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>
        Flashcard {flashcardCounter}
      </Typography>
      <Flipflashcard word={flashcards[currentIndex]} />
      <Box display="flex" justifyContent="space-between" width="60%" marginTop="20px" marginLeft="auto" marginRight="auto">
        <Button 
          variant="contained" 
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
          style={{ marginRight: '10px' }}
        >
          Previous
        </Button>
        <Button 
          variant="contained"
          onClick={shuffleCards}
          style={{ margin: '0 10px', backgroundColor: 'lightgreen', color: 'black' }}
        >
          Shuffle
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          style={{ marginLeft: '10px' }}
        >
          Next
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" width="100%" marginTop="30px" alignItems="center">
        <a href="/test">
          <Button
            variant="contained"
          >
            Test other cards
          </Button>
        </a>
      </Box>
    </Box>
  );
}


function Test() {
  const [selectedValue, setSelectedValue] = useState('');
  const [tags, setTags] = useState([]); // storing current tags, they update on each reloading of the test page
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardsMessage, setFlashcardsMessage] = useState('');

  useEffect(() => { // Make a GET request to Flask API endpoint
    fetch('/retrieve-all-tags')
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    // getCardsTag(event.target.value);
  };

  const handleTestTag = () => {
    if (selectedValue) {
      getCardsTag(selectedValue);
    }
  };

  const getCardsTag = (tag) => {
    console.log(tag);
    fetch(`/retrieve-cards-tag?tag=${tag}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setFlashcards(data);
        } else {
          setFlashcardsMessage('You have not created any flashcards with this tag yet.');
        }
      })
      .catch((error) => console.error('Error fetching flashcards:', error));
  };

  const handleAllFlashcards = () => {
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
          <FlashcardContainer flashcards={flashcards} setFlashcards={setFlashcards} />
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
                  <em></em>
                </MenuItem>
                {tags.map((tag) => (
                  <MenuItem 
                    key={tag[0]} 
                    value={tag[0]}
                  >
                    {tag[0]}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" onClick={handleTestTag}>
                Test Tag
              </Button>
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
