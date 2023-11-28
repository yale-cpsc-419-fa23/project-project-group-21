import React from 'react';
import { Box } from "@mui/material";
import "../styles/flashcard.css";
import "../styles/fliptransition.css";

function Flashcard({ onClick, word }) {
  return (
    <Box className="flashcard" onClick={onClick}>
      <Box className="card-back">
        {word[1]}
      </Box>
      <Box className="card-front">
        {word[0]}
      </Box>
    </Box>
  );
}

export default Flashcard;
