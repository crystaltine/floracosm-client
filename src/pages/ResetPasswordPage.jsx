import React from 'react';
import '../styles/account/PreAccount.css'
import MenuBar from '../components/MenuBar';
import TextInput from '../components/TextInput';
import { passwordStrength } from 'check-password-strength';
import { setTabInfo } from '../utils';

const passwordStrengthClassnames = ['--too-weak', '--weak', '--medium', '--strong']
const passwordStrengthText = ['Very Weak', 'Weak', 'Medium', 'Strong']

const displayStates = {
	default: {
		title: "Reset Password",
		subtitle: "Enter your new password below. It must be rated at least 'medium' strength.",
		buttonType: "submit",
	},
	checkError: {
		title: "Oops!",
		subtitle: "There was a problem on our end while handling your request. Try going back and requesting another forgot password email.",
		buttonType: "back",
	},
	invalidToken: {
		title: "Invalid Token",
		subtitle: "The token you provided is invalid. Maybe it's expired? Tokens only last for 10 minutes. Try requesting another forgot password email.",
		buttonType: "back",
	},
	success: {
		title: "Password Reset!",
		subtitle: "Your password has been successfully reset. You can now log in with your new password.",
		buttonType: "login",
	},
	loading: {
		title: "Loading...",
		subtitle: "Loading...",
		buttonType: "back",
	}
}

const ResetPasswordPage = () => {

	React.useEffect(() => {
		const URLParams = new URLSearchParams(window.location.search);
		const token = URLParams.get('token');

		setTabInfo('Reset Password | Floracosm')

		// Verify token
		fetch(`https://floracosm-server.azurewebsites.net/check-reset-token?token=${token}`)
		.then(response => response.json())
		.then(data => {
			if (!data || data.type === "server_error") {
				setCompState('checkError');
				return;
			}

			if (data.type === "invalid_token") {
				setCompState('invalidToken');
				return;
			}

			setCompState('default');
		})
		.catch(error => {
			setCompState('checkError');
		})
	}, [])

	function requestPasswordUpdate() {

		setMessage({success: false, message: ''});

		// If passwords don't match, return
		if (password !== passwordConfirm) {
			setMessage({success: false, message: "Passwords do not match."});
			return;
		}

		// Check password strength
		const passwordStrengthResult = passwordStrength(password);
		if (passwordStrengthResult.id < 2) {
			setMessage({success: false, message: "Your new password is too weak."});
			return;
		}

		// Get token
		const URLParams = new URLSearchParams(window.location.search);
		const token = URLParams.get('token');

		// Send request
		setLoading(true);
		fetch(`https://floracosm-server.azurewebsites.net/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ token, password })
		})
		.then(response => response.json())
		.then(data => {
			if (!data) {
				setMessage({success: false, message: "An error occurred on our end. We're working on it!"});
				setLoading(false);
				return;
			}
			if (!data.success) {
				setMessage({success: false, message: data.message || "An error occurred while resetting your password. Try again in a bit!"});
				setLoading(false);
				return;
			}
			setMessage({success: true, message: "Password successfully reset!"});
			setCompState('success');
			setLoading(false);
		})
		.catch(error => {
			setMessage({success: false, message: "We couldn't connect to the server. Try again in a bit!"});
			setLoading(false);
		})
	}

	const [compState, setCompState] = React.useState('loading'); // Stores text on the screen
	const [loading, setLoading] = React.useState(false);
	const [message, setMessage] = React.useState({success: false, message: ''})

	const [password, setPassword] = React.useState('');
	const [passwordConfirm, setPasswordConfirm] = React.useState('');

	const [strength, setStrength] = React.useState(0);

  return (
    <div className="generic-page-body">
      <MenuBar />
      <div className="login-page-content">
				<div className='login-form-container'>

					<h1 className='font-display font-size-40px margin-0px margin-bottom-20px'>{displayStates[compState].title}</h1>

					<div className='font-size-16px font-weight-500 margin-bottom-20px'>
						{displayStates[compState].subtitle}
					</div>

					{compState === 'default'?
						<div className='flex-column flex-gap-20px margin-bottom-50px'>
							<div>
								<TextInput
								type='input'
								internalType='password'
								label='New Password'
								placeholder='New Password'
								initValue={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setStrength(passwordStrength(e.target.value).id);
								}}/>
								{password.length?
								<div className={`input-bottom-text flyin-top ${passwordStrengthClassnames[strength]}`}>
									Password Strength: {passwordStrengthText[strength]}
								</div> : null}
							</div>

							<div>
								<TextInput
								type='input'
								internalType='password'
								label='Confirm Password'
								placeholder='Confirm Password'
								initValue={passwordConfirm}
								onChange={(e) => setPasswordConfirm(e.target.value)} />

								{((password !== passwordConfirm) && password.length)?
								<div className='input-bottom-text text-right flyin-top --too-weak'>
									Passwords do not match!
								</div> : 
								<div className='input-bottom-text text-right flyin-top --strong'>
									Yay! Passwords match!
								</div>}
								
							</div>
						</div> : null}

					{message.message &&
					<div className={`${message.success? 'success-message' : 'error-message'} max-width-100 margin-bottom-20px`}>
						{message.message}
					</div>}

					{displayStates[compState].buttonType === 'submit'?
						<button
						disabled={loading}
						onClick={requestPasswordUpdate}
						className={`button-primary button-medium`}>
							Reset
						</button> :

						displayStates[compState].buttonType === 'back'?
							<a className='text-decoration-none' href='/account/forgot-password'>
								<button
								disabled={loading}
								className={`button-primary button-medium`}>
									Back
								</button>
							</a> :

						<a className='text-decoration-none' href='/account/login'>
							<button
							disabled={loading}
							className={`button-primary button-medium`}>
								Log In
							</button>
						</a>
					}

				</div>
      </div>
		</div>
  );
};

export default ResetPasswordPage;