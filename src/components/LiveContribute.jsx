import React from 'react';
import '../styles/LiveContributeStyles.css'

const LiveContribute = (props) => {
  return (
    <div className='live-contribute-container'>
      <h1 className='live-contribute-heading'>Contribute</h1>
      <div className='submission-preview'>
      </div>
      <input className='submission-title' placeholder='Title your submission!' maxLength={32}/>
      <textarea className='submission-caption' placeholder='Caption your submission!' maxLength={150} resiz/>
      <div className='extras-container'>
        <div className='frame-select'></div>
        <div className='color-select'></div>
        <div className='font-select'></div>
      </div>
      <div className='payment-info-container'>
        <div className='cost-summary'>
          USD $14
        </div>
        <div className='balance-summary'>
          Balance: $15
        </div>
        <button className='donate-button'>Submit!</button>
      </div>
    </div>
  );
};

export default LiveContribute;