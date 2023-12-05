import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import HomePage from './pages/homepage';
import Library from './pages/library';
import Test from './pages/test';
import KanjiTest from './pages/kanji';

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/library" element={<Library/>}/>
        <Route path="/test" element={<Test/>}/>
        <Route path="/kanji" element={<KanjiTest/>}/>
      </Routes>
    </BrowserRouter>

  )
}

export default App;
