import React from 'react';
import '../styles/contribute/Perks.css';
import PerkItem from './PerkItem';

const textIcon = require('../assets/perk-text.png');
const imageIcon = require('../assets/perk-image.png');
const colorIcon = require('../assets/perk-color.png');
const mysteryIcon = require('../assets/perk-mystery.png');

const PerkDisplay = (props) => {
  return (
    <div className='perk-display-container'>
      {props.perks.map((perk, index) => {
				return (
					<PerkItem
						key={index}
						data={perk}
						denom={props.denom}
					/>
				)
			})}				
    </div>
  );
};

export default PerkDisplay;