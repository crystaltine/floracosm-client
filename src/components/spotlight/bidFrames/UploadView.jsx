import React from 'react';
import '../../../styles/spotlight/UploadView.css';
import UploadScroller from '../UploadScroller';

const UploadView = ({userUploads, uploadMedia, uploadMediaMessage, uploadLoading}) => {

	const fileInputRef = React.useRef(null);

  return (
    <div className='sl-view-container-general font-size-20px'>
			
			{uploadMediaMessage && 
				<div className='error-message width-100 margin-top-10px'>
					{uploadMediaMessage}
				</div>
			}

      <button 
			disabled={uploadLoading}
			className='button-primary button-medium width-100 margin-top-10px position-relative'>
				<input
				onChange={(e) => {
					uploadMedia(e.target.files[0], 'panel');
					fileInputRef.current.value = null;
				}}
				type='file' 
				ref={fileInputRef} 
				className='file-input-invis' />
				{uploadLoading? 'Uploading...' : 'Upload Media'}
			</button>

			<p className='sl-media-deletion-warning'>Uploaded media are deleted after 7 days.</p>
			
			{userUploads.length === 0? 
				<p className='sl-no-uploads'>Nothing has been uploaded yet!</p> : 

				<UploadScroller 
				userUploads={userUploads} 
				outerHeight={null}
				columnsCountBreakPoints={{1100: 1, 1600: 2, 2400: 3}}
				fontSizes={[10, 10]} />
			}

    </div>
  );
};

export default UploadView;