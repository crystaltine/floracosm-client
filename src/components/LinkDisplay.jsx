import React from 'react';
import '../styles/general/LinkDisplay.css';

const copy_icon = require('../assets/icons/copy_icon.png');
const checkmark_icon = require('../assets/icons/checkmark_icon.png');

const LinkDisplay = ({ link, bgColor }) => {

  const [showingCheckmark, setShowingCheckmark] = React.useState(false);

  return (
    <div className='link-display-container' style={{ backgroundColor: bgColor }}>
      <div className='link-display-textbox'>
        <div className='link-display-text'>
          {link}
        </div>
      </div>
      <button 
      className='link-display-copy-button' 
      onClick={() => {
        navigator.clipboard.writeText(link);
        setShowingCheckmark(true);
      }}
      onMouseEnter={() => setShowingCheckmark(false)}>
				<img className='link-display-copy-icon' src={showingCheckmark? checkmark_icon : copy_icon} alt='copy icon' />
			</button>
    </div>
  );
};

export default LinkDisplay;