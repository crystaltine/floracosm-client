import React from 'react';
import '../../../styles/spotlight/BidMediaSelector.css';
import TextInput from '../../TextInput';
import UploadScroller from '../UploadScroller';

/**
 * userUploads:
 * `List [ UploadObject ]`
 * 
 * UploadObject: ```{
 * 		url: string,
 * 		type: 'image' | 'video'
 * }```
 */
const UploadSelector = ({ userUploads, selectedIndex, setSelectedIndex, uploadMedia, uploadMessage, uploadLoading }) => {

	const fileInputRef = React.useRef(null);

  return (
    <div className='sl-media-selector-container'>

			<h1 className='font-size-20px font-weight-800 margin-top-20px margin-bottom-5px'>Uploaded Media</h1>

			<div className='flex-row align-center justify-between column-gap-20px margin-bottom-20px'>
				<div className='font-size-16px font-weight-700 display-flex align-center'>
					Set Custom Title
					<span className='font-size-14px text-light font-weight-400'>&nbsp;(optional)</span>
				</div>
				<TextInput
				type='input'
				spellcheck={false}
				placeholder='Title'
				maxLength={20} />
			</div>

      {userUploads && userUploads.length > 0?
				<UploadScroller
				outerHeight={'500px'}
				userUploads={userUploads}
				selectedIndex={selectedIndex}
				setSelectedIndex={setSelectedIndex} /> :

				<div className='sl-no-uploads'>
					Nothing has been uploaded yet!
				</div>
			}

			<button 
			disabled={uploadLoading}
			className='button-secondary button-medium width-100 margin-top-10px position-relative'>
				<input
				onChange={(e) => {
					uploadMedia(e.target.files[0], 'popup');
					fileInputRef.current.value = null;
				}}
				type='file' 
				ref={fileInputRef} 
				className='file-input-invis' />
				{uploadLoading? 'Uploading...' : 'Upload Media'}
			</button>

			{uploadMessage && 
				<div className='error-message width-100 margin-top-10px'>
					{uploadMessage}
				</div>
			}

    </div>
  );
};

export default UploadSelector;