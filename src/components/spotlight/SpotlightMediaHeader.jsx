import React from 'react';
import '../../styles/spotlight/SpotlightMedia.css';
import CompactProfile from '../CompactProfile';

const mediaTypeColors = {
	youtube: "#d44246",
	twitch: "#9b78dc",
	video: "#bfdefa",
	image: "#c7ed9f",
}

export const mediaTypeIcons = {
	youtube: "https://www.svgrepo.com/show/303198/youtube-icon-logo.svg",
	twitch: "https://www.svgrepo.com/show/448251/twitch.svg",
	video: "https://www.svgrepo.com/show/532727/video.svg",
	image: "https://www.svgrepo.com/show/532576/image-square.svg",
}

const SpotlightMediaHeader = ({
	submitterProfile, endTimestamp, winningBidAmount, 
	submissionTitle, mediaType, link, sequenceNumber}) => {

  return (
    <div className='slm-details-header' style={{
			backgroundImage: `linear-gradient(
				80deg, 
				#fff 37.5%, 
				${mediaTypeColors[mediaType] || "#ffffff"}a0 37.5%, 
				${mediaTypeColors[mediaType] || "#ffffff"}a0 62.5%, 
				${mediaTypeColors[mediaType] || "#fff"} 62.5%, 
				${mediaTypeColors[mediaType] || "#fff"} 100%)`
		}}>

			<div className='slm-details-header-left'>
				<span className='font-size-28px font-weight-900'>#{sequenceNumber}</span>
				<img className='slm-details-header-icon' src={mediaTypeIcons[mediaType] || "https://www.svgrepo.com/show/532576/image-square.svg"} alt='Spotlight Media' />
				<span className='font-size-20px font-weight-800 text-ellipsis'>{submissionTitle}</span>
			</div>

			<div className='display-flex justify-center column-gap-10px align-center'>
				<CompactProfile
				displayName={submitterProfile.displayName}
				username={submitterProfile.username}
				imgSize={40}
				fontSizes={[20, 12]}
				padgap={8}
				avatarRef={submitterProfile.avatarRef} />
			</div>

			<div className='slm-details-header-right'>
				<span className='line-height-1 font-size-36px font-weight-800'>7:44</span>
				<span className='font-size-18px font-weight-700'>/10:00</span>
			</div>
    </div>
  );
};

export default SpotlightMediaHeader;