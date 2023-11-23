import React from 'react';
import '../styles/account/SubscriptionItem.css';

const periodMap = {
    1: 'monthly',
    2: 'quarterly',
    3: 'yearly'
};

const SubscriptionItem = (props) => {
  return (
    <div className='flex-column flex-gap-10px'>
      <div className='subscription-item-container flex-row align-center flex-gap-20px justify-between'>
        <span className='amount-span'>${props.amount}</span>
        <div className='flex-column flex-gap-10px align-end'>
          <span className='start-date-span'>Started {props.startDate}</span>   
          <span className='period-span'> Renews {periodMap[props.period]}</span>     
        </div>
      </div>

      <button className='button-danger button-medium align-self-end'>Cancel</button>
    </div>
  );
};

export default SubscriptionItem;