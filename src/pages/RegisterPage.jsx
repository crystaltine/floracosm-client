import React from 'react';
import '../styles/account/PreAccount.css';
import MenuBar from '../components/MenuBar';
import RegisterWidget from '../components/RegisterWidget';
import RegisterVerify from '../components/RegisterVerify';

const RegisterPage = () => {
	
	document.title = 'Create Account | Floracosm';
	
	const [needsVerification, setNeedsVerification] = React.useState(false);

	// These two states allow for verification email resending
	// password is used to authorize resend email APi access, so others can't spam it
	const [enteredEmail, setEnteredEmail] = React.useState('');
	const [enteredPassword, setEnteredPassword] = React.useState('');

  return (
		<div className="generic-page-body">
      <MenuBar />
      <div className="login-page-content">
				{needsVerification?

					<RegisterVerify 
					setNeedsVerification={setNeedsVerification}
					enteredPassword={enteredPassword}
					enteredEmail={enteredEmail} /> :

					<RegisterWidget
					setNeedsVerification={setNeedsVerification}
					setEnteredPassword={setEnteredPassword}
					setEnteredEmail={setEnteredEmail} />

				}
			</div>
    </div>
  );
};

export default RegisterPage;