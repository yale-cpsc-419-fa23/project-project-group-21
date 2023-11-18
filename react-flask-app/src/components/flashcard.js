import "../styles/flashcard.css";
import "../styles/fliptransition.css";

import { Box } from "@mui/material";

function Flashcard({ onClick, word }) {

  return(
    <Box className="flashcard">
      <Box className="card-back">
        <button onClick={onClick}> 
          CLICK TO FLIP!
        </button>
        {word[1]}
      </Box>
      <Box className="card-front">
        <button onClick={onClick}> 
          CLICK TO FLIP!
        </button>
        {word[0]}
      </Box>
    </Box>
  )       
}

export default Flashcard;