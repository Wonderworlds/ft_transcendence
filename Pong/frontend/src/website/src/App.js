import React from 'react';
import './styles/pages/index.scss';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MainPage from './pages/MainPage';
import Home from './pages/Home';
import WaitingMatch from './pages/WaitingMatch';
import Profile from './pages/Profile';

  
  const App = () => {
    return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/WaitingMatch" element={<WaitingMatch/>} />
          <Route path="/Profile" element={<Profile/>} />
        </Routes>
      </BrowserRouter>
    </div>
    );
};

export default App;