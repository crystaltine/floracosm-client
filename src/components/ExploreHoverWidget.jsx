import React from 'react';
import '../styles/explore/ExplorePage.css'
import CompactProfile from './CompactProfile';

const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

const ExploreHoverWidget = ({ 
	sizeMultiplier, position, hidden,
	info: {displayName, username, avatarRef, postText, amount, timestamp} }) => {

  return (
    <div className='ehw-container' style={{display: hidden? 'none' : 'flex'}}>

      <div className='ehw-header' style={{padding: `${3.5*sizeMultiplier}px ${2.5*sizeMultiplier}px`}}>

				<div className='ehw-profile-info-container'>
					<CompactProfile
					displayName={displayName}
					username={username}
					avatarRef={avatarRef}
					fontSizes={[6*sizeMultiplier, 4*sizeMultiplier]}
					imgSize={12*sizeMultiplier}
					outerStyle={{padding: 0, width: '100%'}} />
				</div>

				<span style={{fontSize: Math.max(6, 10-Math.floor(Math.log10(amount)))*sizeMultiplier}} className='font-display font-weight-900'>${amount}</span>
			</div>

			<div className='ehw-body' style={{padding: `${3*sizeMultiplier}px`}}>

				<p className='ehw-postText' style={{fontSize: 5*sizeMultiplier}}>
					{(postText === '' || !postText)? <span className='ehw-nodesc'>No description provided</span> : postText}
				</p>

				<span style={{fontSize: 4*sizeMultiplier}} className='ehw-timestamp'>
					{new Date(Math.floor(timestamp)).toLocaleDateString('en-US', dateOptions)}
				</span>

			</div>

    </div>
  );
};

export default ExploreHoverWidget;