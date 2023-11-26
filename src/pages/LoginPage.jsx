import React from 'react';
import '../styles/account/PreAccount.css';
import MenuBar from '../components/MenuBar';
import TextInput from '../components/TextInput';
import { API, isDevEnv } from '../utils';
import { setTabIcon } from '../App';

const validator = require('email-validator');

const LoginPage = () => {

	document.title = 'Login | Floracosm';
	setTabIcon();

	function submitForm() {

		setLoading(true);

		// Check that email is valid
		if (!validator.validate(email)) {
      setMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

		// Check that a password is entered
		if (password.length === 0) {
			setMessage('Please enter a password.');
			setLoading(false);
			return;
		}

		// This must allow cookies to be set from https://floracosm-server.azurewebsites.net/login
		// in production environment

		console.log(`[Info] fetching ${API(isDevEnv(), '/login')}`)

		fetch(API(isDevEnv(), '/login'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({email, password}),
			credentials: 'include'
		})
		.then(response => {
			if (response.status >= 500) {
				setMessage('An error occured on our end and we couldn\'t log you in... We\'re working on it!');
				setLoading(false);
				return;
			}
			return response.json();
		})
		.then(data => {

			if (!data) {
				setMessage('There was an error retrieving data from the server. Try again in a bit!');
				setLoading(false);
				return;
			}

			if (!data.success) {
				setMessage(data.message);
				setLoading(false);
				return;
			} else {
				// Token should be automatically saved to cookies because the server set the cookie

				// Received displayName and avatarRef from response - just save in localStorage
				localStorage.setItem('displayName', data.data.displayName);
				localStorage.setItem('avatarRef', data.data.avatarRef);
				localStorage.setItem('username', data.data.username);

				// Set accountlessDisplayName in localstorage:submissionState to just Anonymous
				if (!localStorage.getItem('submissionState')) {
					localStorage.setItem('submissionState', JSON.stringify({
						...JSON.parse(localStorage.getItem('submissionState')),
						accountlessDisplayName: 'Anonymous'
					}));
				}

				// redirect after 3 seconds, test for cookie setting
				setTimeout(() => {
					window.location.href = '/account';
				}, 1500);
			}
		})
		.catch((error) => {
			setMessage('There was an error trying to log in - the server is likely unreachable. Try again in a bit!');
			setLoading(false);
			console.error('login error:', error);
		});
	}

	const [message, setMessage] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

  return (
    <div className="generic-page-body">
      <MenuBar />
      <div className="login-page-content">
				<div className='login-form-container'>

					<a className='login-extralink hover-underline-1px' href='/'>&larr; Back</a>

					<h1 className='font-display font-size-40px margin-0px margin-bottom-20px'>Log in</h1>

					<div 
					onKeyDown={(e) => {if (e.key === 'Enter') submitForm()}}
					className='flex-column flex-gap-20px'>

						<TextInput
						type="input"
						internalType="email"
						label="Email"
						maxLength={-1}
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)} />

						<TextInput
						type="input"
						internalType="password"
						label="Password"
						maxLength={-1}
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)} />

						<div className='flex-column flex-gap-10px'>
							<a className='login-extralink hover-underline-1px' href='/account/forgot-password'>Reset Password</a>
							<a className='login-extralink hover-underline-1px' href='/account/register'>Create an Account</a>
						</div>

						{/*
						<div className='flex-column flex-gap-10px'>
							<span className='width-100 text-center font-size-14px'>Or log in using</span>
						
							<div className='flex-row justify-evenly'>

							<button className='login-option-button'>
								<img className='image-30px' src={require('../assets/login/google.png')} alt='Google Icon' />
							</button>

							<button className='login-option-button'>
								<img className='image-30px' src={require('../assets/login/microsoft.png')} alt='Microsoft Icon' />
							</button>

							<button className='login-option-button'>
								<img className='image-30px' src={require('../assets/login/x.png')} alt='X Icon' />
							</button>

							<button className='login-option-button'>
								<img className='image-30px' src={require('../assets/login/facebook.png')} alt='Facebook Icon' />
							</button>

							</div>
						</div>
						*/}

						{message.length > 0 && <div className='error-message width-100'>{message}</div>}
						
						<button 
						disabled={loading} 
						onClick={loading? undefined : submitForm}
						className={`button-primary button-medium`}>
							{loading? "Logging In..." : "Log In"}
						</button>
					
					</div>

				</div>

			</div>
    </div>
  );
};

export default LoginPage;