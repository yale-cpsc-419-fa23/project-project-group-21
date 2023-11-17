import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import '../styles/wordbox.css';

function Wordbox ({ onButtonClick, updateBox }) {
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState(''); // Initialize the tag input state variable
  const [words, setWords] = useState([]);

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
    console.log("I SHOULD RETURN THE ID NUMBER");
    console.log(word[2]);
    onButtonClick(word[2]);
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
        {words.map((word) => (
          <button key={word} className="word" onClick={() => handleWordClick(word)}>
            {word}
          </button>
        ))}
      </Box>

      <Box className="tag-container">
        {showTagInput ? ( // Conditionally render the tag input
          <Box className="centered-textbox">
            <input
              id="tag_textbox"
              type="text"
              placeholder="Enter Tag Name"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <button onClick={() => createTagName(tagInput)}>Submit</button>
          </Box>
        ) : (
          <button onClick={handleTagButtonClick}>Make your tags here</button>
        )}
      </Box>

    </Stack>
  )
}

export default Wordbox;