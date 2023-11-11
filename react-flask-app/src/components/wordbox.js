import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import '../styles/wordbox.css';

function Wordbox () {
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState(''); // Initialize the tag input state variable

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

  return(

    <Stack direction="column" className="wordbox-container">

      <Box className="wordbox-header">
        <h1>WORDBOX</h1>
      </Box>

      <Box id="wordlist" className="wordlist">
        GET ALL THE WORDS FROM DATABASE TO DISPLAY HERE
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