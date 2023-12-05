import Header from "../components/header";
import DrawingCanvas from "../components/drawingCanvas";

import React, { useEffect, useState, } from 'react';
import { Select, InputLabel, MenuItem, Button, Box, Typography, Stack } from '@mui/material';

function FuriganaWord( {word, furigana, answer, complete, reset} ) {
  const [wordSplit, setWordSplit] = useState([]);
  const [kanji, setKanji] = useState([]);
  const [answerKanji, setAnsweredKanji] = useState([]);
  const [currKanjiIndex, setCurrKanjiIndex] = useState(0);
  const [currWord, setCurrWord] = useState("")

  useEffect (() => {

    if(currWord !== word) {
      setAnsweredKanji([]);
      setCurrKanjiIndex(0);
    }
    
    setCurrWord(word);

    setWordSplit(word.split(''));
  
    let parsed_kanji = [];
    for (const index in furigana) {
      parsed_kanji.push(furigana[index][0]);
    }
    setKanji(parsed_kanji);

    let answer_arr = answerKanji;
    if(answer === kanji[currKanjiIndex]) {
      answer_arr.push(answer);
      setAnsweredKanji(answer_arr);
      setCurrKanjiIndex(currKanjiIndex + 1);
    }
    
    if(answerKanji.length === kanji.length && kanji.length !== 0) {
      complete(true);
    }
    

  }, [answer, word]);

  return wordSplit.map((char) => {
    const kanjiIndex = furigana.findIndex(([kanjiChar]) => kanjiChar === char);
  
    if (kanjiIndex !== -1) {
      return (
        <Typography key={char} component="ruby" variant="h4">
          {kanji.includes(char) && !answerKanji.includes(char) ? '?' : char}
          <Typography component="rt" variant="body2" color="textSecondary">
            {furigana[kanjiIndex][1]}
          </Typography>
        </Typography>
      );
    }
  
    // Handle the case when the character is not found in the kanji array
    return (
      <Typography key={char} component="ruby" variant="h4">
        {kanji.includes(char) ? '?' : char}
        <Typography component="rt" variant="body2" color="textSecondary">
          &nbsp;
        </Typography>
      </Typography>
    );
  });
}

function Kanji( {flashcards} ) {
  const [currentWord, setCurrentWord] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [word, setWord] = useState('');
  const [furigana, setFurigana] = useState([]);
  const [answer, setAnswer] = useState("");
  const [complete, setComplete] = useState(false);
  const [clear, setClear] = useState(false);

  const handleNext = () => { // Update flashcard counter on 'next'
    setCurrentIndex(currentIndex + 1);
    // getEncodedWord();
    setWord("買う");
    setFurigana([["買", "か"]]);
    setAnswer("");
    setComplete(false);
    setClear(true);
  };

  useEffect(() => {
    
    const fetchData = async () => {
      await getEncodedWord();
    };
  
    fetchData();
  }, []); 

  const getEncodedWord = () => {
    console.log("SAD SAD SAD");
    fetch('/retrieve-furigana', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: flashcards[currentIndex][2] }),
    })
      .then((response) => {
        // Handle the response from the server if needed
        console.log(response);
        if (response.status === 200) {
          console.log(response);
          console.log("HAPPY HAPPY HAPPY");
          setWord("朝ご飯");
          setFurigana([["朝", "あさ"], ["飯", "はん"]]);
        }
      })
      .catch((error) => {
        // Handle errors if the request fails
      });
  };

  return(

    <Box className="content-container">

      <Box className="main-container">
       {currentIndex < flashcards.length - 1 ?
        (<Box className="canvas-container">
            <Stack direction="row">
              <FuriganaWord word={word} furigana={furigana} answer={answer} complete={setComplete}/>
            </Stack>

            <DrawingCanvas setAnswer={setAnswer} clear={clear} clear_func={setClear}/>
            {complete ?  
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button> : 
            <></>
            }
        </Box>) :

        <Box className="canvas-container">
          <Box display="flex" justifyContent="center" width="100%" marginTop="30px" alignItems="center">
            <Typography variant="h4">
              Congrats! You learned the Kanji!
            </Typography>
            <a href="/kanji">
              <Button
                variant="contained"
              >
                Test other cards
              </Button>
            </a>
          </Box>
        </Box>
        }

      </Box>
    </Box>
  )
}

function KanjiTest() {
  const [selectedValue, setSelectedValue] = useState('');
  const [tags, setTags] = useState([]); // storing current tags, they update on each reloading of the test page
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardsMessage, setFlashcardsMessage] = useState('');

  useEffect(() => { // Make a GET request to Flask API endpoint
    fetch('/retrieve-all-tags')
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    // getCardsTag(event.target.value);
  };

  const handleTestTag = () => {
    if (selectedValue) {
      getCardsTag(selectedValue);
    }
  };

  const getCardsTag = (tag) => {
    console.log(tag);
    fetch(`/retrieve-cards-tag?tag=${tag}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setFlashcards(data);
        } else {
          setFlashcardsMessage('You have not created any flashcards with this tag yet.');
        }
      })
      .catch((error) => console.error('Error fetching flashcards:', error));
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Header />
        <div className="testing-container">
        {flashcards.length > 0 ? (
          <Kanji flashcards={flashcards}/>
        ) : (
          <>
            <div className="label-container">
              <InputLabel id="flashcard-select-label" style={{ fontWeight: 'bold' }}>
                Choose the Kanji folder you want to test:
              </InputLabel>
            </div>
            <div className="button-dropdown-container">
              <Typography
                variant="subtitle1"
                style={{ marginTop: '10px', marginLeft: '40px' }}
              >
                Choose a tag:
              </Typography>
              <Select
                labelId="flashcard-select-label"
                id="flashcard-select"
                value={selectedValue}
                onChange={handleChange}
              >
                <MenuItem disabled value="">
                  <em></em>
                </MenuItem>
                {tags.map((tag) => (
                  <MenuItem 
                    key={tag[0]} 
                    value={tag[0]}
                  >
                    {tag[0]}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" onClick={handleTestTag}>
                Test Tag
              </Button>
            </div>
            {flashcardsMessage && (
              <Typography
                variant="subtitle1"
                style={{ color: 'red', marginTop: '10px' }}
              >
                {flashcardsMessage}
              </Typography>
            )}
          </>
        )}
      </div>
    </Box>
  );
}

export default KanjiTest;