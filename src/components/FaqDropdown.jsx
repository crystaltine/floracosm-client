import React from 'react';
import '../styles/about/FaqDropdown.css';

const caret_down = require('../assets/icons/caret_down.png');
const caret_up = require('../assets/icons/caret_up.png');

const FaqDropdown = (props) => {

	const [expanded, setExpanded] = React.useState(false);

  return (
    <section className='faq-dropdown' onClick={() => setExpanded(!expanded)}>

      <h2 className='faq-question'>
				<span dangerouslySetInnerHTML={{__html: props.question}} />
				<img src={expanded? caret_up : caret_down} alt='expand' />
			</h2>
			
      <p 
			style={{display: expanded ? 'block' : 'none'}}
			dangerouslySetInnerHTML={{__html: props.answer}} />

    </section>
  );
};

export default FaqDropdown;