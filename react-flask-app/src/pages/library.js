import "../styles/library.css";

import Header from "../components/header";
import Wordbox from "../components/wordbox";
import Flipflashcard from "../components/flipFlashcard";

import { useState } from "react";

import { Box } from "@mui/material";

function Library() {
  const [currentWord, setCurrentWord] = useState([])

  const viewFlashcard = (word) => {
    // Handle button click logic with the wordId
    console.log(`Viewing flashcard with ID: ${word}`);
    setCurrentWord(word);
  };

  return(
    
    <Box className="content-container">
      <Header/>
      
      <Box className="main-container">
        <Box className="flashcard-container">
          <Flipflashcard word={currentWord}/>
        </Box>

        <Wordbox onButtonClick={viewFlashcard}/>

      </Box>
    </Box>
  )
}

export default Library;