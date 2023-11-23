import React from 'react';
import '../../styles/spotlight/SpotlightChat.css';
import ChatMessage from './ChatMessage';
import { loginStatus } from '../../App';
const io = require('socket.io-client');

const SpotlightChat = () => {

	const textareaRef = React.useRef(null);

	const [socket, setSocket] = React.useState(null);
	const [authenticatedChat, setAuthenticatedChat] = React.useState(false);
	const [chatAuthMessage, setChatAuthMessage] = React.useState('Connecting to chatroom...');

	const [currMessage, setCurrMessage] = React.useState('');
	const [allMessages, setAllMessages] = React.useState([]);

	const sendMessage = React.useCallback(() => {
		if (currMessage.trim() === '') return;
		setCurrMessage('');
		textareaRef.current.style.height = 'auto';

		socket.emit('spotlight-chat-message', currMessage);

	}, [currMessage, socket]);

	const registerSocket = React.useCallback((clientID) => {
		// Send message to server to register this ID with the httponly cookie
		fetch(`https://floracosm-server.azurewebsites.net/register-chat-socket?clientID=${clientID}`, {
			method: 'GET',
			credentials: 'include'
		})
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				setAuthenticatedChat(true);
				setChatAuthMessage('');
			} else {
				setChatAuthMessage('Yikes! There was an error authenticating.');
			}
		})
		.catch(err => {
			// console.log(err);
			setChatAuthMessage('Yikes! There was an error connecting.');
		});
	}, []);

	// Set up sockets
	React.useEffect(() => {
		if (!loginStatus()) return;

		/*
			Generate a unique ID here. This needs to be sent to the server
			during the inital handshake with the server.
			Immediately after establishing ws connection, send an
			HTTP request to register this ID with the httponly cookie on this client side.
			This should connect our connection here with our account credentials.
		*/

		const id = crypto.randomUUID();

		const socket = io('ws://localhost:3999', {
			extraHeaders: {
				"client-id": id
			}
		});
		setSocket(socket);
		registerSocket(id);

		socket.on('register-request', () => {
			registerSocket(id);
		});

		socket.on('spotlight-chat-message', (msg) => {
			setAllMessages((prev) => [...prev, msg]);
		});

		return () => {
			socket.disconnect();
		};
	}, [registerSocket]);

  return (
    <div className='slc-container'>

      <h1 className='slc-header'>Global Chat</h1>

      <div className='slc-scroll-container'>
				<div className='slc-messages-container'>
					{allMessages.map((msg, i) => {

						// If message is from same user as previous message, don't show profile
						// Don't combine anonymous messages
						if (msg.senderProfile?.username && i > 0 && msg.senderProfile.username === allMessages[i - 1].senderProfile.username) {
							return (
								<div className='slcm-text-noprofile'>
									{msg.text}
								</div>
							)
						}

						return (
							<ChatMessage
							senderProfile={msg.senderProfile}
							text={msg.text}
							timestamp={msg.timestamp} />
						)
					})}
				</div>
      </div>

			<div className='slc-input-container'>
				{loginStatus()?

					(authenticatedChat?
						<div className='slc-input'>
							<textarea
							ref={textareaRef}
							className='slc-textarea'
							rows='1'
							spellCheck='false'
							value={currMessage}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									sendMessage();
								}
							}}
							onChange={(e) => {
								setCurrMessage(e.target.value);
								e.target.style.height = 'auto';
								e.target.style.height = `min(${e.target.scrollHeight}px, 300px)`
							}}
							placeholder='Type a message...' />

							<button 
							onClick={sendMessage}
							className='button-primary padding-5px center-children'>
								<img className='image-25px' src={require('../../assets/icons/send.png')} alt='send' />
							</button>
						</div> :
						<div className='slc-chat-loading'>
							{chatAuthMessage}
						</div>
					) :

					<div className='slc-not-logged-in'>

						<h3 className='font-size-12px font-weight-800 text-center'>
							An account is required for sending messages!
						</h3>

						<div className='flex-row column-gap-10px align-center margin-top-10px'>

							<a className='link-invis width-100' href='/account/register'>
								<button className='button-primary button-medium width-100'>
									Create Account
								</button>
							</a>

							<a className='link-invis width-100' href='/account/login'>
								<button className='button-secondary button-medium width-100'>
									Log In
								</button>
							</a>

						</div>

					</div>
				}
			</div>

    </div>
  );
};

export default SpotlightChat;