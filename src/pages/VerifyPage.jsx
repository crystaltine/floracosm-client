import React from 'react';
import '../styles/account/PreAccount.css';
import MenuBar from '../components/MenuBar';

const pageDisplays = {
	loading: {
		title: 'Verifying...',
		message: 'Please wait while we verify and create your account...',
		button: {
			type: 'none',
		}
	},

	success: {
		title: 'Email Verified!',
		message: 'Thank you for creating an account! You may visit your account page below:',
		button: {
			type: 'link',
			link: '/account',
			text: 'Go to Account Page',
		}
	},

	alreadyVerified: {
		title: 'Already Verified!',
		message: 'You have already verified your email. Log in with your details on the login page:',
		button: {
			type: 'link',
			link: '/account/login',
			text: 'Log In',
		}
	},

	error: {
		title: 'Error Verifying Email!',
		message: 'An error occurred on our end that prevented us from verifying your email. We\'re working on it!',
		button: {
			type: 'retry',
			text: 'Try again',
		}
	},

	connection_error: {
		title: 'Error Verifying Email!',
		message: 'An error occured, most likely because we couldn\'t connect to the server. Try again in a bit!',
		button: {
			type: 'retry',
			text: 'Try again',
		}
	},

	invalidToken: {
		title: 'Invalid Token!',
		message: 'Are you sure you copied the link correctly? Has it been replaced by another link? Has it expired? If it has been more than seven days since you first registered the account, create a new one.',
		button: {
			type: 'link',
			link: '/account/register',
			text: 'Create Account',
		}
	},

	noToken: {
		title: 'Seriously?',
		message: 'No code was provided! Create an account if you want to verify your email so badly!',
		button: {
			type: 'link',
			link: '/account/register',
			text: 'Create Account',
		}
	},
}

const VerifyPageButton = ({ type, text, link, onRetryClick }) => {
	if (type === 'none')
		return null;

	if (type === 'link')
		return (
			<a className='text-decoration-none' href={link}>
				<button className='button-primary button-medium'>
					{text}
				</button>
			</a>
		);

	if (type === 'retry')
		return (
			<button className='button-primary button-medium' onClick={onRetryClick}>
				{text}
			</button>
		);
}

const VerifyPage = () => {

	document.title = 'Verify Email | Floracosm';

  const URLParams = new URLSearchParams(window.location.search);
	const token = URLParams.get('token');

	const [pageType, setPageType] = React.useState('loading');

	// for updating menubar when server logs us in
	const [displayName, setDisplayName] = React.useState('');

	const tryVerify = React.useCallback(() => {
		fetch(`https://floracosm-server.azurewebsites.net/verify-email?token=${token}&caller=register`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => {
			if (res.status >= 500) {
				setPageType('error');
				return;
			}
			if (res.status === 400) {
				// Incorrect token or something
				setPageType('invalidToken');
				return;
			}
			return res.json();
		})
		.then(data => {
			if (!data)
				return;

			if (!data.success) {
				setPageType(data.type)
				return;
			}

			setPageType('success');

			// Received displayName and avatarRef from response - just save in localStorage
			setDisplayName(data.data.displayName);
			localStorage.setItem('displayName', data.data.displayName);
			localStorage.setItem('avatarRef', data.data.avatarRef);
			localStorage.setItem('username', data.data.username);

			// Set accountlessDisplayName in localstorage:submissionState to just Anonymous
			if (localStorage.getItem('submissionState')) {
				localStorage.setItem('submissionState', JSON.stringify({
					...JSON.parse(localStorage.getItem('submissionState')),
					accountlessDisplayName: 'Anonymous'
				}));
			}

		})
		.catch((e) => { setPageType('error') });
	}, [token]);

	React.useEffect(() => {
		if (!token) {
			setPageType('noToken');
			return;
		}

		tryVerify();
		
	}, [token, tryVerify]);

  return (
    <div className="generic-page-body">
      <MenuBar displayName={displayName} />
      <div className="login-page-content">
				<div className='login-form-container'>

				<h1 className='font-display font-size-40px margin-0px margin-bottom-20px'>
					{pageDisplays[pageType].title}
				</h1>

				<div className='font-size-16px font-weight-500 margin-bottom-50px'>
					{pageDisplays[pageType].message}
				</div>

				<VerifyPageButton
				type={pageDisplays[pageType].button.type}
				text={pageDisplays[pageType].button.text}
				link={pageDisplays[pageType].button.link}
				onRetryClick={() => { setPageType('loading'); tryVerify(); }} />

				</div>
			</div>
    </div>
  );
};

export default VerifyPage;