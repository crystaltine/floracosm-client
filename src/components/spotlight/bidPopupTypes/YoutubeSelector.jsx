import React from 'react';
import '../../../styles/spotlight/BidMediaSelector.css';
import TextInput from '../../TextInput';

const YT_API_KEY_TEMP = 'AIzaSyAr2Vt_2799HeTePqb595SWQxs1qWKPMs4';

const YoutubeSelector = ({currLink, setCurrLink, currVideoData, setCurrVideoData}) => {

	const [typingTimer, setTypingTimer] = React.useState(null); // for debouncing searchForVideo
	const handleLinkChange = (e) => {
		if (typingTimer) clearTimeout(typingTimer);
		setTypingTimer(setTimeout(() => searchForVideo(e.target.value), 1000));
	};

	const [findVideoMessage, setFindVideoMessage] = React.useState(null); //msg for not found, incomplete link, error fetching, etc

	const searchForVideo = React.useCallback((currLink) => {
		setCurrVideoData({});
		setFindVideoMessage('Searching...');
		let videoId;

		// if they just pasted the ID, then the link will be 11 chars long, try that
		if (currLink.length === 11) { videoId = currLink }
		else {
			videoId = currLink.split('v=')[1];
			// must be 11 chars long
			if (!videoId || videoId.length !== 11) {
				setFindVideoMessage('Please enter a valid YouTube video link or ID.');
				return;
			}
			// must be only letters and numbers and underscores
			if (!videoId.match(/^[_A-Za-z0-9]+$/)) {
				setFindVideoMessage('Please enter a valid YouTube video link or ID.');
				return;
			}
		}

		fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YT_API_KEY_TEMP}`)
		.then(res => res.json())
		.then(data => {
			const videoData = data.items[0];

			if (!videoData) {
				setFindVideoMessage('There doesn\'t seem to be a video matching that link.');
				return;
			}

			setCurrVideoData({
				title: videoData.snippet.title,
				description: videoData.snippet.description,
				publishedAt: videoData.snippet.publishedAt,
				thumbnailRef: videoData.snippet.thumbnails.medium.url,
				channelTitle: videoData.snippet.channelTitle,
				channelID: videoData.snippet.channelId,
				videoID: videoData.id,
			});
			setFindVideoMessage(null);
		})
		.catch(err => {
			console.log(err);
			setFindVideoMessage('Yikes! Couldn\'t fetch the video data.');
		});
	}, [setCurrVideoData]);

  return (
    <div className='sl-media-selector-container'>
			<h1 className='font-size-20px font-weight-800 margin-top-20px margin-bottom-5px'>YouTube Video</h1>

			<div className='flex-row align-center justify-between column-gap-20px'>

				<div className='font-size-16px font-weight-700 display-flex align-center'>
					Video URL
				</div>
				<TextInput
				type='input'
				value={currLink}
				onChange={(e) => {
					setCurrLink(e.target.value);
					handleLinkChange(e);
				}}
				spellcheck={false}
				containerStyle={{ width: 'min(50%, 400px)' }}
				outerStyle={{width: '100%'}}
				style={{width: '100%'}}
				placeholder='Link to YouTube Video'
				maxLength={-1} />

			</div>

			<div className='sl-yt-video-previewer'>
				<div className='font-size-16px font-weight-700 margin-bottom-5px'>
					Video Preview
				</div>
				{currVideoData.thumbnailRef?

					<div className='sl-yt-video-info'>
						<a className='img-link-invis' href={`https://www.youtube.com/watch?v=${currVideoData.videoID}`} target='_blank' rel='noreferrer'>
							<img className='sl-yt-video-thumbnail' src={currVideoData.thumbnailRef} alt='YouTube Video Thumbnail' />
						</a>

						<div className='sl-yt-video-text'>
							<a className='sl-yt-video-title' href={`https://www.youtube.com/watch?v=${currVideoData.videoID}`} target='_blank' rel='noreferrer'>
								{currVideoData.title}
							</a>
							<a className='sl-yt-video-channel' href={`https://www.youtube.com/channel/${currVideoData.channelID}`} target='_blank' rel='noreferrer'>
								{currVideoData.channelTitle}
							</a>
							<div className='sl-yt-video-description'>
								{currVideoData.description}
							</div>
							<div className='sl-yt-video-date'>
								{new Date(currVideoData.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
							</div>
						</div>

					</div> :
					
					<div className='info-message width-100 text-center'>
						{findVideoMessage? findVideoMessage : 'No video selected.'}
					</div>
				}
			</div>

    </div>
  );
};

export default YoutubeSelector;