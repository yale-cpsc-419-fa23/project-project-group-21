import "../styles/flipflashcard.css";
import Flashcard from "./flashcard";
import { CSSTransition } from "react-transition-group";
import { useState } from 'react'

import { Box } from "@mui/material";

function Flipflashcard() {
  const [showFront, setShowFront] = useState(true);

  return(
    <Box className="flip-flashcard-container">
      <CSSTransition 
        in={showFront}
        timeout={300}
        classNames="flip"
      >
        <Flashcard onClick={() => {
          setShowFront((v) => !v);
        }}/>
      </CSSTransition>
    </Box>
  )       
}

export default Flipflashcard;