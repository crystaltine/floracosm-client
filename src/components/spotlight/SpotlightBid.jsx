import React from 'react';
import '../../styles/spotlight/SpotlightBid.css';
import UpcomingView from './bidFrames/UpcomingView';
import UploadView from './bidFrames/UploadView';

const SpotlightBid = ({
  _ref, height, uploadMedia, uploadMediaMessage, 
  userUploads, selectedUploadIndex, uploadLoading, 
  openBidPopup}) => {

  const [highestBid, setHighestBid] = React.useState(27); //temp
	const [highestBidderProfile, setHighestBidderProfile] = React.useState({ //temp
		avatarRef: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
		displayName: 'Random Guy',
		username: 'rando234719'
	});// {avatarRef, displayName, username}

  const [bidMessage, setBidMessage] = React.useState(''); // for error/success messages in the UpcomingView

  return (
    <div className='spotlight-bid-container' ref={_ref} style={{display: height === 0? 'none' : undefined, height: height}}>
      
      <UpcomingView
      number={117}
      durationLeft={'2m 33s'}
      userBid={25}
      userBalance={100}
      message={bidMessage}
      selectedUploadIndex={selectedUploadIndex}
      openBidPopup={openBidPopup}
      highestBid={highestBid}
      highestBidderProfile={highestBidderProfile} />

      <UploadView 
      uploadMedia={uploadMedia}
      uploadMediaMessage={uploadMediaMessage}
      uploadLoading={uploadLoading}
      userUploads={userUploads} />

    </div>
  );
};

export default SpotlightBid;