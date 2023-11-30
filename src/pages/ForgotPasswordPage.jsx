/* eslint-disable no-unused-vars */
import React from 'react';
import '../styles/account/PreAccount.css'
import MenuBar from '../components/MenuBar';
import TextInput from '../components/TextInput';
import { validate } from 'email-validator';
import { setTabInfo } from '../utils';

const responseTypes = {
	success: "If that email is registered, the instructions were successfully sent!",
	server_error: "An error occured on our end. We're working on it!",
	connection_error: "We couldn't connect to the server. Try again in a bit!",
	email_error: "An error occured while sending the email. Try again in a bit!",
	invalid_email: "Please enter a valid email address.",
}

const ForgotPasswordPage = () => {

	function sendPasswordResetEmail() {

		if (loading || Date.now() < cooldownEnd) return;

		setLoading(true);
		setMessage({success: false, message: ''});

		// Check if email is valid
		if (!validate(enteredEmail)) {
			setMessage({success: false, message: responseTypes.invalid_email});
			return;
		}

		fetch(`https://floracosm-server.azurewebsites.net/forgot-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: enteredEmail })
		})
		.then(response => response.json())
		.then(data => {
			if (!data) {
				setMessage({success: false, message: responseTypes.server_error});
				setLoading(false);
				return;
			}
			setMessage({success: true, message: responseTypes[data.type] || responseTypes.server_error});
			setCooldownEnd(Date.now() + 60000); // cooldown of 1 minute
			setLoading(false);
		})
		.catch(error => {
			setMessage({success: false, message: responseTypes.connection_error});
			setLoading(false);
		})
	}

	const [loading, setLoading] = React.useState(false);
	const [message, setMessage] = React.useState({success: false, message: ''})
	const [enteredEmail, setEnteredEmail] = React.useState('');
	const [cooldownEnd, setCooldownEnd] = React.useState(0);

	const [time, setTime] = React.useState(Date.now());

	React.useEffect(() => {
		// Refresh the component every second whenever the cooldownEnd changes
		if (cooldownEnd === 0) return;
		const interval = setInterval(() => setTime(Date.now()), 1000);
		return () => {
			clearInterval(interval);
		};
	}, [cooldownEnd]);

	React.useEffect(() => {
		setTabInfo('Forgot Password | Floracosm');
	}, []);

  return (
    <div className="generic-page-body">
      <MenuBar />
      <div className="login-page-content">
				<div className='login-form-container'>

					<a className='login-extralink hover-underline-1px' href='/account/login'>&larr; Back</a>

					<h1 className='font-display font-size-40px margin-0px margin-bottom-20px'>Forgot Password</h1>

					<div className='font-size-16px font-weight-500 margin-bottom-20px'>
						Enter the email associated with your account below.
					</div>

					<TextInput
					label='Email'
					type='input'
					internalType='email'
					placeholder='Email'
					initValue={enteredEmail}
					onChange={(e) => setEnteredEmail(e.target.value)} />

					<div className='font-size-14px font-weight-400 margin-top-20px margin-bottom-50px'>
						We will send you an email with a link to reset your password. You may safely close this tab after submitting the form.
					</div>

					{message.message &&
					<div className={`${message.success? 'success-message' : 'error-message'} max-width-100 margin-bottom-20px`}>
						{message.message}
					</div>}

					<button
					disabled={loading || Date.now() < cooldownEnd}
					onClick={sendPasswordResetEmail}
					className={`button-primary button-medium`}>
						{loading? 'Sending...' : 
						Date.now() >= cooldownEnd? 'Send Email' :
						`Send Email (${Math.ceil((cooldownEnd - Date.now()) / 1000)}s)`}
					</button>

				</div>
      </div>
		</div>
  );
};

export default ForgotPasswordPage;