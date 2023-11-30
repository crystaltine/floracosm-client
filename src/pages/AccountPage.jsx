import React from 'react';
import '../styles/account/AccountPage.css';
import MenuBar from '../components/MenuBar';
import ImageUploadArea from '../components/ImageUploadArea';
import { HeaderedPopup } from '../components/CenteredPopup';
import TextInput from '../components/TextInput';
import SwitchOption from '../components/SwitchOption';
import { LoadingBox } from '../components/LoadingBox';
import ImageCropper from '../components/ImageCropper';
import PastPaymentItem from '../components/PastPaymentItem';
import Footer from '../components/Footer';
import ProfileDisplay from '../components/ProfileDisplay';
import { loginStatus } from '../App';
import { setTabInfo } from '../utils';
const { passwordStrength } = require('check-password-strength')

const passwordStrengthClassnames = ['--too-weak', '--weak', '--medium', '--strong']
const passwordStrengthText = ['Very Weak', 'Weak', 'Medium', 'Strong']

function p2(number) {
	return (number < 10 ? '0' : '') + number
}

export function dateize(unixTimestamp) {
  // Create a new Date object from the Unix timestamp (in milliseconds)
  const date = new Date(Math.floor(unixTimestamp));

  // Get the month, day, and year
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();

	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	const timeZoneAbbreviation = date.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];

  // Format the date in the desired format
  const formattedDate = `${month}. ${p2(day)}, ${p2(year)}`;
	const formattedTime = `${p2(hour)}:${p2(minute)}:${p2(second)} ${timeZoneAbbreviation}`;

  return {formattedDate, formattedTime}
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

const SelectAllButton = (props) => {
	return (
		<button 
		className={`button-small nowrap-selectall-btn ${props.selectAll? 'button-primary' : 'button-danger'}`}
		onClick={() => props.onClick(props.optionsToChange)}>
			{props.selectAll? 'Select All' : 'Deselect All'}
		</button>
	)
}

const AccountPage = () => {

	function selectAll(optionNames) {
		optionNames.forEach(name => {
			setUserData(prev => ({...prev, [name]: true}));
		});
		const updateData = {};
		optionNames.forEach(name => updateData[name] = true);
		pushChanges(updateData);
	}
	function deselectAll(optionNames) {
		optionNames.forEach(name => {
			setUserData(prev => ({...prev, [name]: false}));
		});
		const updateData = {};
		optionNames.forEach(name => updateData[name] = false);
		pushChanges(updateData);
	}
	
	function pushChanges(data = null, refetchDisplayData = false) {
		/*
		If no fields and values are specified, this function
		sends the current user data to the server to be saved.

		Otherwise only update specified fields with specified values

		This function should be called on every "savey" action,
		such as clicking the checkmark on a text input
		or selecting one of the switch options.

		refetchDisplayData if display Name, username, or avatarRef was changed
		*/

		// If no data specified, send all user data
		data ||= userData;

		const oldUserData = userData;
		setUserData(prev => ({...prev, ...data}));

		// Don't send if displayName is <3 or >32 characters
		if (data.displayName && (data.displayName.length < 3 || data.displayName.length > 32)) {
			setMessage({...message, userData: 'Display name must be between 3 and 32 characters.'})
			setUserData(oldUserData);
			setVisiblePopup('data-change-error');
			return;
		}

		fetch('https://floracosm-server.azurewebsites.net/update-user-data', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		.then(res => {
			if (res.status === 401) {
				// Not logged in
				window.location.href = '/account/login?ref=authreject';
			} else if (res.status >= 500) {
				setMessage({...message, userData: 'An error happened our end when trying to update your data! We\'re working on it!'})
				setVisiblePopup('data-change-error');
				return;
			}
			return res.json();
		})
		.then(srv_data => {
			if (!srv_data || !srv_data.success) {
				// console.error('Error saving user data:', srv_data.error);
				setMessage({...message, userData: srv_data.message || "Error saving user data! Try again in a bit!"})
				setVisiblePopup('data-change-error');
				setUserData(oldUserData);
				return;
			}

			if (refetchDisplayData) {
				// Refetch display data if username changed, etc. (For menubar and other quick displays)
				fetch(`https://floracosm-server.azurewebsites.net/get-user-data?email=${userData.email}`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
				})
				.then(res => {
					if (res.status >= 500) {
						// console.error('Error getting user display data:', res.error);
						return;
					}
					return res.json();
				})
				.then(srv_data2 => {
					localStorage.setItem("displayName", srv_data2.data.displayName);
					setMenubarDisplayName(srv_data2.data.displayName);
					localStorage.setItem("avatarRef", srv_data2.data.avatarRef);
					localStorage.setItem("username", srv_data2.data.username);

					setUserData(prev => ({...prev, ...srv_data2.data}));
				})
				.catch(error => {
					// console.error('Error contacting server for user display data:', error);
				});
			}

			setMessage({...message, userData: null});
			setUserData(prev => ({...prev, ...data}));

		})
		.catch(error => {
			// console.error('Error contacting server to save user data:', error);
			setMessage({...message, userData: 'An error happened when trying to reach the server. Try again in a bit!'})
			setVisiblePopup('data-change-error');
			setUserData(oldUserData);
		});
	}

	function changeUsername(newUsername) {

		// Validate only alphanumeric and underscore
		if (!username.match(/^[a-zA-Z0-9_]+$/)) {
			setMessage({...message, username: 'Username may only contain letters, numbers, and underscores.'});
			setLoading({...loading, username: false})
			setUsername(userData.username); // back to original username in the input field
			return;
		}
		if (username.length < 3 || username.length > 32) {
			setMessage({...message, username: 'Username must be between 3 and 32 characters.'});
			setLoading({...loading, username: false})
			setUsername(userData.username); // back to original username in the input field
			return;
		}

		setLoading({...loading, username: true})
		fetch('https://floracosm-server.azurewebsites.net/change-username', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({username: newUsername})
		})
		.then(res => {
			if (res.status === 401) {
				// Not logged in
				window.location.href = '/account/login?ref=authreject';
			} else if (res.status >= 500) {
				// console.error('Error changing username:', res);

				setUsername(userData.username); // back to original username in the input field
				setLoading({...loading, username: false})
				return;
			}
			return res.json();
		})
		.then(data => {
			if (!data || !data.success) {
				// console.error('Error changing username:', data);
				setUsername(userData.username); // back to original username in the input field
				setLoading({...loading, username: false})
				setMessage({...message, username: data.message || "Error changing username! Try again in a bit!"})
				return;
			}
			// Username successfully changed
			setUserData(prev => ({...prev, username: data.newUsername, usernameLastUpdated: data.usernameLastUpdated}));
			setUsername(data.newUsername);
			localStorage.setItem('username', data.newUsername);
			setLoading({...loading, username: false})
			setMessage({...message, username: null});
		})
		.catch(error => {
			// console.error('Error contacting server to change username:', error);
			setUsername(userData.username); // back to original username in the input field
			setLoading({...loading, username: false})
		});
	}

	function changePassword() {
		// Verify that the user has entered a password
		if (!password) {
			setMessage({...message, password: 'Please enter your current password.'});
			return;
		}

		// Verify that new password is strong enough
		if (passwordStrength(newPassword).id < 2) {
			setMessage({...message, password: 'Your new password is too weak.'});
			return;
		}

		// Verify that both new passwords match
		if (newPassword !== confirmNewPassword) {
			setMessage({...message, password: 'Your new passwords do not match.'});
			return;
		}

		// Send request, then set error message based on response, or set success message
		setLoading({...loading, password: true})
		fetch('https://floracosm-server.azurewebsites.net/change-password', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({password, newPassword})
		})
		.then(res => {
			if (res.status === 401) {
				// Not logged in
				window.location.href = '/account/login?ref=authreject';
			} else if (res.status >= 500) {
				// console.error('Error changing password:', res);
				setMessage({...message, password: 'Error changing password! Try again in a bit!'});
				setLoading({...loading, password: false})
				return;
			}
			return res.json();
		})
		.then(data => {
			if (!data || !data.success) {
				// console.error('Error changing password:', data);
				setMessage({...message, password: data.message || "Error changing password! Try again in a bit!"});
				setLoading({...loading, password: false})
				return;
			}
			// Password successfully changed
			setLoading({...loading, password: false})
			setMessage({...message, password: null, passwordSuccess: 'Password successfully changed!'});

			// Clear password fields
			setPassword('');
			setNewPassword('');
			setConfirmNewPassword('');
		})
		.catch(error => {
			// console.error('Error contacting server to change password:', error);
			setMessage({...message, password: 'Error contacting server! Try again in a bit!'});
			setLoading({...loading, password: false})
		});
	}

	React.useEffect(() => {

		// if loginStatus is false, redirect to login page
		if (!loginStatus()) {
			window.location.href = '/account/login?ref=nologinstatus';
			return;
		}

		setTabInfo('Account | Floracosm');

		// Get user data from server.
		// Auth token is already saved as a httpOnly cookie.

		fetch('https://floracosm-server.azurewebsites.net/get-user-data', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => {
			if (res.status === 401) {
				// Not logged in
				window.location.href = '/account/login?ref=authreject';
			} else if (res.status >= 500) {
				// console.error('Error getting user data:', res.error);
				return;
			}
			return res.json();
		})
		.then(data => {

			if (!data || !data.success) {
				// console.error('Error getting user data:', data.error);
				return;
			}

			setUserData(data.data);
			setUsername(data.data.username);
		})
		.catch(error => {
			// console.error('Error contacting server for user data:', error);
		});

		fetch('https://floracosm-server.azurewebsites.net/get-past-payments', {
			method: 'GET',
			credentials: 'include',
		})
		.then(res => {
			if (res.status === 401) window.location.href = '/account/login?ref=authreject';
			else if (res.status >= 500) return;
			return res.json();
		})
		.then(data => {
			if (!data || !data.success) {
				// console.error('Error getting past payments:', data.error);
				setPastPaymentsError(data? data.message : "An unexpected error occured while fetching your past payments.");
				return;
			}

			setPastPayments(data.data);
			setPastPaymentsError(null);
		})
		.catch(error => {
			// console.error('Error contacting server for past payments:', error);
		});
	}, []);

	// Loading
	const [loading, setLoading] = React.useState({}); // Stores loading state of each section

	const currentTime = Date.now();

	//const [selectedIdx, setSelectedIdx] = React.useState(0);
	const [visiblePopup, setVisiblePopup] = React.useState(''); // hold name of popup to show based on ID of popup

	// Account info - Stores all user data such as username, privacy settings, etc.
	const [userData, setUserData] = React.useState(null);
	const [username, setUsername] = React.useState(null); // Stores username separately for the username edit input

	const [pastPayments, setPastPayments] = React.useState(null); // Stores all past payments, fetched on load
	const [pastPaymentsError, setPastPaymentsError] = React.useState(null); // Stores error message if past payments failed to load

	const [message, setMessage] = React.useState({}); // Stores error messages in an object 

	// Image Cropper
	const [tempImg, setTempImg] = React.useState(null); // Stores image file to be uploaded - not yet though (for efficiency)

	React.useEffect(() => {
		setVisiblePopup(tempImg? 'image-cropper' : '');
	}, [tempImg]);		

	// For live updating of menubar when displayName change is requested
	const [menubarDisplayName, setMenubarDisplayName] = React.useState(localStorage.getItem('displayName'));

	const [password, setPassword] = React.useState('');
	const [newPassword, setNewPassword] = React.useState('');
	const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
	const [strength, setStrength] = React.useState(0);

	// If there is no user data, return a loading screen
	if (!userData) {
		return (
			<div className='generic-page-body'>
				<MenuBar displayName={menubarDisplayName} />
				<div className='centerer'>
					<LoadingBox />
				</div>
			</div>
		)
	}

  return (
		<div className='generic-page-body'>

			<MenuBar />

			<HeaderedPopup 
			visible={visiblePopup === 'unsupported-file'}
			title="File type not allowed!"
			onClose={() => setVisiblePopup('')}>
				The only file types that can be uploaded as profile avatars are .jpg, .jpeg, and .png.
			</HeaderedPopup>

			{visiblePopup === 'image-cropper' && 
				<ImageCropper
				imageRef={tempImg}
				onClose={() => setVisiblePopup('')}
				onSave={(ref) => {
					// All cropping & uploading should be handled by ImageCropper
					// this stuff runs when the upload was already successful
					setUserData({...userData, avatarRef: ref});
					localStorage.setItem('avatarRef', ref);
					pushChanges({avatarRef: ref}, true);
					setVisiblePopup('');
				}}
				onUploadError={(errorMsg) => {
					setMessage({...message, userData: errorMsg || "There was an error uploading your image. Try again in a bit!"});
					setVisiblePopup('data-change-error');
					setVisiblePopup('');
				}} />
			}

			{visiblePopup === 'data-change-error' &&
				<HeaderedPopup
				title='Error!'
				visible
				onClose={() => setVisiblePopup('')}>
					{message.userData || "There was an error saving your data. Your changes were reverted. We're working on it!"}
				</HeaderedPopup>}

			<div className='account-page-content'>
				<div className='account-page-main'>

					<section id='overview'>

						<ProfileDisplay
						outerStyle={{margin: '0px auto'}}
						borderWidth={5}
						compactProfileContainerStyle={{padding: '1vmin'}}
						autoRequestLbPos={true}
						userData={userData} />

					</section>

					<hr />

					<section id='profile-account'>
						
						<div className='margin-bottom-20px position-relative height-fit-content hsh-lined --hchc-aqua_green font-size-40px font-weight-700 font-display'>
							Profile & Account
						</div>

						<div className='section-container'>

							<div className='account-page-avatar'>

								<ImageUploadArea
								border='2px solid #0002'
								borderRadius='1000px'
								imgSize={[250, 250]}
								allowUpload={false}
								imageRef={userData.avatarRef} />

								<button className='button-primary button-medium width-100 position-relative'>
									Change
									<input 
									type='file' 
									accept='image/png, image/jpeg, image/jpg' 
									onInput={async (e) => {

										const file = e.target.files[0];
										if (!file) return;
										if (!file.name.match(/\.(png|jpg|jpeg)$/)) {
											setVisiblePopup('unsupported-file');
											return;
										}

										readFile(file)
										.then((data) => {
											setTempImg(data);
											e.target.files = null;
										})
										.catch((error) => {}); // Likely that user cancelled file upload
									}} 
									className='hidden-input'/>
								</button>

								<button 
								onClick={() => pushChanges({avatarRef: 'https://floracosm.blob.core.windows.net/images/pfp_default.png'}, true)}
								className='button-secondary button-medium width-100'>
									Delete
								</button>
							</div>

							<div className='account-page-profile-info'>

								<h3 className='margin-0px'>Profile Info</h3>

								{message?.username?
								<div className='error-message max-width-100'>
									{message.username}
								</div> : null}

								<TextInput
								style={{paddingRight: '30px'}}
								type='input'
								initValue={userData.displayName}
								label='Display Name'
								placeholder='Display Name'
								maxLength={32}
								requiresEdit={true}
								onClickDone={(value) => {pushChanges({displayName: value}, true)}}/>

								<div className='flex-column font-size-12px'>
									<TextInput
									style={{paddingRight: '30px'}}
									type='input'
									initValue={username}
									label='Username'
									placeholder='Username'
									maxLength={32}
									requiresEdit={true}
									pattern="[a-zA-Z0-9_]*"
									onClickDone={(value) => {changeUsername(value)}}
									disabled={!userData.usernameLastUpdated || (userData.usernameLastUpdated + 2592000000 > currentTime) || loading.username} />

									{userData.usernameLastUpdated + 2592000000 > currentTime?
									`You may change your username again on ${dateize(Number(userData.usernameLastUpdated) + Number(2592000000)).formattedDate}.` :
									'Username may only be changed once every 30 days.'}

								</div>

								<TextInput
								style={{paddingRight: '30px'}}
								label='Bio'
								initValue={userData.bio}
								placeholder='Write a little bit about yourself! :)'
								maxLength={250}
								requiresEdit={true}
								onClickDone={(value) => {
									pushChanges({bio: value})}}/>

							</div>

							<div className='password-reset-container'>
								<h3 className='margin-0px'>Reset Password</h3>

								{message?.password?
								<div className='error-message max-width-100'>
									{message.password}
								</div> : null}

								{message?.passwordSuccess?
								<div className='success-message max-width-100'>
									{message.passwordSuccess}
								</div> : null}

								<TextInput
								type='input'
								internalType='password'
								label='Current Password'
								placeholder='Current Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								maxLength={-1} />
								
								<div>
									<TextInput
									type='input'
									internalType='password'
									label='New Password'
									placeholder='New Password'
									value={newPassword}
									onChange={(e) => {
										setNewPassword(e.target.value);
										setStrength(passwordStrength(e.target.value).id);
									}}
									maxLength={-1}
									/>
									{newPassword.length?
									<div className={`input-bottom-text flyin-top ${passwordStrengthClassnames[strength]}`}>
										Password Strength: {passwordStrengthText[strength]}
									</div> : null}
								</div>

								<div className='flex-column'>
									<TextInput
									type='input'
									internalType='password'
									label='Confirm New Password'
									placeholder='Confirm New Password'
									value={confirmNewPassword}
									onChange={(e) => setConfirmNewPassword(e.target.value)}
									maxLength={-1} />
									{newPassword.length > 0 &&
										((newPassword !== confirmNewPassword))?
										<div className='input-bottom-text flyin-top --too-weak'>
											Passwords do not match!
										</div> :
										<div className='input-bottom-text flyin-top --strong'>
											Passwords match!
										</div>}
									
								</div>

								<button 
								onClick={changePassword}
								disabled={loading.password}
								className={`button-danger button-medium width-50 align-self-end`}>
									{loading.password? 'Changing Password...' : 'Change Password'}
								</button>
							</div>

						</div>

					</section>

					<hr />

					<section id='comms-privacy'>
						<div className='margin-bottom-20px position-relative height-fit-content hsh-lined --hchc-yellow_red font-size-40px font-weight-700 font-display'>
							Privacy & Communication
						</div>

						<div className='flex-column flex-gap-20px margin-bottom-20px' aria-label='privacy'>

							<h3 className='margin-bottom-0px flex-row flex-gap-10px align-center flex-wrap'>
								Privacy
								<div className='flex-row flex-gap-10px'>
									<SelectAllButton selectAll={true} optionsToChange={['showProfileOnSubmissions']} onClick={selectAll} />
									<SelectAllButton selectAll={false} optionsToChange={['showProfileOnSubmissions']} onClick={deselectAll} />
								</div>
							</h3>

							<SwitchOption 
							directive="Show my account statistics on all of my submissions"
							desc="If this option is enabled, other people will be able to read your bio and see your total donations from the Explore page."
							selected={userData.showProfileOnSubmissions}
							directiveStyle={{fontSize: '15px', fontWeight: 600}}
							descStyle={{fontSize: '13px'}}
							outerStyle={{padding: '15px 20px'}}
							toggleSelected={() => {
								setUserData({...userData, showProfileOnSubmissions: !userData.showProfileOnSubmissions});
								pushChanges({showProfileOnSubmissions: !userData.showProfileOnSubmissions});
							}} />

						</div>
						
						<div className='flex-column flex-gap-20px margin-bottom-20px' aria-label='communication'>

							<h3 className='margin-bottom-0px flex-row flex-gap-10px align-center flex-wrap'>
								Communication
								<div className='flex-row flex-gap-10px'>
									<SelectAllButton selectAll={true} optionsToChange={['receiveReminders', 'receiveUpdates']} onClick={selectAll} />
									<SelectAllButton selectAll={false} optionsToChange={['receiveReminders', 'receiveUpdates']} onClick={deselectAll} />
								</div>
							</h3>

							<SwitchOption 
							directive="Receive annual email notifications if I haven't contributed in the past year"
							desc="One email on New years' annually. Even one dollar a year could help!"
							selected={userData.receiveReminders}
							directiveStyle={{fontSize: '15px', fontWeight: 600}}
							descStyle={{fontSize: '13px'}}
							outerStyle={{padding: '15px 20px'}}
							toggleSelected={() => {
								setUserData({...userData, receiveReminders: !userData.receiveReminders});
								pushChanges({receiveReminders: !userData.receiveReminders});
							}} />

							<SwitchOption 
							directive="Get updates via email about new releases and general news"
							desc="These emails should be very infrequent." 
							selected={userData.receiveUpdates}
							directiveStyle={{fontSize: '15px', fontWeight: 600}}
							descStyle={{fontSize: '13px'}}
							outerStyle={{padding: '15px 20px'}}
							toggleSelected={() => {
								setUserData({...userData, receiveUpdates: !userData.receiveUpdates});
								pushChanges({receiveUpdates: !userData.receiveUpdates});
							}} />

						</div>

						{/*<div className='flex-column flex-gap-20px margin-bottom-20px' aria-label='currency'>

							<h3 className='margin-bottom-0px'>Currency</h3>

							<div className='flex-row justify-between align-center font-size-16px'>
								Primary Currency
								<select className='select-primary'>
									<option>USD</option>
									<option>EUR</option>
									<option>GBP</option>
									<option>JPY</option>
									<option>CAD</option>
									<option>AUD</option>
									<option>CHF</option>
									<option>CNY</option>
									<option>SEK</option>
									<option>NZD</option>
								</select>
							</div>
						</div>*/}

					</section>

					<hr />

					<section id='billing-donations'>
						<div className='margin-bottom-20px position-relative height-fit-content hsh-lined --hchc-blue_magenta font-size-40px font-weight-700 font-display'>
							Billing & Donations
						</div>

						<p>We do not collect or store any payment information. All donations are securely handled by <a className='link' target="_blank" rel="noreferrer" href="https://stripe.com/">Stripe</a>.</p>
						<p>However, if you have any payment issues, you can contact us <a className='link' href='/about#contact' target="_blank" rel="noreferrer">here</a>.</p>

						<div className='flex-row flex-gap-50px width-100'>

							<div className='flex-column flex-gap-20px width-100'>
								<h3 className='margin-0px'>Payment History</h3>

								<div className='past-payments-container'>
									
									{pastPayments?
										(pastPayments.length === 0?

											<div className='text-center padding-10px font-size-16px text-light'>
												You haven't made any donations yet!
											</div> :
											
											pastPayments.map((item, index) => {
												return (
													<div className='past-payments-container' key={index}>
														<PastPaymentItem
														imageRef={item.imageRef}
														amount={item.amount}
														intentID={item.intentID}
														timeInfo={dateize(item.timestamp)} />
													</div>
												)
											})) :

										<div className='text-center center-children padding-10px font-size-16px text-light'>
											{pastPaymentsError || <LoadingBox />}
										</div>
									}

								</div>
							</div>

						</div>

					</section>

				</div>
			</div>

			<Footer />

		</div>
  );
};

export default AccountPage;