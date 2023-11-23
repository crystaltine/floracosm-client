import React from 'react';
import '../styles/completion/CompletionPage.css';

const SocialMediaShareButton = (props) => {
  return (
    <button className='social-media-share-button'>
      <img className='social-media-share-icon' src={props.icon} alt={props.alt} />
    </button>
  );
};

export default SocialMediaShareButton;