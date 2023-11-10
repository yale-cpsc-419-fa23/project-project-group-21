import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import HomePage from './pages/homepage';
import Library from './pages/library';

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/library" element={<Library/>}/>
      </Routes>
    </BrowserRouter>

  )
}

export default App;
