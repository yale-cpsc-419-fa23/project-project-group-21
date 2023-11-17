import React, { useState } from 'react';
import '../styles/homepage.css';
import Header from '../components/header';
import Button from '@mui/material/Button';
import Wordbox from '../components/wordbox';

function HomePage() {
  const [textboxes, setTextboxes] = useState([]);
  const [savedText, setSavedText] = useState(''); // To store the saved text
  const [updateBox, setUpdateBox] = useState(0);

  const addNewTextBoxes = () => {
    setTextboxes([...textboxes, { front: '', back: '' }]); // Add two empty text boxes as an object
    var create_card_button = document.querySelectorAll('.create_card_button');
    // Make the create card button disappear
    for (var button of create_card_button) {
      button.style.display = 'none';
    }
  };

  const handleTextChange = (index, inputName, value) => {
    const updatedTextboxes = [...textboxes];
    updatedTextboxes[index][inputName] = value;
    setTextboxes(updatedTextboxes);
  };

  const handleSave = (index) => {
    return new Promise((resolve, reject) => {
      const textToSave = [textboxes[index].front, textboxes[index].back]; // Create a tuple from the text boxes
      // Remove textboxes when saved to the database
      var boxes = document.querySelectorAll('.centered-textbox');
      for (var textbox of boxes) {
        textbox.remove();
      }
      // Make the create a card button reappear for the next entry
      var create_card_button = document.querySelectorAll('.create_card_button');
      for (var button of create_card_button) {
        button.style.display = 'inline';
      }
      // Send a POST request to your Flask server with the tuple data
      fetch('/save-tuple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardTuple: textToSave }),
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

  // const updateWordList = () => {
  //   fetch('/retrieve-all-cards', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(res => res.json())
  //     .then((res) => {
  //       var div = document.getElementById('wordlist');
  //       div.innerHTML = '';
  //         for (var obj of res) {
  //           div.innerHTML += `<button className="word">${obj}</button>`;
  //         }
  //     });
  // };

  const editFlashcard = (wordId) => {
    // Handle button click logic with the wordId
    console.log(`Editing flashcard with ID: ${wordId}`);
  };

  const handleSaveButtonClick = async (index) => {
    await handleSave(index);
    setUpdateBox(updateBox + 1);
  }

  return (
    <div className="content-container">
      <Header className="header"/>
      <div className="main-container">
        <div className="flashcard-container">
          <button onClick={addNewTextBoxes} className="create_card_button">
            Create Two Text Boxes
          </button>
          {textboxes.map((text, index) => (
            <div className="centered-textbox" key={index}>
              <textarea
                rows="4"
                cols="50"
                placeholder="Front"
                value={text.text1}
                onChange={(e) => handleTextChange(index, 'front', e.target.value)}
              />
              <textarea
                rows="4"
                cols="50"
                placeholder="Back"
                value={text.text2}
                onChange={(e) => handleTextChange(index, 'back', e.target.value)}
              />
              <button onClick={() => {handleSaveButtonClick(index)}} className="create_card_button">
                Save Tuple
              </button>
            </div>
          ))}
          <div className="centered-text">
            <p>{savedText}</p>
          </div>
        </div>
        <Wordbox onButtonClick={editFlashcard} updateBox={updateBox}/>
      </div>
      <div className="button-container">
      <Button variant="contained">Show All Tags</Button>
    </div>
  </div>
  );
}

export default HomePage;
