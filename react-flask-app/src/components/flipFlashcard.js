import "../styles/flipflashcard.css";
import Flashcard from "./flashcard";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from 'react'

import { Box } from "@mui/material";

function Flipflashcard({ word }) {
  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    setShowFront(true);
  }, [word]);

  return(
    <Box className="flip-flashcard-container">
      <CSSTransition 
        in={showFront}
        timeout={300}
        classNames="flip"
      >
        <Flashcard onClick={() => {
          setShowFront((v) => !v);
        }}
        word={word}/>
      </CSSTransition>
    </Box>
  )       
}

export default Flipflashcard;