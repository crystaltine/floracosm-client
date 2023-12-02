import './styles/general/prebuilt.css';
import './styles/general/prebuilt.css';
import { Route, Routes } from 'react-router-dom';
import React from 'react';

import ExplorePage from './pages/ExplorePage';
import HomePage from './pages/HomePage';
import ContributePage from './pages/ContributePage';
import AboutRouter from './routers/AboutRouter';
import PaymentPage from './pages/PaymentPage';
import CompletionPage from './pages/CompletionPage';
import AccountRouter from './routers/AccountRouter';
//import SpotlightPage from './pages/SpotlightPage';
import Page404 from './pages/_404Page';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvasearth" element={<ExplorePage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/completion' element={<CompletionPage />} />
        <Route path='/about/*' element={<AboutRouter />} />
        <Route path='/account/*' element={<AccountRouter />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
