/* eslint-disable no-unused-vars */
import React from 'react';
import '../styles/account/PreAccount.css';

const states = {
	initial: {
		title: 'Verify Email',
		message: 'A verification email has been sent to your email address. Please click the link in the email to verify your account.',
		message2: 'Make sure you check your spam folder if you don\'t see the email in your inbox.',
		message3: 'Every link will expire in 7 days. You will need to create a new account if your account is not verified within 7 days.',
		buttonType: 'resend',
	},
	invalid_email: {
		title: 'Invalid Email!',
		message: "The email address you entered is invalid. Has it been seven days since you first registered? If so, create a new account with that email.",
		message2: "Accounts that have been unverified for more than seven days are automatically removed. You may use the same email to create a new account.",
		buttonType: 'create-new',			
	},
	success: {
		title: 'Email resent!',
		message: 'A verification email has been sent to your email address. Please click the link in the email to verify your account.',
		message2: 'Use the new link that has been sent to your inbox. All old links have been invalidated.',
		message3: 'Every link will expire 7 days after you create your account. You will need to create a new one if it is not verified within those 7 days.',
		buttonType: 'resend',
	},
	server_error: {
		title: 'Oops!',
		message: 'There was an error while contacting the server. Try again in a bit!',
		message2: 'An internal server error occured while attempting to complete the verification process.',
		buttonType: 'resend',
	},
	email_error: {
		title: 'Oops!',
		message: 'There was an error while contacting the server. Try again in a bit!',
		message2: 'An internal server error occured while attempting to send the verification email.',
		buttonType: 'resend',
	},
	already_verified: {
		title: 'You\'re all good!',
		message: 'Your email has already been verified. You may log in below.',
		message2: 'If you have forgotten your password, you may reset it by clicking the "Forgot Password?" link on the login page.',
		message3: 'Thanks for joining us!',
		buttonType: 'login',
	},
	// incorrect_password shouldn't be possible on the frontend, its mainly for unauthorized requests
}

const RegisterVerify = (props) => {

	function requestEmailResend(email, password) {

		if (cooldownEnd > Date.now()) { // cooldown is still active
			setMessage('Please wait a minute before resending the email.');
			setResendSuccess(false);
			return;
		}
		
		fetch(`https://floracosm-server.azurewebsites.net/resend-verification-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password }) // Password used so others can't spam the API
		})
		.then(response => response.json())
		.then(data => {
			if (!data) {
				setMessage('There was an error retrieving data from the server. Try again in a bit!');
				setLoading(false);
				return;
			}

      setWidgetState(states[data.type] || states.server_error);
			if (!data.success) {
				setMessage(data.message);
				setLoading(false);
				return;
			} else {
				setMessage('Verification email sent! Make sure you check your spam folder if you don\'t see the email in your inbox.');
				setCooldownEnd(Date.now() + 60000); // cooldown of 1 minute
				setResendSuccess(true);
				setLoading(false);
				return;
			}
		})
		.catch(() => {
			setMessage('There was an error while contacting the server. Try again in a bit!');
			setLoading(false);
			return;
		});
	}

	const [resendSuccess, setResendSuccess] = React.useState(false);
	const [message, setMessage] = React.useState(''); // the one that appears near the button
	const [loading, setLoading] = React.useState(false);

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

	const [widgetState, setWidgetState] = React.useState(states.initial);

  return (
    <div className='login-form-container'>

			<a className='login-extralink hover-underline-1px' href='/account/register'>&larr; Back</a>

			<h1 className='font-display font-size-40px margin-0px margin-bottom-20px'>{widgetState.title}</h1>

			<div className='font-size-18px font-weight-500 margin-bottom-10px'>
				{widgetState.message}
			</div>

			<div className='font-size-14px font-weight-400 margin-bottom-10px'>
				{widgetState.message2}
			</div>

			<div className='font-size-14px font-weight-400 margin-bottom-50px'>
				{widgetState.message3}
			</div>

			{message &&
			<div className={`${resendSuccess? 'success-message' : 'error-message'} max-width-100 margin-bottom-20px`}>
				{message}
			</div>}

			{widgetState.buttonType === 'resend'?
				<button 
				disabled={loading || Date.now() < cooldownEnd}
				className={`button-primary button-medium`}
				onClick={() => requestEmailResend(props.enteredEmail, props.enteredPassword)}>
					{loading? 'Sending...' : 
					Date.now() < cooldownEnd? `Resend Email (${Math.ceil((cooldownEnd - Date.now()) / 1000)}s)` : 'Resend Email'}
				</button> :

				(widgetState.buttonType === 'create-new'?
				<a className='text-decoration-none' href='/account/register'>
					<button className={`button-primary button-medium`}>
						Create New Account
					</button>
				</a> :

				<a className='text-decoration-none' href='/account/login'>
					<button className={`button-primary button-medium`}>
						Log In
					</button>
				</a>)
			}

		</div>
  );
};

export default RegisterVerify;