import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import LogIn from './pages/LogIn';

  
  const App = () => {
    return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/LogIn" element={<LogIn/>} />
        </Routes>
      </BrowserRouter>
    </div>
    );
};

export default App;