import React from 'react';
import '../styles/contribute/ContributePage.css';
import '../styles/general/prebuilt.css';
import MenuBar from '../components/MenuBar';
import Slider from '../components/Slider';
import ContributeAgreements from '../components/ContributeAgreements';
import { HeaderedPopup } from '../components/CenteredPopup';
import TextInput from '../components/TextInput';
import ContributeImageEditor from '../components/ContributeImageEditor';
import ContributeLocationSelector from '../components/ContributeLocationSelector';
import { getSizeByAmount } from '../utils';
import { loginStatus } from '../App';

const quickDonationOptions = [
  {
    value: 1,
    sub: '1x1',
    color: '#0ac0bd',
    bgVarname: '--crystalGradientAqua',
    style: { width: '100%' }
  },
  {
    value: 5,
    sub: '1x1',
    color: '#2cd50a',
    bgVarname: '--crystalGradientLime',
    style: { width: '100%'}
  },
  {
    value: 20,
    sub: '2x2',
    color: '#d3c605',
    bgVarname: '--crystalGradientYellow',
    style: { width: '100%'}
  },
  {
    value: 50,
    sub: '3x3',
    color: '#e08a00',
    bgVarname: '--crystalGradientOrange',
    style: { width: '100%'}
  },
  {
    value: 100,
    sub: '4x4',
    color: '#de5854',
    bgVarname: '--crystalGradientRed',
    style: { width: '100%'}
  },
]

const costs = [1, 5, 20, 50, 100, 1000];

function amountAllowed(amt) {
	// Cannot be <= 0
	// Cannot have decimals
	// Cannot be > 99,999,999
	return amt > 0 && amt <= 99999999 && Number.isInteger(amt);
}

const ContributePage = (props) => {

  document.title = 'Contribute | Floracosm';

  function updateUnlockedPerks(newContributionValue) {
    let newPerkState = [...perkState];
    for (let i = 0; i < newPerkState.length; i++) {
      newPerkState[i].unlocked = newContributionValue >= costs[i];
      newPerkState[i].selected = newContributionValue >= costs[i];
    }
    setPerkState(newPerkState);
  }

  // To be used by the image uploader - on change, it should send image to db and update the ref here.
  function updateImageRef(newImageRef) {
    setSubmissionState({...submissionState, imageRef: newImageRef});
  }

  function requirementsFulfilled() {
    // All agreements must be true
    // Amount must be valid
    // Position must be available

    if (!amountAllowed(submissionState.amount)) return false;
    if (!positionInfo.isValid) return false;
    if (!agreements.terms || !agreements.nonrefund || !agreements.guidelines) return false;

    return true;
  }

  const [submissionState, setSubmissionState] = React.useState(require('../static/default_card_data.json'))

  const [selectedIndex, setSelectedIndex] = React.useState(costs.indexOf(submissionState.amount));
  const [perkState, setPerkState] = React.useState([
    {
      cost: costs[0],
      desc: 'Listed as a Contributor for this year in the book credits!',
      unlocked: submissionState.amount >= costs[0],
      bgcolor: '#0ac0bd',
    },
    {
      cost: costs[1],
      desc: 'Option to submit a card including a picture, title, and description!',
      unlocked: submissionState.amount >= costs[1],
      bgcolor: '#2cd50a',
    },
    {
      cost: costs[2],
      desc: 'Ability to use colored text and colored backgrounds on your card!',
      unlocked: submissionState.amount >= costs[2],
      bgcolor: '#d3c605',
    },
    {
      cost: costs[3],
      desc: 'Access to 5 Gold Frames and background patterns!',
      unlocked: submissionState.amount >= costs[3],
      bgcolor: '#e08a00',
    },
    {
      cost: costs[4],
      desc: 'Access to 6 Planetary Frames and 12 card effects!',
      unlocked: submissionState.amount >= costs[4],
      bgcolor: '#de5854',
    },
    {
      cost: costs[5],
      desc: '???',
      unlocked: submissionState.amount >= costs[5],
      bgcolor: '#df4dce',
    },
  ]);

  const [errorPopup, setErrorPopup] = React.useState({
    visible: false,
    title: null,
    content: null,
  });

  const [agreements, setAgreements] = React.useState(
    JSON.parse(localStorage.getItem('agreements')) ||
    {
      terms: false,
      nonrefund: false,
      guidelines: false,
    }
  );

  const [previewMode, setPreviewMode] = React.useState('card'); // 'card' or 'location'
  const [positionInfo, setPositionInfo] = React.useState({
    x: submissionState.x,
    y: submissionState.y,
    size: getSizeByAmount(submissionState.amount),
  }); // {x, y, size, isValid}

  // Refs
  const customAmtInputRef = React.useRef();
  const imageEditorScrollableRef = React.useRef();
  const editorPreviewRef = React.useRef();

  // Update saved submissionState in local storage on change
  React.useEffect(() => {
    //console.log(`Saving submission state: ${JSON.stringify(submissionState)}`)
    localStorage.setItem('submissionState', JSON.stringify(submissionState));
  }, [submissionState]);

  React.useEffect(() => {
    localStorage.setItem('agreements', JSON.stringify(agreements));
  }, [agreements]);

  // Update positionInfo size on change of amt, also remove location (since it might not be valid anymore)
  React.useEffect(() => {
    setPositionInfo({x: null, y: null, size: getSizeByAmount(submissionState.amount), isValid: false});
    setSubmissionState(submissionState? {...submissionState, x: null, y: null} : null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionState.amount]);

  const uploadImageFromButton = React.useCallback((e) => {

    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.match(/\.(png|jpg|jpeg)$/)) {
      setErrorPopup({
        visible: true,
        title: 'Invalid File Type',
        content: 'The only file types that can be submitted are .jpg, .jpeg, and .png.',
      });
      e.target.files[0] = null;
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    fetch("https://floracosm-server.azurewebsites.net/upload", {
      method: "POST",
      body: formData
    }).then((res) => {
      return res.json();
    }).then((data) => {
      const img_url = data.img_url;
      setSubmissionState({...submissionState, imageRef: img_url});
    }).catch(err => {
      setErrorPopup({
        visible: true,
        title: 'Upload Error',
        content: 'An error occurred while uploading your image. Try again in a bit!',
      });
    });
  }, [submissionState]);

  return (
    <div className='generic-page-body'>

      <MenuBar selected='Contribute' />

      <HeaderedPopup
      visible={errorPopup.visible}
      title={errorPopup.title}
      closeButton={true}
      onClose={() => { setErrorPopup({...errorPopup, visible: false}) }}>
        <div dangerouslySetInnerHTML={{__html: errorPopup.content}} />
      </HeaderedPopup>

      <div className='contribute-page-content'>

        <div className='grid-centerer'>
          <div className='submission-preview-container'>

            <div className='preview-mode-selector'>
              
              <button
              onClick={() => { setPreviewMode('card') }}
              className={`preview-mode-selector-button ${previewMode === 'card'? '--pmsb-selected' : ''}`}> 
                Preview Card
              </button>

              <button
              onClick={() => { setPreviewMode('location') }}
              className={`preview-mode-selector-button ${previewMode === 'location'? '--pmsb-selected' : ''}`}>
                Pick a Location
              </button>

            </div>

            <div className='preview-scrollable' ref={imageEditorScrollableRef}>

              {previewMode === 'card'?
                <ContributeImageEditor
                editorPreviewRef={editorPreviewRef}
                submissionState={submissionState}
                loggedIn={loginStatus()}
                updateImageRef={updateImageRef}
                setErrorPopup={setErrorPopup} /> :

                <ContributeLocationSelector 
                onSelectPos={(x, y, size, isValid) => {
                  setSubmissionState({...submissionState, x, y});
                  setPositionInfo({x, y, size, isValid});
                }}
                selectedPos={[positionInfo.x, positionInfo.y]}
                previewSize={getSizeByAmount(submissionState.amount)} />
              }

            </div>

          </div>
        </div>

        <div className='grid-centerer'>
          <div className='submission-editor-container'>
            <div className='submission-editor-scrollable'>
              
              <div>

                <div className='position-relative margin-bottom-15px hsh-lined-thin --hchc-aqua_green'>
                  <h1>Contribute to CanvasEarth</h1>
                </div>

                <div className='font-size-16px'>
                  Thanks for your interest in donating!
                  <br /><br />

                  <h2>How to Contribute:</h2>
                  Fill in an <b>optional display name and description.</b> If you leave these blank, your post will be titled "Anonymous" and no description will be shown.
                  <br /><br />
                  Click the placeholder image on the left or the Upload Image button below to select your photo!
                  <br /><br />
                  Keep in mind that <b>higher donation amounts will increase the size of your image.</b> 
                  <br /><br />
                  If you pick a spot and then change the amount, you will have to select another spot, as your original choice may no longer be available.
                  <br /><br />
                  {!loginStatus() && `If you are <a className='link' href='/account'>logged in</a>, the amount you donate will be tracked to your account. We recommend you create an account before donating (though it is not required) because without one, you won't be able to see your total impact across donations.`}
                </div>

              </div>

              {!loginStatus() &&
                <div className='create-account-prompt'>
                  Before continuing, consider creating an account!
                  <p className='mopo font-size-14px font-weight-500'>With an account, you are able to track your total impact across donations.</p>
                  <div className='flex-row align-center flex-gap-20px'>
                    <a href='/account/login' className='text-decoration-none text-black'>
                      <button className='button-secondary button-medium'>Log In</button>
                    </a>
                    <a href='/account/register' className='text-decoration-none text-black'>
                      <button className='button-primary button-medium'>Create Account</button>
                    </a>
                  </div>
                </div>}
              
              {!loginStatus() &&
                <TextInput
                label='Display Name'
                type='input'
                placeholder='Leave blank to remain anonymous'
                value={submissionState.accountlessDisplayName || ''}
                onChange={(e) => {setSubmissionState(submissionState? {...submissionState, accountlessDisplayName: e.target.value} : null)}}
                maxLength={32} />}

              <TextInput
              label='Description'
              type='textarea'
              placeholder='An Exciting Description...'
              value={submissionState.postText || ''}
              onChange={(e) => {setSubmissionState(submissionState? {...submissionState, postText: e.target.value} : null)}}
              maxLength={250} />

              {/* Upload Image Button */}
              <div>
                <div className='minilabel'>Upload Image</div>
                <button className='button-primary button-medium width-100 position-relative'>
                  <input type='file' className='file-input-invis' onChange={(e) => { uploadImageFromButton(e) }} />
                  Upload Image
                </button>
              </div>

              {/* Amount slider */}
              <div>
                <div className='minilabel'>Select Amount</div>
                <div className='donation-selection-container'>
                  <Slider 
                  descIcon={require('../assets/icons/grid_icon.png')}
                  children={quickDonationOptions} 
                  selectedIdx={selectedIndex} 
                  prefix="$"
                  onClickChild={(idx) => {
                    const amt = costs[idx];
                    setSelectedIndex(() => idx);
                    setSubmissionState({...submissionState, amount: amt});
                    updateUnlockedPerks(amt);
                    customAmtInputRef.current.value = '';
                  }} />

                  <div className='custom-donation-input-container'>
                    Custom
                    <input
                    style={{
                      border: amountAllowed(submissionState.amount) ? '1px solid #00000059' : '1px solid #ff2015',
                      boxShadow: amountAllowed(submissionState.amount) ? 'none' : '0px 0px 5px 0px #ff2015',
                    }}
                      type='number' 
                      ref={customAmtInputRef}
                      placeholder='Custom Amount' 
                      value={submissionState.amount || ''}
                      className='custom-donation-input' 
                      onChange={(e) => {
                        setSubmissionState({...submissionState, amount: Number.parseFloat(e.target.value)});
                        updateUnlockedPerks(e.target.value)
                        setSelectedIndex([1, 5, 20, 50, 100, 1000].indexOf(Number.parseFloat(e.target.value)));
                      }}
                      min='1'
                      max='99999999'
                      required />
                  </div>

                </div>
              </div>

              {/* location info */}
              <div>
                <div className='minilabel'>Location</div>

                <div 
                className='contribute-location-info'
                style={positionInfo.isValid? {backgroundColor: '#14ec1030'} : {backgroundColor: '#ff201530'}}>
                  
                  <div className='location-info-column'>
                    <span className='font-size-14px font-weight-500'>Position</span>
                    <span className='font-size-20px'>
                      {((typeof positionInfo.x === 'number') || (typeof positionInfo.y === 'number'))?
                        `(${positionInfo.x}, ${positionInfo.y})` :
                        'None'
                      }
                    </span>
                  </div>

                  <div className='location-info-column'>
                    <span className='font-size-14px font-weight-500'>Size</span>
                    <span className='font-size-20px'>
                      {positionInfo.size? `${positionInfo.size}x${positionInfo.size}` : 'None'}
                    </span>
                  </div>

                  <div className='location-info-column'>
                    <span className='font-size-14px font-weight-500'>Available</span>
                    <span className='font-size-16px font-weight-400'>
                      {positionInfo.isValid? 
                        <img src={require('../assets/icons/checkmark_icon.png')} alt='Yes' className='image-30px' /> :
                        <img src={require('../assets/icons/unavailable.png')} alt='No' className='image-30px' />
                      }
                    </span>
                  </div>

                </div>

                <button 
                onClick={() => { setPreviewMode('location') }}
                className='button-primary button-medium width-100 margin-top-10px'>
                  Open Location Selector
                </button>

              </div>

              <ContributeAgreements 
              innerFontSizes={[15, 13]}
              agreements={agreements} 
              setAgreements={setAgreements} />

              <div>
                <button 
                disabled={!requirementsFulfilled()}
                onClick={() => { window.location.href = '/payment' }}
                className={`button-primary button-medium width-100 margin-top-10px`}>
                  Continue to Payment
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContributePage;