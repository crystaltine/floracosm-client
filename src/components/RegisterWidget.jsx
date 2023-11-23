import React from 'react';
import '../styles/account/PreAccount.css';
import TextInput from '../components/TextInput';
import SwitchOption from '../components/SwitchOption';
const validator = require('email-validator');
const { passwordStrength } = require('check-password-strength')

const passwordStrengthClassnames = ['--too-weak', '--weak', '--medium', '--strong']
const passwordStrengthText = ['Very Weak', 'Weak', 'Medium', 'Strong']

const RegisterWidget = (props) => {

	function submitForm() {

		setLoading(true);

		// Check that email is valid
		if (!validator.validate(formData.email)) {
			setMessage('Please enter a valid email address.');
			setLoading(false);
			return;
		}

		// Check that display name is valid
		if (formData.displayName.length < 3 || formData.displayName.length > 32) {
			setMessage('Display name must be no more than 32 characters and no less than 3 characters long.');
			setLoading(false);
			return;
		}
		
		// Check that username is valid
		if (formData.username.length < 3 || formData.username.length > 32) {
			setMessage('Username must be no more than 32 characters and no less than 3 characters long.');
			setLoading(false);
			return;
		}
		if (!formData.username.match(/^[a-zA-Z0-9_]+$/)) {
			setMessage('Username may only contain letters, numbers, and underscores.');
			setLoading(false);
			return;
		}

		// Check that password strength is strong enough
		if (passwordStrength(formData.password).id < 2) {
			setMessage('Password is too weak. It must be at least "Medium" strength.');
			setLoading(false);
			return;
		}

		// Check that terms and guidelines are accepted
		if (!formData.terms || !formData.guidelines) {
			setMessage('Please accept the Terms and Conditions, Privacy Policy, and Community Guidelines.');
			setLoading(false);
			return;
		}

		// Check that username is available
		fetch(`https://floracosm-server.azurewebsites.net/username-available?username=${formData.username}`)
		.then(response => response.json())
		.then(data => {
			if (!data.available) {
				setMessage('Username has already been taken.');
				setLoading(false);
				return;
			}

			// Check if email is already registered
			fetch(`https://floracosm-server.azurewebsites.net/email-available?email=${formData.email}`)
			.then(response => response.json())
			.then(data => {
				if (!data.available) {
					setMessage('Another account has already been registered with that email.');
					setLoading(false);
					return;
				}

				// Create account
				fetch('https://floracosm-server.azurewebsites.net/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData),
				})
				.then(response => {
					if (response.status >= 500) {
						console.error('Create account error:', response.error);
						setMessage('Error creating account! Try again in a bit!');
						setLoading(false);
					}
					return response.json();
				})
				.then(data => {

					if (!data || !data.success) {
						console.error('Create account error:', data.error);
						setMessage('Error creating account! Try again in a bit!');
						setLoading(false);
						return;
					}

					console.log('Create account success:', data);
					// window.location.href = '/account/login?created=true'; Old (no email verif)
					props.setEnteredEmail(formData.email)
					props.setEnteredPassword(formData.password)
					props.setNeedsVerification(true)
				})
				.catch((error) => {
					console.error('Create account error:', error);
					setMessage('Error creating account! Try again in a bit!');
					setLoading(false);
				});

			})
			.catch((error) => {
				console.error('Checking email available error:', error);
				setMessage('There was an error while checking email availability.');
				setLoading(false);
			});

		})
		.catch((error) => {
			console.error('Checking username available error:', error);
			setMessage('There was an error while checking username availability.');
			setLoading(false);
		});
	}

	const [message, setMessage] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const [strength, setStrength] = React.useState(0);

	const [formData, setFormData] = React.useState({
		displayName: '', username: '', email: '', password: '', passwordConfirm: '',
		reminders: false, terms: false, guidelines: false,
	});

	React.useEffect(() => {
		setStrength(passwordStrength(formData.password).id);
	}, [formData.password]);

  return (
    <div className='login-form-container'>

			<a className='login-extralink hover-underline-1px' href='/'>&larr; Back</a>

			<h1 className='font-display font-size-40px margin-0px margin-bottom-20px'>Create Account</h1>

			<div className='flex-column flex-gap-20px' onKeyDown={(e) => {if (e.key === 'Enter') submitForm()}}>

				<TextInput
				type="input"
				internalType="text"
				label="Display Name"
				maxLength={32}
				placeholder="Display Name"
				value={formData.displayName}
				onChange={(e) => setFormData({...formData, displayName: e.target.value})} />

				<TextInput
				type="input"
				internalType="text"
				label="Username"
				maxLength={32}
				placeholder="Username"
				value={formData.username}
				pattern="[a-zA-Z0-9_]*"
				onChange={(e) => setFormData({...formData, username: e.target.value})} />
			
				<TextInput
				type="input"
				internalType="email"
				label="Email"
				maxLength={-1}
				placeholder="Email"
				value={formData.email}
				onChange={(e) => setFormData({...formData, email: e.target.value})} />

				<div className='flex-column flex-gap-10px'>
					<TextInput
					type="input"
					internalType="password"
					label="Password"
					maxLength={-1}
					placeholder="Password"
					value={formData.password}
					onChange={(e) => setFormData({...formData, password: e.target.value})} />

					{formData.password && <div className={`input-bottom-text ${passwordStrengthClassnames[strength]}`}>Password Strength: {passwordStrengthText[strength]}</div>}
				</div>

				<div className='flex-column flex-gap-10px'>
					<TextInput
					type="input"
					internalType="password"
					label="Confirm Password"
					maxLength={-1}
					placeholder="Confirm Password"
					value={formData.passwordConfirm}
					onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})} />

					{formData.passwordConfirm && formData.password === formData.passwordConfirm?
						<div className='input-bottom-text --strong'>Passwords Match!</div> :
						<div className='input-bottom-text --weak'>Passwords Do Not Match!</div>}
				</div>

				<div className='flex-column flex-gap-10px'>
					<a className='login-extralink hover-underline-1px' href='/account/login'>I already have an account</a>
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

				<div className='flex-column flex-gap-10px'>
				<SwitchOption
				directive="Opt in to receive annual reminder emails if you haven't contributed in the past year"
				selected={formData.reminders}
				toggleSelected={() => setFormData({...formData, reminders: !formData.reminders})}
				outerStyle={{maxWidth: '300px', padding: '10px'}}
				directiveStyle={{fontSize: '12px'}} />

				<SwitchOption
				directive='<div>I agree to the <a href="/about/terms" target="_blank">Terms and Conditions</a> and <a href="/about/privacy" target="_blank">Privacy Policy</a>.</div>'
				selected={formData.terms}
				toggleSelected={() => setFormData({...formData, terms: !formData.terms})}
				outerStyle={{maxWidth: '300px', padding: '10px'}}
				directiveStyle={{fontSize: '12px'}} />

				<SwitchOption
				directive="<div>I assert that any submissions I make to CanvasEarth will adhere to the <a href='/about/guidelines' target='_blank'>Community Guidelines</a> </div>"
				selected={formData.guidelines}
				toggleSelected={() => setFormData({...formData, guidelines: !formData.guidelines})}
				outerStyle={{maxWidth: '300px', padding: '10px'}}
				directiveStyle={{fontSize: '12px'}} />

				</div>

				{message.length > 0 && <div className='error-message width-100'>{message}</div>}

				<button 
				disabled={loading} 
				onClick={loading? undefined : submitForm}
				className={`button-primary button-medium`}>
					{loading? "Creating Account..." : "Create Account"}
				</button>
			
			</div>
		
		</div>
  );
};

export default RegisterWidget;