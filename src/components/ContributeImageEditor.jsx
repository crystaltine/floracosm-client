import React from 'react';
import '../styles/contribute/ContributePage.css';
import SubmissionPreviewer from './SubmissionPreviewer';

const ContributeImageEditor = ({ editorPreviewRef, submissionState, loggedIn, updateImageRef, setErrorPopup, }) => {

  return (
    <div className='image-editor' ref={editorPreviewRef}>
			<div className='image-preview-pane'>
				<div className='padding-provider'>
					<SubmissionPreviewer
					allowUpload={true}
					imageRef={submissionState.imageRef}
					updateImageRef={updateImageRef}
					onUploadError={(type, title, message) => {
						setErrorPopup({
							visible: true,
							title,
							content: message,
						});
					}}
					postText={submissionState.postText}
					denom='$'
					displayName={(loggedIn && !submissionState.anonymous)? localStorage.getItem('displayName') : (submissionState.accountlessDisplayName || 'Anonymous')}
					avatarRef={(loggedIn && !submissionState.anonymous)? localStorage.getItem('avatarRef') : null}
					username={(loggedIn && !submissionState.anonymous)? localStorage.getItem('username') : null}
					selectedDonationAmount={submissionState.amount}
					imgSize={[500, 600]}
					avatarSize={65}
					padding={16}
					fontSize={[30, 18, 50, 16]}
					textPanelWidth={[400, 400]}
					textPanelHeight={[400, 400]}
					amountColor='rgb(216, 181, 8)' />
				</div>
			</div>
		</div>
  );
};

export default ContributeImageEditor;