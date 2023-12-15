import React, { useState, useEffect } from 'react';
import { Stack, Box, List, ListItemButton, ListItemText, Typography, Button } from '@mui/material';
import '../styles/wordbox.css';

function Wordbox ({ onButtonClick, updateBox }) {
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState(''); // Initialize the tag input state variable
  const [words, setWords] = useState([]);
  const [currWord, setCurrWord] = useState('');

  const handleTagButtonClick = () => {
    setShowTagInput(true); // Show the tag input when the button is clicked
  };

  const createTagName = (tagName) => {
    setTagInput('');
    console.log(document.getElementById('tag_textbox'));
    fetch('/add-new-tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tagName }),
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
    setShowTagInput(false); // Hide the tag input box after submission
  };

  const updateWordList = () => {
    return new Promise((resolve, reject) => {
      fetch('/retrieve-all-cards', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then((res) => {
          setWords(res);
          resolve("Words found");
        });
    });
  };

  // RETURN ID NUMBER
  const handleWordClick = (word) => {
    setCurrWord(word);
    onButtonClick(word);
  }

  useEffect(() => {
    const updateWords = async () => {
      await updateWordList();
    };

    updateWords();

  }, [updateBox]);

  return(

    <Stack direction="column" className="wordbox-container">

      <Box className="wordbox-header">
        <h1>WORDBOX</h1>
      </Box>

      <Box id="wordlist" className="wordlist">
        <List className="mainlist" 
          sx={{
            width: '100%',
            maxWidth: 300,
            position: 'relative',
            overflow: 'auto',
            maxHeight: 500,
          }}
        > 
          {words.map((word) => (
            <ListItemButton selected={ word === currWord} onClick={() => handleWordClick(word)}>
              <ListItemText 
                primary={ 
                  <Typography>
                    <span style={{ fontWeight: 'bold' }}>front:</span> {word[0]}{' '}
                    <span style={{ fontWeight: 'bold' }}>back:</span> {word[1]}{' '}
                    <span style={{ fontWeight: 'bold' }}>tag:</span> {word[3]}{' '}
                  </Typography>
                } 
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box className="tag-container" style={{ marginBottom: '10px' }}>
        {showTagInput ? ( // Conditionally render the tag input
          <Box className="centered-textbox">
            <input
              id="tag_textbox"
              type="text"
              placeholder="Enter Tag Name"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <Button onClick={() => createTagName(tagInput)}>Submit</Button>
          </Box>
        ) : (
          <Button onClick={handleTagButtonClick} style={{backgroundColor: 'lightskyblue',}}>Make your tags here</Button>
        )}
      </Box>

    </Stack>
  )
}

export default Wordbox;