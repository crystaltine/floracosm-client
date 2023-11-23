import React from 'react';
// import '../styles/contribute/OldContributePage.css';
import '../styles/general/prebuilt.css';
import MenuBar from '../../components/MenuBar';
import Slider from '../../components/Slider';
import ContributeAgreements from '../../components/ContributeAgreements';
import PerkDisplay from '../../components/PerkDisplay';
import SubmissionPreviewer from '../../components/SubmissionPreviewer';
import EditorPanel from '../../components/EditorPanel';
import { CenteredPopup } from '../../components/CenteredPopup';
import TextInput from '../../components/TextInput';
import SwitchOption from '../../components/SwitchOption';

const quickDonationOptions = [
  {
    value: 1,
    bg: '#0ac0bd',
    fadedBg: '#0ac0bd40',
    fg: '#000000',
    fadedFg: '#00000040',
  },
  {
    value: 5,
    bg: '#2cd50a',
    fadedBg: '#2cd50a40',
    fg: '#000000',
    fadedFg: '#00000040',
  },
  {
    value: 20,
    bg: '#d3c605',
    fadedBg: '#d3c60540',
    fg: '#000000',
    fadedFg: '#00000040',
  },
  {
    value: 50,
    bg: '#e08a00',
    fadedBg: '#e08a0040',
    fg: '#000000',
    fadedFg: '#00000040',
  },
  {
    value: 100,
    bg: '#de5854',
    fadedBg: '#de585440',
    fg: '#000000',
    fadedFg: '#00000040',
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

  const loggedIn = ( 
    localStorage.getItem('username') &&
    localStorage.getItem('displayName') &&
    localStorage.getItem('avatarRef')
  )

  function updateUnlockedPerks(newContributionValue) {
    let newPerkState = [...perkState];
    for (let i = 0; i < newPerkState.length; i++) {
      newPerkState[i].unlocked = newContributionValue >= costs[i];
      newPerkState[i].selected = newContributionValue >= costs[i];
    }
    setPerkState(newPerkState);
  }
  function toggleEditorPanel() {
    if (editorPanelHeight > 0)
      setEditorPanelHeight(0);
    else 
      setEditorPanelHeight(300);
  }

  // To be used by the image uploader - on change, it should send image to db and update the ref here.
  function updateImageRef(newImageRef) {
    setSubmissionState({...submissionState, imageRef: newImageRef});
  }


  const [submissionState, setSubmissionState] = React.useState(
    localStorage.getItem('submissionState')? 
    JSON.parse(localStorage.getItem('submissionState')) :
    require('../../static/default_card_data.json')
  )

  console.log("Submissionstate accountlessDisplayName: " + submissionState.accountlessDisplayName)
  console.log("SubmissionState anonymous: " + submissionState.anonymous)

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
  const [editorPanelHeight, setEditorPanelHeight] = React.useState(240);
  const [showingUnsupportedFilePopup, setShowingUnsupportedFilePopup] = React.useState(false);
  const [agreements, setAgreements] = React.useState({
    terms: false,
    nonrefund: false,
    guidelines: false,
  });

  // Refs
  const customAmtInputRef = React.useRef();
  const imageEditorScrollableRef = React.useRef();
  const editorPreviewRef = React.useRef();
  const editorPanelContentRef = React.useRef();
  const editorPanelHeaderRef = React.useRef();

  React.useEffect(() => {
    try {
      editorPreviewRef.current.style.height = `${imageEditorScrollableRef.current.clientHeight - editorPanelHeaderRef.current.clientHeight - editorPanelHeight}px`;
    } catch {}

    window.addEventListener('resize', () => {
      try {
        editorPreviewRef.current.style.height = `${imageEditorScrollableRef.current.clientHeight - editorPanelHeaderRef.current.clientHeight - editorPanelHeight}px`;
      } catch {}
    });

    }, [editorPanelHeight]);

  // Update saved submissionState in local storage on change
  React.useEffect(() => {
    localStorage.setItem('submissionState', JSON.stringify(submissionState));
  }, [submissionState]);

  return (
    <div className='generic-page-body'>

      <MenuBar selected='Contribute' />
      <CenteredPopup 
      visible={showingUnsupportedFilePopup}
      title="File type not allowed!"
      content="The only file types that can be submitted are .jpg, .jpeg, and .png."
      onClose={() => setShowingUnsupportedFilePopup(false)} />

      <div className='contribute-page-content'>

        <div className='grid-centerer'>
          <div className='submission-preview-container'>
            <h1 className='contribution-page-header'>Submission Preview</h1>

            <div className='image-editor-scrollable' ref={imageEditorScrollableRef}>

              <div className='image-editor' ref={editorPreviewRef}>
                <div className='image-preview-pane'>
                  <div className='padding-provider'>
                    <SubmissionPreviewer
                    allowUpload={true}
                    imageRef={submissionState.imageRef}
                    updateImageRef={updateImageRef}
                    onUnsupportedFile={() => setShowingUnsupportedFilePopup(true)}
                    postText={submissionState.postText}
                    denom='$'
                    displayName={(loggedIn && !submissionState.anonymous)? localStorage.getItem('displayName') : (submissionState.accountlessDisplayName || 'Anonymous')}
                    displayAvatar={(loggedIn && !submissionState.anonymous)? localStorage.getItem('avatarRef') : null}
                    username={(loggedIn && !submissionState.anonymous)? localStorage.getItem('username') : null}
                    textColor={submissionState.textColor}
                    frameId={submissionState.frameId}
                    effectId={submissionState.effectId}
                    bgId={submissionState.bgId}
                    selectedDonationAmount={submissionState.amount}
                    imgSize={[600, 700]}
                    avatarSize={65}
                    padding={16}
                    fontSize={[25, 20, 50, 16]}
                    textPanelWidth={[400, 400]}
                    textPanelHeight={[400, 400]}
                    amountColor='rgb(216, 181, 8)' />
                  </div>
                </div>
              </div>

              <div className='editor-panel'>

                <div 
                ref={editorPanelHeaderRef} className='editor-panel-header'
                onMouseDown={(e) => {
                  e.preventDefault();
                  let prevY = e.clientY;
                  const mouseMoveHandler = (e) => {
                    let diff = e.clientY - prevY;
                    prevY = e.clientY;
                    setEditorPanelHeight((prev) => Math.max(0, Math.min(prev - diff, 600)));
                  };
                  const mouseUpHandler = (e) => {
                    window.removeEventListener('mousemove', mouseMoveHandler);
                    window.removeEventListener('mouseup', mouseUpHandler);
                  };
                  window.addEventListener('mousemove', mouseMoveHandler);
                  window.addEventListener('mouseup', mouseUpHandler);
                }}>
                  Editor Panel
                  <div className='editor-panel-header-controls'>
                    <button className='editor-panel-header-button' onClick={() => toggleEditorPanel()}>
                      <img src={editorPanelHeight === 0? 'https://www.svgrepo.com/show/362530/caret-up-bold.svg' : 'https://www.svgrepo.com/show/362528/caret-down-bold.svg'} alt='min/max' className='editor-panel-header-button-img' />
                    </button>
                  </div>
                </div>
                <EditorPanel 
                editorRef={editorPanelContentRef} 
                height={editorPanelHeight} />
              </div>

            </div>
          </div>
        </div>

        <div className='grid-centerer'>
          <div className='submission-editor-container'>
            <h1 className='contribution-page-header'>Details</h1>

            <div className='submission-editor-scrollable'>

              {
                !loggedIn &&
                <div className='create-account-prompt'>
                  Create an Account to Track your Impact!
                  <div className='flex-row align-center flex-gap-20px'>
                    <a href='/account/login' className='text-decoration-none text-black'>
                      <button className='button-secondary button-medium'>Log In</button>
                    </a>
                    <a href='/account/register' className='text-decoration-none text-black'>
                      <button className='button-primary button-medium'>Create Account</button>
                    </a>
                  </div>
                </div>
              }
              
              {
                loggedIn?
                <div>
                  <div className='minilabel'>Profile</div>
                  <SwitchOption
                  directive="Make this an anonymous post"
                  desc="When anonymous, your profile picture and display name will not be shown on the card."
                  outerStyle={{padding: '10px 30px'}}
                  selected={submissionState.anonymous}
                  toggleSelected={() => { setSubmissionState({...submissionState, anonymous: !submissionState.anonymous}) }} />
                </div> :
                <TextInput
                label='Display Name'
                type='input'
                placeholder='Leave blank to remain anonymous'
                value={submissionState.accountlessDisplayName || ''}
                onChange={(e) => {setSubmissionState({...submissionState, accountlessDisplayName: e.target.value})}}
                maxLength={32} />
              }

              <TextInput
              label='Description'
              type='textarea'
              placeholder='An Exciting Description...'
              value={submissionState.postText || ''}
              onChange={(e) => {setSubmissionState({...submissionState, postText: e.target.value})}}
              maxLength={250} />

              <div>
                <div className='minilabel'>Select Amount</div>
                <div className='donation-selection-container'>
                  <Slider 
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

              <div>
                <div className='minilabel'>Image Size</div>
              </div>

              <div>
                <div className='minilabel'>Perks</div>
                <PerkDisplay perks={perkState} denom='$'/>
              </div>

              <ContributeAgreements agreements={agreements} setAgreements={setAgreements} />

              <a className='text-decoration-none text-white width-100' href='/payment'>
                <button className='button-primary button-large width-100'>Continue to Payment</button>
              </a>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContributePage;