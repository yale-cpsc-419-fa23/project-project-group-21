import React from 'react';
import { Box, Typography } from "@mui/material";
import "../styles/flashcard.css";
import "../styles/fliptransition.css";

function Flashcard({ onClick, word }) {
  return (
    <Box className="flashcard" onClick={onClick}>
      <Box className="card-back">
        <Typography variant='h5'>{word[1]}</Typography>
      </Box>
      <Box className="card-front">
      <Typography variant='h5'>{word[0]}</Typography>
      </Box>
    </Box>
  );
}

export default Flashcard;
