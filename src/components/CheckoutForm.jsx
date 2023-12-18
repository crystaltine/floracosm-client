import { PaymentElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import "../styles/payment/PaymentPage.css";
import ContributeAgreements from "./ContributeAgreements";
import { API, getSizeByAmount } from "../utils";
import { LoadingBox } from "./LoadingBox";

export default function CheckoutForm(props) {

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [agreements, setAgreements] = useState(() => {
    return JSON.parse(localStorage.getItem('agreements')) || {
      terms: false,
      nonrefund: false,
      guidelines: false,
    }
  });

  useEffect(() => {
    localStorage.setItem('agreements', JSON.stringify(agreements));
  }, [agreements]);

  const payDisabled = 
    isProcessing || !stripe || !elements ||
    !(Object.values(agreements).every((val) => val === true));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    // Check for inconsistencies in submission
    // amount to donate must be correct
    fetch(API('/payment-intent-values', {intentID: props.intentID}))
    .then(res => res.json())
    .then((data) => {

      if (!data.success) {
        setMessage(data.message)
        setIsProcessing(false);
        return;
      }

      /*
        Send submission with paymentIntent value to server 
        (so if user tampers on client side they still pay the PI amount)

        + Save to database
        This will originally be unconfirmed
        On webhook event from stripe, update the
        database entry to confirmed. Sending here ensures
        that the data is not tampered with while the
        confirmation or redirect is happening.
        */
      fetch(API('/create-entry'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionState: {...props.submissionState, amount: data.amount},
          clientSecret: props.clientSecret,
          intentID: props.intentID,
        }),
      })
      .then(res => res.json())
      .then(async (data) => {
        
        if (!data.success) {
          setMessage(data.message);
          setIsProcessing(false);
          return;
        }

        // Last check - endpoint /check-space-availability
        fetch(API('/check-space-availability'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            x: props.submissionState.x,
            y: props.submissionState.y,
            size: getSizeByAmount(props.submissionState.amount),
          }),
        })
        .then(res => res.json())
        .then(async data => {
          if (!data.success) {
            setMessage(data.message);
            setIsProcessing(false);
            return;
          }

          if (!data.available) {
            setMessage("The space you selected is no longer available. Please select another space.");
            setIsProcessing(false);
            return;
          }

          // If space is available, proceed with payment
          // Try payment
          setIsProcessing(true);
          const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `https://floracosm.org/completion`,
            },
          });

          if (error) {
            // Card error or validation error should be given to user
            if (error.type === "card_error" || error.type === "validation_error") {
              setMessage(error.message);
              setIsProcessing(false);
            } else {
              setMessage("An unexpected error occured during your payment that has caused it to fail.");
              setIsProcessing(false);
            }
          }
          
        }
        ).catch((err) => {
          setMessage("An error occured on our end while attempting to check space availability. We're working on it!");
          setIsProcessing(false);
        });
        
      }).catch((err) => {
        setMessage("An error occured while trying to set up your payment. Try again in a bit!");
        setIsProcessing(false);
      });

    }).catch((err) => {
      setMessage("An error occured while trying to set up your payment. Try again in a bit!");
      setIsProcessing(false);
    });
  };

  return (
    stripe && elements?
    <form className="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      
      <div className='margin-top-20px'>
        <ContributeAgreements 
        innerFontSizes={[14, 12]}
        agreements={agreements} 
        setAgreements={setAgreements} />
      </div>

      {message && <div className="error-message margin-top-20px">{message}</div>}

      <button 
      disabled={payDisabled}
      type="submit"
      className='button-primary button-medium width-100 margin-top-10px'>
        {isProcessing ? "Processing ... " : "Send Donation!"}
      </button>

    </form> : 
    <LoadingBox />
  );
}