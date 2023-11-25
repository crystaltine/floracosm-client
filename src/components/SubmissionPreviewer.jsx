import React from 'react';
import '../styles/general/SubmissionPreviewer.css';
import ImageUploadArea from './ImageUploadArea';
import CompactProfile from './CompactProfile';

function amountAllowed(amt) {
	// Cannot be <= 0
	// Cannot have decimals
	// Cannot be > 99,999,999
	return amt > 0 && amt % 1 === 0 && amt <= 99999999;
}

/** 
	Needed styling props:
  ```html
	imgSize=[width, height]|undefined (auto fits to 100%)
	fontSize=[displayName, postText, amount, username]
	avatarSize=number (width and height of pfp)
	amountColor=color string
	```

	`onUploadError`: (type, title, message) => void
*/
const SubmissionPreviewer = ({
	topStyle, hoverForDesc, allowUpload, imageRef, updateImageRef, 
	onUploadError, bgColor, padding, borderRadius, imgSize, 
	fontSize, avatarSize, amountColor, textColor, 
	displayName = "Loading...", username = "Loading...", 
	avatarRef = null, denom = '', selectedDonationAmount = "Loading...",
	postText}) => {

  return (
		<div className='border-box' style={{
			...topStyle, 
			backgroundColor: bgColor || "#fff",
			padding: padding || 10,
			borderRadius: borderRadius || 7,
			}}>

			<div className='image-card' style={{width: imgSize? imgSize[0]: "100%"}}>

				<div className='submission-preview-img-shadow' onMouseOver={hoverForDesc && !allowUpload}>
					<ImageUploadArea 
					imgSize={imgSize || ["100%", "100%"]}
					allowUpload={allowUpload} 
					imageRef={imageRef} 
					updateImageRef={updateImageRef}
					onUploadError={onUploadError} />
				</div>
				
				<div style={{marginTop: (padding / 2) || 10, gap: (padding / 3) || 7}} className='submission-preview-text'>

					<div className='submission-preview-maintext' style={{fontSize: fontSize[0], color: textColor}}>

						<CompactProfile
						displayName={displayName}
						username={username}
						avatarRef={avatarRef}
						outerStyle={{width: '100%', padding: 0}}
						imgSize={avatarSize}
						fontSizes={[fontSize[0], fontSize[3]]}/>

					</div>

					<div className='amount-text' style={{fontSize: fontSize[2], color: amountColor}}>
						{denom}{amountAllowed(selectedDonationAmount)? selectedDonationAmount : "~"}
					</div>

				</div>

				{postText &&		
					<div 
					className='sp-postText' 
					style={{
						maxHeight: imgSize? imgSize[1] / 4 : "100%",
						marginTop: (padding / 2) || 10, 
						fontSize: fontSize[1], 
						color: textColor}}>

						{postText}
					</div>}
			
			</div>

		</div>
  );
};

export default SubmissionPreviewer;