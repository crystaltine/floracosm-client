import React from 'react';
import '../../styles/spotlight/ChatMessage.css';

const ChatMessage = ({senderProfile, text, timestamp}) => {

  return (
    <div className='slcm-container'>

			<img src={senderProfile?.avatarRef || 'https://i.imgur.com/HeIi0wU.png'} alt='profile' className='slcm-profile-img' />

			<div className='slcm-text-container'>

				<div className='slcm-text-header'>
					<h1 className='slcm-displayName'>{senderProfile?.displayName || 'Anonymous'}</h1>
					<h2 className='slcm-timestamp'>{new Date(timestamp).toLocaleTimeString()}</h2>
				</div>

				<div className='slcm-text'>{text}</div>
			</div>

    </div>
  );
};

export default ChatMessage;