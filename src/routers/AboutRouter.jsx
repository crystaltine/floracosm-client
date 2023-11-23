import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AboutPage from '../pages/AboutPage';
import Privacy from '../pages/legal/Privacy';
import Terms from '../pages/legal/Terms';
import Page404 from '../pages/_404Page';
import Rules from '../pages/legal/Rules';

const AccountRouter = () => {
  return (
    <Routes>
      <Route path='' element={<AboutPage />} />
      <Route path='terms' element={<Terms />} />
  	  <Route path='privacy' element={<Privacy />} />
      <Route path='rules' element={<Rules />} />
      <Route path='*' element={<Page404 />} />
		</Routes>									
  );
};

export default AccountRouter;