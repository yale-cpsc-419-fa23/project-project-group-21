import { Create, LocalLibrary } from '@mui/icons-material';
import { Button, Stack, Box } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import Tooltip from '@mui/material/Tooltip';
import '../styles/header.css';

function Header() {

  return (

<Stack direction="row" className="header-bar">
      <Box class="title">
        <h2> FLASHCARD WEBSITE </h2>
      </Box>
      
      <Box className="edit">
        <a href="/">
          <Tooltip title="Edit" arrow>
            <Button>
              <Create/>
            </Button>
          </Tooltip>
        </a>
      </Box>
      
      <Box className="library">
        <a href="/library">
          <Tooltip title="Library" arrow>
            <Button>
              <LocalLibrary/>
            </Button>
          </Tooltip>
        </a>
      </Box>

      <Box className="test">
        <a href="/test">
          <Tooltip title="Testing" arrow>
            <Button>
              <QuizIcon/>
            </Button>
          </Tooltip>
        </a>
      </Box>
    </Stack>
  )
}

export default Header;