import Header from "../components/header";
import Wordbox from "../components/wordbox";
import DrawingCanvas from "../components/drawingCanvas";

import { useState } from "react";

import { Box, Typography } from "@mui/material";

function Kanji() {
  const [currentWord, setCurrentWord] = useState([])

  const viewWord = (word) => {
    console.log(currentWord);
    console.log(`Viewing word with ID: ${word}`);
    setCurrentWord(word);
  };

  return(

    <Box className="content-container">
      <Header/>

      <Box className="main-container">
        <Box className="canvas-container">
            <DrawingCanvas/>
        </Box>

        <Wordbox onButtonClick={viewWord}/>

      </Box>
    </Box>
  )
}

export default Kanji;