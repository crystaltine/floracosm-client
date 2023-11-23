import React from 'react';
import '../../styles/spotlight/SpotlightMedia.css';
import SpotlightMediaHeader from './SpotlightMediaHeader';

const SpotlightMedia = ({currentMedia}) => {

  if (currentMedia.type === 'video') {
    return (
      <div className='slm-container slm-container-vid'>
        <video className='slm-video' src={currentMedia.link} title='Spotlight Media' height='100%' width='100%' autoPlay>
          <source src={currentMedia.link} type="video/mp4" />
        </video>
      </div>
    )
  }

  else if (currentMedia.type === 'youtube' || currentMedia.type === 'twitch') {
    return (
      <div className='slm-container slm-container-vid'>
        <SpotlightMediaHeader
        mediaType={currentMedia.type}
        link={currentMedia.link}
        submitterProfile={currentMedia.submitterProfile}
        endTimestamp={currentMedia.endTimestamp}
        winningBidAmount={currentMedia.winningBidAmount}
        sequenceNumber={currentMedia.sequenceNumber}
        submissionTitle={currentMedia.submissionTitle} />
        <iframe className='slm-video' src={currentMedia.link} title='Spotlight Media' height='100%' width='100%' allowFullScreen />
      </div>
    );
  }

  else if (currentMedia.type === 'image') {
    return (
      <div className='slm-container slm-container-img'>
        <img className='slm-image' src={currentMedia.link} alt='Spotlight Media' />
      </div>
    );
  }

  else {
    return (
      <div className='slm-container center-children'>
        <h1 className='margin-auto text-center'>Nothing!</h1>
      </div>
    );
  }

  
};

export default SpotlightMedia;