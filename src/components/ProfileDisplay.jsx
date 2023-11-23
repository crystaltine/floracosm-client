import React from 'react';
import '../styles/general/ProfileDisplay.css';
import CompactProfile from './CompactProfile';

function getDefaultFontSizes() {
	if (window.innerWidth > 900) {
		return [70, 18, 45, 24, 18];
	} else if (window.innerWidth > 600) {
		return [60, 16, 30, 22, 16];
	} else {
		return [50, 14, 20, 14, 14];
	}
}

function getDefaultImgSize() {
	if (window.innerWidth > 900) {
		return 100;
	} else if (window.innerWidth > 600) {
		return 70;
	} else {
		return 50;
	}
}

/**
 * @param {Array} size [width, height], default ['100%', 'auto']
 * @param {Array} fontSizes [baseAmountFontSize, baseLabelFontSize, displayNameSize, usernameSize bioSize], center one is scaled by [10/7, 4/3], default [70,100] and [18,24]
 * @param {Number} pfpSize size of profile pic
 * @param {Number} borderWidth width of border
 * @param {Object} userData {displayName, username, avatarRef, lbPosition, totalDonated, numSubmissions, bio}
 * @param {Object} outerStyle outer div style
 * @param {Object} innerStyle inner div style
 * @param {Object} topStyle contains compact profile and statboxes
 * @param {Object} bottomStyle contains bio
 * @param {Object} compactProfileStyle style options of compact profile component
 * @param {Object} statboxContainerStyle style options of statbox container (containing the 3 statboxes	)
 * @returns 
 */
const ProfileDisplay = ({ 
userData, outerStyle, innerStyle,
topStyle, bottomStyle,
compactProfileStyle,
compactProfileContainerStyle,
statboxContainerStyle,
size = ["100%", "auto"], 
fontSizes = getDefaultFontSizes(),
pfpSize = getDefaultImgSize(),
autoRequestLbPos = true,
borderWidth = 5}) => {

	const [lbPos, setLbPos] = React.useState(null);

	React.useEffect(() => {
		setLbPos(null);
		if (autoRequestLbPos) {
			fetch(`https://floracosm-server.azurewebsites.net/get-lb-pos?username=${userData.username}`)
			.then(res => res.json())
			.then(data => {
				setLbPos(data.lbPos);
			})
			.catch(err => {})
		}
	}, [autoRequestLbPos, userData.username]);

  return (
		<div 
		className='profile-bg-outline' 
		style={{
		...outerStyle, 
		padding: borderWidth*0.6,
		borderWidth: borderWidth,
		width: size[0],
		height: size[1]}}>

			<div className='profile-bg-container' style={innerStyle}>

				<div className='pd-top' style={topStyle}>
					
					<div className='pd-compact-profile' style={compactProfileContainerStyle}>
						<CompactProfile
						displayName={userData.displayName}
						username={userData.username}
						avatarRef={userData.avatarRef}
						imgSize={pfpSize}
						fontSizes={[fontSizes[2], fontSizes[3]]}
						outerStyle={{gap: fontSizes[2]*0.5, padding: 0, ...compactProfileStyle, width: '100%'}} />
					</div>

					<div className='statbox-container' style={statboxContainerStyle}>

						<div className='profile-statbox'>
							<span 
							style={{fontSize: fontSizes? fontSizes[0] : '70px'}}
							className='stat-figure purple-gradient-text'>
								{lbPos === null? "~" : `#${lbPos}`}
							</span>

							<span 
							style={{fontSize: fontSizes? fontSizes[1] : '18px'}}
							className='stat-label'>
								Most Donated
							</span>
						</div>

						<div className='profile-statbox'>
							<span 
							style={{fontSize: fontSizes? fontSizes[0] : '100px'}}
							className='stat-figure orange-gradient-text'>
								${userData.totalDonated || 0}
							</span>

							<span 
							style={{fontSize: fontSizes? fontSizes[1] : '24px'}}
							className='stat-label'>
								Donated
							</span>
						</div>

						<div className='profile-statbox'>
							<span
							style={{fontSize: fontSizes? fontSizes[0] : '70px'}}
							className='stat-figure green-gradient-text'>
								{userData.numSubmissions}
							</span>

							<span 
							style={{fontSize: fontSizes? fontSizes[1] : '18px'}}
							className='stat-label'>
								Submissions
							</span>
						</div>

					</div>

				</div>

				<div className='pd-bottom' style={{...bottomStyle, fontSize: fontSizes[4]}}>
					{userData.bio}
				</div>

			</div>

		</div>
  );
};

export default ProfileDisplay;