import React from 'react';
import '../styles/contribute/Perks.css';

const PerkItem = (props) => {

  const styles = {
    backgroundColor: props.data.unlocked? props.data.bgcolor : 'transparent',
    outline: props.data.unlocked? `2px solid transparent` : '1px solid #1d1f2440',
    color: props.data.unlocked? 'black' : '#00000040',
    fontWeight: props.data.unlocked? 'bold' : 'normal',
  }

  return (
    <div 
      className={`perk-item${props.data.unlocked? ' unlocked' : ' locked'}`} 
      style={styles}>

      <div className='perk-item-cost-section'>
        <span className='perk-item-cost-text'>{props.denom}{props.data.cost}</span>
      </div>
      <div className='perk-item-text-section'>
        <span className='perk-item-text'>{props.data.desc}</span>
      </div>

    </div>
  );
};

export default PerkItem;

/*
      <div className='perk-item-icon-section'>
        <img className='perk-item-icon' src={props.data.img} alt='Perk Icon'/>
      </div>
*/