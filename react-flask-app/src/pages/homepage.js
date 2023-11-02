import React, { useState } from 'react';
import '../styles/homepage.css';

function HomePage() {
  const [textboxes, setTextboxes] = useState([]);
  const [savedText, setSavedText] = useState(''); // To store the saved text

  const addNewTextBoxes = () => {
    setTextboxes([...textboxes, { front: '', back: '' }]); // Add two empty text boxes as an object
  };

  const handleTextChange = (index, inputName, value) => {
    const updatedTextboxes = [...textboxes];
    updatedTextboxes[index][inputName] = value;
    setTextboxes(updatedTextboxes);
  };

  const handleSave = (index) => {
    const textToSave = [textboxes[index].front, textboxes[index].back]; // Create a tuple from the text boxes
    var elements = document.querySelectorAll('.centered-textbox');  
    for (var element of elements) {
      element.remove();
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
        }
      })
      .catch((error) => {
        // Handle errors if the request fails
      });
  };

  return (
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
            <button onClick={() => handleSave(index)} className="create_card_button">
              Save Tuple
            </button>
          </div>
        ))}
        <div className="centered-text">
          <p>{savedText}</p>
        </div>
      </div>

      <div className="wordbox-container">
        <div className="wordbox-header">
          <h1>WORDBOX</h1>
        </div>
        <div className="wordlist">
          GET ALL THE WORDS FROM DATABASE TO DISPLAY HERE
        </div>
        <div className="tag-container">
          <button>Make your tags here</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
