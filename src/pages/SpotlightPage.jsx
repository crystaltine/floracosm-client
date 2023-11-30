import React from 'react';
import '../styles/spotlight/SpotlightPage.css';
import MenuBar from '../components/MenuBar';
import SpotlightChat from '../components/spotlight/SpotlightChat';
import SpotlightMedia from '../components/spotlight/SpotlightMedia';
import SpotlightBid from '../components/spotlight/SpotlightBid';
import { HeaderedPopup } from '../components/CenteredPopup';
import SwitchOption from '../components/SwitchOption';
import { mediaTypeIcons } from '../components/spotlight/SpotlightMediaHeader';
import UploadSelector from '../components/spotlight/bidPopupTypes/UploadSelector';
import YoutubeSelector from '../components/spotlight/bidPopupTypes/YoutubeSelector';
import TwitchSelector from '../components/spotlight/bidPopupTypes/TwitchSelector';
import { setTabInfo } from '../utils';

const SpotlightPage = () => {

	const bidPanelRef = React.useRef(null);
	const [bidPanelHeight, setEditorPanelHeight] = React.useState(300);

	const [bidPopupVisible, setBidPopupVisible] = React.useState(false);
	const [bidPopupSubmitType, setBidPopupSubmitType] = React.useState('upload'); // 'upload', 'twitch', 'youtube'

	// UPLOADS
	const [userUploads, setUserUploads] = React.useState(JSON.parse(localStorage.getItem('spotlight-uploads') || '[]')); // [ { url: string, timestamp: number, type: 'image' | 'video' }
	const [selectedUploadIndex, setSelectedUploadIndex] = React.useState(null); // use if upload is selected format for bid

	// YOUTUBE
	const [selectedYoutubeLink, setSelectedYoutubeLink] = React.useState(null); // use if youtube is selected format for bid
	const [currVideoData, setCurrVideoData] = React.useState({
		title: null,
		description: null,
		publishedAt: null,
		thumbnailRef: null,
		channelTitle: null,
		videoID: null,
	});

	// TWITCH
	const [selectedTwitchStreamer, setSelectedTwitchStreamer] = React.useState(null); // use if twitch is selected format for bid
	const [currStreamData, setCurrStreamData] = React.useState({
		streamerName: null,
		streamerID: null,
		streamTitle: null,
		streamCategory: null,
		streamThumbnailRef: null,
		streamViewerCount: null,
		streamStartedAt: null,
	});

	// Stores current video/stream and related info (submitter, title, etc)
	const [currentMedia, setCurrentMedia] = React.useState({
		type: 'twitch',
		link: 'https://player.twitch.tv/?channel=gothamchess&parent=https://floracosm.org',
		submitterProfile: {
			displayName: 'Random Guy',
			username: 'rando234719',
			avatarRef: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
		},
		endTimestamp: 1620000000,
		winningBidAmount: 27,
		sequenceNumber: 116,
		submissionTitle: 'WWWWWWWWWWWWWWWWWWWW', // limit to 20 chars
	});

	// Stores error messages for the two upload buttons (in popup, and in the panel)
	// Also stores when to display loading... button
	const [uploadMessage, setUploadMessage] = React.useState({
		popup: null,
		panel: null,
		uploadLoading: false,
	});

	const toggleBidPanel = React.useCallback(() => {
		setEditorPanelHeight((prev) => prev === 0? 300 : 0);
	}, []);

	const uploadMedia = React.useCallback((file, origin) => {
		if (!file) return;

		// Reset upload message
		setUploadMessage((prev) => ({...prev, [origin]: null, uploadLoading: true}));
		// Check file ext
		const ext = file.name.split('.').pop();
		if (!['jpg', 'jpeg', 'png', 'mp4', 'mov', 'gif'].includes(ext)) {
			setUploadMessage((prev) => ({...prev, [origin]: 'Invalid file type!', uploadLoading: false}));
			return;
		}

		// Check file size, max is 2GB
		if (file.size > 2_000_000_000) {
			setUploadMessage((prev) => ({...prev, [origin]: 'File is too large!', uploadLoading: false}));
			return;
		}
		
		const formData = new FormData();
    formData.append("file", file);

		fetch('https://floracosm-server.azurewebsites.net/upload-spotlight-media', {
			method: 'POST',
			body: formData,
		})
		.then((res) => res.json())
		.then((res) => {
			if (!res.success) {
				setUploadMessage((prev) => ({...prev, [origin]: res.message, uploadLoading: false}));
			} else {
				setUploadMessage((prev) => ({...prev, [origin]: null, uploadLoading: false}));

				// Add the url passed back to localstorage
				const uploads = JSON.parse(localStorage.getItem('spotlight-uploads') || '[]');
				uploads.push({
					url: res.fileURL,
					timestamp: res.timestamp,
					type: res.fileType,
					fileName: file.name,
				})
				localStorage.setItem('spotlight-uploads', JSON.stringify(uploads));
				setUserUploads(uploads);
			}
		})
		.catch((err) => {
			setUploadMessage((prev) => ({...prev, [origin]: 'Yikes! We couldn\'t connect to the server.', uploadLoading: false}));
		});
	}, []);

	/* maybe include later, rn its too buggy
	const handleMousedown = React.useCallback((e) => {
		e.preventDefault();
		let prevY = e.clientY;
		const mouseMoveHandler = (e) => {

			// only move if mouse is down
			if (e.buttons !== 1) {
				prevY = e.clientY;
				return;
			}

			let diff = e.clientY - prevY;
			prevY = e.clientY;
			setEditorPanelHeight((prev) => Math.max(0, Math.min(prev - diff, 300)));
		};
		const mouseUpHandler = (e) => {
			window.removeEventListener('mousemove', mouseMoveHandler);
			window.removeEventListener('mouseup', mouseUpHandler);
		};
		window.addEventListener('mousemove', mouseMoveHandler);
		window.addEventListener('mouseup', mouseUpHandler);
	}, []);
	*/

	React.useEffect(() => {
		setTabInfo('Spotlight | Floracosm');
	}, []);

  return (
    <div className='generic-page-body'>

      <MenuBar selected='Spotlight' />

      <div className='spotlight-page-content'>

				<HeaderedPopup
				title='Bid Details'
				bodyStyle={{ width: "min(100%, 900px)" }}
				visible={bidPopupVisible} 
				zIndex={150}
				onClose={() => {setBidPopupVisible(false)}}>

					<div className='font-size-20px font-weight-800 margin-bottom-5px'>
						Media Type
					</div>

					<div className='sl-mediatype-selector'>
						<SwitchOption
						selected={bidPopupSubmitType === 'upload'}
						toggleSelected={() => setBidPopupSubmitType('upload')}
						outerStyle={{padding: '10px 5px'}}
						directiveStyle={{color: '#2aa298', fontSize: '16px', fontWeight: '800'}}
						descStyle={{color: '#000d', fontSize: '14px', fontWeight: '500'}}
						image={'https://www.svgrepo.com/show/491151/upload.svg'}
						imageSize={50}
						imageGap={10}
						directive='Uploaded Media'
						desc='Share a video or image you have uploaded yourself' />

						<SwitchOption
						selected={bidPopupSubmitType === 'youtube'}
						toggleSelected={() => setBidPopupSubmitType('youtube')}
						outerStyle={{padding: '10px'}}
						directiveStyle={{color: '#d44246', fontSize: '16px', fontWeight: '800'}}
						descStyle={{color: '#000d', fontSize: '14px', fontWeight: '500'}}
						image={mediaTypeIcons.youtube}
						imageSize={40}
						imageGap={10}
						directive='YouTube Video'
						desc='Share a pre-uploaded public video from YouTube' />

						<SwitchOption
						selected={bidPopupSubmitType === 'twitch'}
						toggleSelected={() => setBidPopupSubmitType('twitch')}
						outerStyle={{padding: '10px'}}
						directiveStyle={{color: '#9b78dc', fontSize: '16px', fontWeight: '800'}}
						descStyle={{color: '#000d', fontSize: '14px', fontWeight: '500'}}
						image={mediaTypeIcons.twitch}
						imageSize={40}
						imageGap={10}
						directive='Twitch Stream'
						desc='Share a current live stream from Twitch' />
					</div>

					{bidPopupSubmitType === 'upload'?

						<UploadSelector
						selectedIndex={selectedUploadIndex}
						userUploads={userUploads}
						uploadMedia={uploadMedia}
						uploadMessage={uploadMessage.popup}
						uploadLoading={uploadMessage.uploadLoading}
						setSelectedIndex={setSelectedUploadIndex} /> :

						bidPopupSubmitType === 'youtube'?

						<YoutubeSelector
						currVideoData={currVideoData}
						setCurrVideoData={setCurrVideoData}
						currLink={selectedYoutubeLink}
						setCurrLink={setSelectedYoutubeLink} /> :

						<TwitchSelector
						currStreamData={currStreamData}
						setCurrStreamData={setCurrStreamData}
						currLink={selectedTwitchStreamer}
						setCurrLink={setSelectedTwitchStreamer} />
					}

					<div className='font-size-20px font-weight-800 margin-top-20px margin-bottom-5px'>
						Bid Info
					</div>

					<div className='sl-initbid-info'>

						<div className='flex-column row-gap-10px align-center'>
							<div className='sl-popup-timeleft'>
								2m 33s
							</div>
							<div className='sl-popup-watchcount'>
								<span className='sl-popup-watchcount-number'>
									<img className='image-20px' src='https://www.svgrepo.com/show/532362/user.svg' alt='user' />
									1,294
								</span>
								watching
							</div>
						</div>
						<div className='sl-popup-bid-amounts'>

							<div className='sl-popup-bid-descriptor'>
								Current Highest Bid <span className='sl-popup-bid-currhighest'>$27.00</span>
							</div>
							<div className='sl-popup-bid-descriptor'>
								You are Bidding <span className='sl-popup-bid-new'>$32.40</span>
							</div>

						</div>

					</div>

					<button className='button-primary button-medium width-100 margin-top-20px'>Submit Bid</button>

				</HeaderedPopup>

				<div className='spotlight-left-container'>
					<SpotlightMedia currentMedia={currentMedia} />

					<h1 
					ref={bidPanelRef} 
					className='slc-header display-flex justify-between align-center cursor-yresize'
					/*onMouseDown={(e) => handleMousedown(e)}>*/>
						Bids
						<div className='editor-panel-header-controls'>
							<button className='editor-panel-header-button' onClick={() => toggleBidPanel()}>
								<img src={bidPanelHeight === 0? 'https://www.svgrepo.com/show/362530/caret-up-bold.svg' : 'https://www.svgrepo.com/show/362528/caret-down-bold.svg'} alt='min/max' className='editor-panel-header-button-img' />
							</button>
						</div>
					</h1>
					<SpotlightBid 
					_ref={bidPanelRef} 
					uploadMedia={uploadMedia}
					uploadMediaMessage={uploadMessage.panel}
					uploadLoading={uploadMessage.uploadLoading}
					userUploads={userUploads}
					selectedUploadIndex={selectedUploadIndex}
					openBidPopup={() => setBidPopupVisible(true)}
					height={bidPanelHeight} />
				</div>

				<SpotlightChat />

    	</div>
    </div>
  );
};

export default SpotlightPage;