import "../styles/library.css"

import Header from "../components/header";
import Wordbox from "../components/wordbox";

import { Box, Card, CardContent, Typography } from "@mui/material";

function Library() {
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

        <Wordbox/>

      </Box>
    </Box>
  )
}

export default Library;