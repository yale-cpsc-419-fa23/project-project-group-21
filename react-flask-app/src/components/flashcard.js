import "../styles/flashcard.css";
import "../styles/fliptransition.css";

import { Box } from "@mui/material";

function Flashcard({ onClick }) {

  return(
    <Box className="flashcard">
      <Box className="card-back">
        <button onClick={onClick}> 
          CLICK TO FLIP!
        </button>
        Back
      </Box>
      <Box className="card-front">
        <button onClick={onClick}> 
          CLICK TO FLIP!
        </button>
        FRONT
      </Box>
    </Box>
  )       
}

export default Flashcard;