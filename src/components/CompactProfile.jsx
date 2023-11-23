import React from 'react';
import '../styles/general/CompactProfile.css';

/**
 * props:
 * - displayName
 * - username
 * - avatarRef
 * - (opt) fontSizes [displayNameSize, usernameSize]
 * - (opt) imgSize (for pfp)
 * - (opt) padgap padding of container and gap between elements
 * - (opt) outerStyle, imgStyle
 * - (opt) outerClasses, a string of space-separated classes to add to outer div
 */
const CompactProfile = ({
	displayName, username, avatarRef, 
	fontSizes, imgSize, padgap,
	outerStyle, imgStyle, outerClasses}) => {

  return (
		<div className={`compact-profile-container ${outerClasses}`} style={{gap: padgap, ...outerStyle}}>

			{avatarRef && <img 
			style={{width: imgSize || '50px', height: imgSize || '50px', ...imgStyle}}
			className='rounded-full' 
			src={avatarRef} 
			alt='profile' />}

			<div className='flex-column justify-center overflow-x-hidden font-display'>
				<span className='compact-profile-displayName' style={{fontSize: fontSizes? fontSizes[0] : null}}>{displayName}</span>
				{username && <span className='compact-profile-username' style={{fontSize: fontSizes? fontSizes[1] : null}}>@{username}</span>}
			</div>

		</div>
  );
};

export default CompactProfile;