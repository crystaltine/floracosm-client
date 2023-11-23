import React from 'react';
import '../styles/general/Checkbox.css'

const Checkbox = (props) => {
  return (
    <button 
    className='checkbox-exterior'
    onClick={props.toggleFilled}>
      
      <div className={`checkbox-fill-area ${props.filled? 'filled' : 'empty'}`} />

    </button>
  );
};

export default Checkbox;