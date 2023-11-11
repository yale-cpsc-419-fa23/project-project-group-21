import { Create, LocalLibrary } from '@mui/icons-material';
import { Button, Stack, Box } from '@mui/material';
import '../styles/header.css';

function Header() {

  return (

<Stack direction="row" className="header-bar">
      <Box class="title">
        <h2> FLASHCARD WEBSITE </h2>
      </Box>
      
      <Box className="edit">
        <a href="/">
          <Button>
            <Create/>
          </Button>
        </a>
      </Box>
      
      <Box className="library">
        <a href="/library">
          <Button>
            <LocalLibrary/>
          </Button>
        </a>
      </Box>
    </Stack>
  )
}

export default Header;