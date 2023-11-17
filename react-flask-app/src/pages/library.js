import "../styles/library.css"

import Header from "../components/header";
import Wordbox from "../components/wordbox";

import { Box, Card, CardContent, Typography } from "@mui/material";

function Library() {

  const viewFlashcard = (wordId) => {
    // Handle button click logic with the wordId
    console.log(`Viewing flashcard with ID: ${wordId}`);
  };

  return(
    
    <Box className="content-container">
      <Header/>
      
      <Box className="main-container">
        <Box className="flashcard-container">
          <Card>
            <CardContent>
              <Typography>
                THIS IS WHERE THE FLASH CARD GOES
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Wordbox onButtonClick={viewFlashcard}/>

      </Box>
    </Box>
  )
}

export default Library;