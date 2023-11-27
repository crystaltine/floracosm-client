import React from 'react';
import '../styles/explore/ExploreSideview.css';
import SubmissionPreviewer from './SubmissionPreviewer';
import ExploreSideviewStat from './ExploreSideviewStat';
import LinkDisplay from './LinkDisplay';
import ProfileDisplay from './ProfileDisplay';
import { sf } from '../utils';

const ExploreSideview = ({ visible, innerRef, submissionData, closeSideview }) => {

  return (
    <div 
		ref={innerRef}
		style={{display: visible? 'flex' : 'none'}} 
		className='explore-page-sideview'>

			<header className='explore-page-sideview-header'>
				<h1 className='explore-page-sideview-title'>View Submission</h1>
				<button className='explore-page-sideview-close-button' onClick={() => closeSideview()}>
					<img src={require('../assets/icons/close.png')} alt='x' className='explore-page-sideview-close-icon' />
				</button>
			</header>

			<div className='explore-page-sideview-content'>
				{submissionData? 
					<>
						<SubmissionPreviewer 
						allowUpload={false}
						imageRef={submissionData.entry.imageRef}
						displayName={submissionData.entry.displayName || submissionData.profile?.displayName}
						avatarRef={submissionData.profile?.avatarRef}
						username={submissionData.profile?.username}
						postText={submissionData.entry.postText}
						denom='$'
						selectedDonationAmount={submissionData.entry.amount} 
						fontSize={sf([28, 18, 36, 16])}
						avatarSize={sf(55)}
						padding={0}
						topStyle={{width: '100%', display: 'block'}}
						amountColor='rgb(216, 181, 8)' />

						<div className='explore-page-sideview-info'>
							<div className='font-size-18px font-weight-700'>Profile</div>
							{submissionData.profile?
							<ProfileDisplay
							userData={submissionData.profile}
							size={['100%', 'auto']}
							pfpSize={sf(60)}
							borderWidth={5}
							topStyle={{
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								rowGap: sf(10),
							}}
							innerStyle={{ padding: '10px' }}
							compactProfileStyle={{width: '100%'}}
							compactProfileContainerStyle={{width: '100%', padding: 5}}
							statboxContainerStyle={{width: '100%'}}
							fontSizes={sf([36, 15, 30, 18, 15])} /> :
							<div className='info-message'>This contribution was made by someone who is either unregistered or has chosen to hide their profile stats.</div>}
						</div>

						<div className='explore-page-sideview-info'>
							<div className='font-size-18px font-weight-700'>Download</div>
							<a href={submissionData.entry.imageRef} download={true} className='link-invis hover-text-decoration-none width-100'>
								<button style={{fontSize: sf(16)}} className='button-primary button-medium width-100 flex-gap-2px center-children'>
									<img src={require('../assets/icons/download.png')} alt='dl' className='image-20px' />
									Download Image
								</button>
							</a>
						</div>

						<div className='explore-page-sideview-info'>

							<div className='font-weight-700 font-size-18px'>Details</div>

							<ExploreSideviewStat
							title='Submission Date'
							icon={require('../assets/icons/calendar.png')}
							color= '#70c1ff'
							value={new Date(Math.floor(submissionData.entry.timestamp)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />

							<ExploreSideviewStat
							title='Location'
							icon={require('../assets/icons/position.png')}
							color= '#e0cf15'
							value={`(${submissionData.entry.x}, ${submissionData.entry.y})`} />

							<ExploreSideviewStat
							title='Image Size'
							icon={require('../assets/icons/size.png')}
							color= '#8de981'
							value={`${submissionData.entry.size}x${submissionData.entry.size} ($${submissionData.entry.amount})`} />

							<ExploreSideviewStat
							title='Submission ID'
							icon={require('../assets/icons/id.png')}
							color= '#e98181'
							value={submissionData.entry.intentID} />

						</div>

						<div className='explore-page-sideview-info'>
							<div className='font-size-18px font-weight-700'>Permanent Link</div>
							<LinkDisplay 
							bgColor='#656a7240'
							fontSize={sf(16)}
							link={`https://floracosm.org/canvasearth?year=${new Date(Math.round(submissionData.entry.timestamp)).getFullYear()}&focus=${submissionData.entry.intentID}`} />
						</div>

					</> :
					<div className='explore-page-sideview-nosub-container'>

						<div className='explore-page-sideview-nosub-error'>
							Yikes! We couldn't find this submission.
						</div>

						<b>Some possible fixes/reasons:</b>
						<ul>
							<li>It is possible that the submitter has requested for this submission to be taken down, or it was removed for disallowed content</li>
							<li>The ID in the URL may be incorrect and does not point to an existing submission.</li>
							<li>The server may be having problems sending back submissions (Sorry!).</li>
							<li>Try selecting another submission by clicking on its thumbnail.</li>
						</ul>

					</div>}
			</div>

		</div>
  );
};

export default ExploreSideview;