import React from 'react';
import '../styles/payment/PaymentPage.css'
import '../styles/general/prebuilt.css';
import { loadStripe } from '@stripe/stripe-js';
import MenuBar from '../components/MenuBar';
import CheckoutForm from '../components/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import SubmissionPreviewer from '../components/SubmissionPreviewer';
import { HeaderedPopup } from '../components/CenteredPopup';
import { LoadingBox } from '../components/LoadingBox';
import { setTabInfo } from '../utils';

const appearance = {
  rules: {
    '.Tab': {
      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
    },
  },
  variables: {
    colorPrimary: '#5179f0',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'Mulish, Outfit, system-ui, sans-serif',
  }
};

// If on mobile, use height; otherwise, use width
const windowDim = Math.min(window.innerWidth, window.innerHeight);
const submissionPreviewerSizes = {
  imgSize: [windowDim * 0.6, windowDim * 0.6],
  avatarSize: windowDim * 0.07,
  fontSize: [windowDim * 0.035, windowDim * 0.02, windowDim * 0.045, windowDim * 0.015],
  padding: windowDim * 0.015,
}

const PaymentPage = (props) => {

  const loggedIn = ( 
    localStorage.getItem('username') &&
    localStorage.getItem('displayName') &&
    localStorage.getItem('avatarRef')
  )

  // Pull from local storage
  const [submissionState] = React.useState(JSON.parse(localStorage.getItem('submissionState') || require('../static/default_card_data.json')));

  const [stripePromise, setStripePromise] = React.useState(null);
  const [clientSecret, setClientSecret] = React.useState("");
  const [intentID, setIntentID] = React.useState("");

  const [showingErrorPopup, setShowingErrorPopup] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [randomCatPhoto, setRandomCatPhoto] = React.useState(null);

  React.useEffect(() => {

    setTabInfo('Donate | Floracosm');

    fetch('https://cataas.com/cat').then(async (res) => {
      setRandomCatPhoto(res.url);
    }).catch(e => {}); // ignore (not a big deal)

  }, []);

  React.useEffect(() => {

    fetch('https://floracosm-server.azurewebsites.net/create-payment-intent', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        submissionState,
        currency: "USD"
      })
    })
    .then(res => res.json())
    .then(data => {

      if (!data.success) {
        setShowingErrorPopup(true);
        setErrorMessage(data.message);
        return;
      }

      // successful creation
      setStripePromise(loadStripe(data.publishableKey));
      const { clientSecret, pid } = data;
      setClientSecret(clientSecret);
      setIntentID(pid);

    }).catch((err) => {
      setShowingErrorPopup(true);
      setErrorMessage("An error occured while trying to set up your payment. Most likely we weren't able to connect to the server. Try again in a bit!");
    })
  }, [submissionState]);

  if (showingErrorPopup) {
    return (
      <div className='generic-page-body'>
        <MenuBar />
        <HeaderedPopup 
        visible={showingErrorPopup}
        title="Oops! An Error Occured!"
        closeButton={true}
        onClose={() => {window.location.href = "/contribute"}}>
          {errorMessage}
        </HeaderedPopup>
      </div>
    )
  }

  return (
    <div className='generic-page-body'>
      <MenuBar />

      <HeaderedPopup 
      visible={showingErrorPopup}
      title="Oops! An Error Occured!"
      closeButton={true}
      onClose={() => {window.location.href = "/contribute"}}>
        <div dangerouslySetInnerHTML={{__html: errorMessage}}></div>
      </HeaderedPopup>

      <div className='payment-page-content'>

        <div className='payment-preview'>
          <div className='payment-image-editor'>
            <div className='payment-image-preview-pane'>
              <div className='payment-padding-provider'>
                <SubmissionPreviewer
                allowUpload={false}
                imageRef={submissionState.imageRef}
                displayName={(loggedIn && !submissionState.anonymous)? localStorage.getItem('displayName') : (submissionState.accountlessDisplayName || 'Anonymous')}
                avatarRef={(loggedIn && !submissionState.anonymous)? localStorage.getItem('avatarRef') : null}
                username={(loggedIn && !submissionState.anonymous)? localStorage.getItem('username') : null}
                postText={submissionState.postText}
                denom='$'
                selectedDonationAmount={submissionState.amount}
                imgSize={submissionPreviewerSizes.imgSize}
                avatarSize={submissionPreviewerSizes.avatarSize}
                fontSize={submissionPreviewerSizes.fontSize}
                padding={submissionPreviewerSizes.padding}
                amountColor='rgb(216, 181, 8)' />
                </div>
              </div>
            </div>
        </div>

        <div className='payment-container'>

          <div className='extra-info'>

            <div className='width-100'>
              <a className='link font-size-16px' href='/contribute'>&larr; Back</a>
            </div>

            <h1 className='font-display'>Select Payment Method</h1>
            <p className='font-weight-500'>
              Thanks for choosing to contribute!

              <br /><br />

              Don't forget to check out&nbsp;
              <a className='link' href='/faq' target='_blank' rel='noreferrer'>the FAQ</a>
              &nbsp;if you have any questions
              or need help.
              
              <br /><br />

              Also, understand that except in rare permitting circumstances, donations are non-refundable.
              Make sure you are logged in to the correct account and that everything is right before you proceed!
            </p>

          </div>

          <div>
            <h2 className='width-100 text-left font-size-20px margin-bottom-10px'>Payment Details</h2>
            {stripePromise && clientSecret?
              <Elements 
              key={clientSecret}
              stripe={stripePromise}
              options={{ clientSecret, appearance }}>
                <CheckoutForm 
                submissionState={submissionState}
                clientSecret={clientSecret}
                intentID={intentID} />
              </Elements> :
              <LoadingBox />}
          </div>

          {randomCatPhoto &&
            <div className='width-100 flex-column align-center'>
              <p className='margin-top-0px margin-bottom-5px font-weight-500'>Here's a random cat photo as a thank you :)</p>
              <img className='max-width-100 max-height-300px' src={randomCatPhoto} alt='random cat' />
              <p className='margin-0px font-size-12px'>
                Courtesy of <a className='link' href='https://cataas.com/' target='_blank' rel='noreferrer'>cataas.com</a>
              </p>
            </div>}

        </div>

      </div>
    </div>
  );
};

export default PaymentPage;