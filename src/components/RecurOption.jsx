import React from 'react';
import '../styles/contribute/RecurOption.css';
import Slider from './Slider';

const RecurOption = (props) => {
  return (
    <div className='space-bg'>
			<div className='recurring-contribution-option'>
				Make this a Recurring Contribution?
				<br/>
				<span className='donate-every'>Make a donation...</span>
				<Slider
					children={[
						{value: 'Just Once', bg: '#3ea5ff', fadedBg: '#3ea5ff60', fg: '#ffffff', fadedFg: '#ffffff60'},
						{value: 'Monthly', bg: '#0867ff', fadedBg: '#0867ff60', fg: '#ffffff', fadedFg: '#ffffff60'},
						{value: 'Quarterly', bg: '#0439aa', fadedBg: '#0439aa60', fg: '#ffffff', fadedFg: '#ffffff60'},
						{value: 'Annually', bg: '#00226a', fadedBg: '#00226a60', fg: '#ffffff', fadedFg: '#ffffff60'},
					]}
					selectedIdx={props.selectedIdx}
					onClickChild={props.setSelectedIdx}
					prefix=''
					styles={{border: '2px solid #f3f5fa'}}
				/>
			</div>
    </div>
  );
};

export default RecurOption;