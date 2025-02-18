import React, { useState } from 'react';
import '../styles/homepage.css';
import Header from '../components/header';
import Wordbox from '../components/wordbox';
import Dropdown from '../components/dropdown';
import { Button, Box } from '@mui/material';

function HomePage() {
  const [textboxes, setTextboxes] = useState([]);
  const [savedText, setSavedText] = useState(''); // To store the saved text
  const [updateBox, setUpdateBox] = useState(0);
  const [createCardVisible, setCreateCardVisible] = useState(true);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  const [tagId, setTagId] = useState(-1);

  const addNewTextBoxes = () => {
    setTextboxes([...textboxes, { front: "", back: "" }]); // Add two empty text boxes as an object
    // Make the create card button disappear
    setCreateCardVisible(false);
  };

  const handleTextChange = (index, inputName, value) => {
    const updatedTextboxes = [...textboxes];
    updatedTextboxes[index][inputName] = value;
    setTextboxes(updatedTextboxes);
  };

  const handleSave = (index) => {
    return new Promise((resolve, reject) => {
      const textToSave = [textboxes[index].front, textboxes[index].back]; // Create a tuple from the text boxes
      // Removes the textboxes
      setTextboxes((prevTextboxes) =>
        prevTextboxes.filter((_, i) => i !== index)
      );
      // Make the create a card button reappear for the next entry
      setCreateCardVisible(true);
      // Send a POST request to your Flask server with the tuple data
      fetch('/save-tuple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardTuple: textToSave, tagId: tagId }),
      })
        .then((response) => {
          // Handle the response from the server if needed
          if (response.status === 200) {
            setSavedText(textToSave.join(', '));
            resolve('Saved to database.');
          }
        })
        .catch((error) => {
          // Handle errors if the request fails
        });
      });

  };

  const handleEdit = (index) => {
    return new Promise((resolve, reject) => {
      setEdit(false);
      const textToSave = [textboxes[index].front, textboxes[index].back]; // Create a tuple from the text boxes
      // Removes the textboxes
      setTextboxes((prevTextboxes) =>
        prevTextboxes.filter((_, i) => i !== index)
      );
      // Make the create a card button reappear for the next entry
      setCreateCardVisible(true);
      // Send a POST request to your Flask server with the tuple data
      fetch('/edit-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardTuple: textToSave, id: id, tagId: tagId }),
      })
        .then((response) => {
          // Handle the response from the server if needed
          if (response.status === 200) {
            setSavedText(textToSave.join(', '));
            resolve('Saved to database.');
          }
        })
        .catch((error) => {
          // Handle errors if the request fails
        });
      });
  }

  const editFlashcard = (word) => {
    // Clear all previous items
    setCreateCardVisible(false);
    // Change the textbox text
    setTextboxes([{ front: word[0], back: word[1] }]);
    setEdit(true);
    setId(word[2]);
  };

  const handleTagId = (id) => {
    setTagId(id);
  } 

  const handleSaveButtonClick = async (index) => {
    if(edit === true) {
      await handleEdit(index);
    } else {
      await handleSave(index);
    }
    setUpdateBox(updateBox + 1);
    setTagId(-1);
  }

  return (
    <div className="content-container">
      <Header className="header"/>
      <div className="main-container">
        <div className="flashcard-container">
          <Button onClick={addNewTextBoxes} 
            className="create_card_button" 
            style={{'display': `${createCardVisible ? 'inline' : 'none'}`, backgroundColor: 'lightskyblue',}}
          >
            Create a Flashcard
          </Button>
          {textboxes.map((text, index) => (
            <div className="centered-textbox" key={index} style={{ padding: '30px' }}>
              <textarea
                rows="4"
                cols="50"
                placeholder="Front"
                value={text.front}
                onChange={(e) => handleTextChange(index, 'front', e.target.value)}
              />
              <textarea
                rows="4"
                cols="50"
                placeholder="Back"
                value={text.back}
                onChange={(e) => handleTextChange(index, 'back', e.target.value)}
              />
              <Dropdown setTagId={handleTagId}/>
              <Box>
                <Button 
                  onClick={() => {handleSaveButtonClick(index)}} 
                  className="create_card_button" 
                  style={{
                    backgroundColor: 'lightskyblue',
                    marginTop: '0px', 
                    marginLeft: '-10px', 
                    fontSize: '12px',   
                    padding: '8px 2px', 
                  }}
                  >
                  Save Card
                </Button>
                <a href="/">
                  <Button 
                    className="cancel_button" 
                    style={{
                      backgroundColor: 'coral',
                      marginTop: '0px', 
                      marginLeft: '10px', 
                      fontSize: '12px',   
                      padding: '8px 2px', 
                      color: 'white',
                    }}
                  >
                    Cancel
                  </Button>
                </a>
              </Box>   
            </div>
          ))}
        </div>
        <Wordbox onButtonClick={editFlashcard} updateBox={updateBox}/>
      </div>
    </div>
  );
}

export default HomePage;
