import React from 'react';
import '../styles/completion/CompletionPage.css';
import SocialMediaShareButton from '../components/SocialMediaShareButton';
import LinkDisplay from '../components/LinkDisplay';
import SubmissionPreviewer from '../components/SubmissionPreviewer';
import { API, setTabInfo } from '../utils';

const facebookIcon = require('../assets/social_media/facebook.png');
const twitterIcon = require('../assets/social_media/twitter.png');
const instagramIcon = require('../assets/social_media/instagram.png');
const snapchatIcon = require('../assets/social_media/snapchat.png');
const tiktokIcon = require('../assets/social_media/tiktok.png');

const CompletionPage = () => {

  const [smallSPTextSize, setSmallSPTextSize] = React.useState(window.innerWidth < 800);

  const URLParams = new URLSearchParams(window.location.search);
  const intentID = URLParams.get('payment_intent') || '';

  const [submission, setSubmission] = React.useState(localStorage.getItem('submissionState'));
  const [retryFetchTimeout, setRetryFetchTimeout] = React.useState(1000);

  React.useEffect(() => {
    // Get the submission from server to display on right side
    fetch(API('/get-single-contribution-display', {intentID}))
      .then(res => res.json())
      .then(data => {
        if ((!data || data.error || !data.data) && retryFetchTimeout) {
          const interval = setInterval(() => {
            fetch(API('/get-single-contribution-display', {intentID}))
              .then(res => res.json())
              .then(data => {
                if (!data || data.error || !data.data) {setRetryFetchTimeout(Math.min(retryFetchTimeout*2, 30000)); return;}

                // finally got it
                setSubmission(data.data);
                clearInterval(interval);
              })
              .catch();
            }, retryFetchTimeout);
        }

        // use server data if possible, otherwise use local storage
        setSubmission(data.data);
      })
      .catch();

    // Clear local storage
    localStorage.removeItem('submissionState');
    localStorage.setItem('agreements', JSON.stringify({
      terms: false,
      nonrefund: false,
      guidelines: false
    }));
  }, [intentID, retryFetchTimeout]);

  React.useEffect(() => {

    setTabInfo('Thank You | Floracosm');

    const resizeListener = () => {
      setSmallSPTextSize(window.innerWidth < 800);
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  return (
    <div className='completion-page-content'>

      <div className='cpc-pane1'>

        <div className='completion-header-container'>
          <h1 className='completion-title'>&#127881; Thank You!</h1>
          <h2 className='completion-subtitle'>Your submission has successfully been recorded.</h2>
          <h3 className='completion-text'><b>Know that you've changed something</b>, no matter how much you've been able to contribute. After all, if everyone acted as generously as you, where do you think we could be right now? So we thank you, truly, and hope all goes well in your future.</h3>
        </div>

        <div className='completion-body-container'>
          <div>
            <div className='completion-minilabel'>Next Steps</div>

            <div className='next-steps-container'>
              
              <a className='link-invis width-100' href={`/canvasearth?focus=${intentID}`}>
                <button className='button-primary button-large width-100'>View Your Submission</button>
              </a>

              <a className='link-invis width-100' href='/'>
                <button className='button-secondary-dark button-large width-100'>Back to Homepage</button>
              </a>

              <a className='link-invis width-100' href='/account'>
                <button className='button-secondary-dark button-large width-100'>Your Account Page</button>
              </a>
              
            </div>
          </div>
          <div className='share-container'>

            <div>
              <div className='completion-minilabel'>Share</div>
              <div className='social-media-icons-container'>
                <SocialMediaShareButton icon={facebookIcon} alt='Facebook Icon' />
                <SocialMediaShareButton icon={twitterIcon} alt='Twitter Icon' />
                <SocialMediaShareButton icon={instagramIcon} alt='Instagram Icon' />
                <SocialMediaShareButton icon={snapchatIcon} alt='Snapchat Icon' />
                <SocialMediaShareButton icon={tiktokIcon} alt='TikTok Icon' />
              </div>
            </div>

            <div>
              <div className='completion-minilabel'>Permanent Link</div>
              <div className='share-link-container'>
                <LinkDisplay link={`https://floracosm.org/canvasearth?focus=${intentID}`} />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className='cpc-pane2'>
        {!submission? 
        <SubmissionPreviewer 
        allowUpload={false}
        fontSize={smallSPTextSize? [20, 16, 30, 12] : [32, 18, 50, 24]}
        avatarSize={smallSPTextSize? 40 : 60}
        topStyle={{width: 'min(100%, 600px)', display: 'block'}}
        amountColor='rgb(216, 181, 8)' /> :

        <SubmissionPreviewer 
        allowUpload={false}
        imageRef={submission?.entry?.imageRef || submission?.imageRef} // serverData || localData
        displayName={submission?.profile?.displayName || submission?.entry?.displayName || submission?.displayName || localStorage.getItem('displayName') || submission?.accountlessDisplayName}
        avatarRef={submission?.profile?.avatarRef || localStorage.getItem('avatarRef')}
        username={submission?.profile?.username || localStorage.getItem('username')}
        postText={submission?.entry?.postText || submission?.postText}
        denom='$'
        selectedDonationAmount={submission?.entry?.amount || submission?.amount}
        fontSize={smallSPTextSize? [20, 16, 30, 12] : [32, 18, 50, 24]}
        avatarSize={smallSPTextSize? 40 : 60}
        topStyle={{width: 'min(100%, 600px)', display: 'block'}}
        amountColor='rgb(216, 181, 8)' />}
      </div>

    </div>
  );
};

export default CompletionPage;