import React, { useState } from 'react';
import '../styles/homepage.css';

function HomePage() {
  const [textboxes, setTextboxes] = useState([]);
  const [savedText, setSavedText] = useState(''); // To store the saved text
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState(''); // Initialize the tag input state variable

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
        }
      })
      .catch((error) => {
        // Handle errors if the request fails
      });
  };

  const updateWordList = () => {
    fetch('/retrieve-all-cards', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then((res) => {
        var div = document.getElementById('wordlist');
        div.innerHTML = '';
        for (var obj of res) {
          div.innerHTML += `<div className="word">${obj}</div>`;
        }
      })
      .catch((error) => {
        // Handle errors if the request fails
      });
  };

  const handleTagButtonClick = () => {
    setShowTagInput(true); // Show the tag input when the button is clicked
  };

  const createTagName = (tagName) => {
    // document.getElementById('tag_textbox').value = '';
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

  return (
    <div className="content-container">
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
              <button onClick={() => {handleSave(index); updateWordList()}} className="create_card_button">
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
          <div id="wordlist" className="wordlist">
            GET ALL THE WORDS FROM DATABASE TO DISPLAY HERE
          </div>
          <div className="tag-container">
            {showTagInput ? ( // Conditionally render the tag input
              <div className="centered-textbox">
                <input
                  id="tag_textbox"
                  type="text"
                  placeholder="Enter Tag Name"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <button onClick={() => createTagName(tagInput)}>Submit</button>
              </div>
            ) : (
              <button onClick={handleTagButtonClick}>Make your tags here</button>
            )}
          </div>
        </div>
      </div>
      <div className="button-container">
      <button>Show All Tags</button>
    </div>
  </div>
  );
}

export default HomePage;
