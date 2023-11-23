import React from 'react';
import '../../../styles/spotlight/BidMediaSelector.css';
import TextInput from '../../TextInput';

const TwitchSelector = ({currLink, setCurrLink, currStreamData, setCurrStreamData}) => {

  const [typingTimer, setTypingTimer] = React.useState(null); // for debouncing searchForVideo
  const handleLinkChange = (e) => {
    if (typingTimer) clearTimeout(typingTimer);
    setTypingTimer(setTimeout(() => searchForStreamer(e.target.value), 1000));
  };

  const [findStreamMessage, setFindStreamMessage] = React.useState(null); //msg for not found, incomplete link, error fetching, etc

  const searchForStreamer = React.useCallback((currLink) => {
    
  }, []);

  return (
    <div className='sl-media-selector-container'>
      <h1 className='font-size-20px font-weight-800 margin-top-20px margin-bottom-5px'>Twitch Stream</h1>

      <div className='flex-row align-center justify-between column-gap-20px'>

        <div className='font-size-16px font-weight-700 display-flex align-center'>
          Channel Name
        </div>
        <TextInput
        type='input'
        value={currLink}
        onChange={(e) => {
          setCurrLink(e.target.value);
          handleLinkChange(e);
        }}
        spellcheck={false}
        containerStyle={{ width: 'min(50%, 400px)' }}
        outerStyle={{width: '100%'}}
        style={{width: '100%'}}
        placeholder='Steamer Username'
        maxLength={-1} />

      </div>
    </div>
  );
};

export default TwitchSelector;