import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AccountPage from '../pages/AccountPage';
import VerifyPage from '../pages/VerifyPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import Page404 from '../pages/_404Page';

const AccountRouter = () => {
  return (
    <Routes>
      <Route path='' element={<AccountPage />} />
      <Route path='login' element={<LoginPage />} />
  	  <Route path='register' element={<RegisterPage />} />
      <Route path='verify' element={<VerifyPage />} />
      <Route path='forgot-password' element={<ForgotPasswordPage />} />
      <Route path='reset-password' element={<ResetPasswordPage />} />
      <Route path='*' element={<Page404 />} />
		</Routes>									
  );
};

export default AccountRouter;