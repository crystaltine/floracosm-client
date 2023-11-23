import React from 'react';
import '../styles/general/SwitchOption.css';

/**
 * 
 * !!! No internal state tracker, must be controlled by parent somehow
 * 
 * props:
 * ```jsx
 * directive=string
 * desc=string (optional)
 * selected=bool
 * toggleSelected=(void)=>{}
 * directiveStyle=object (optional)
 * descStyle=object (optional)
 * outerStyle=object (optional)
 * image=string|img (optional)
 * imageSize=number (optional)
 * imageGap=number (optional)
 * ```
 */
const SwitchOption = (props) => {

  //console.log(`switch option: props.descstyle: ${JSON.stringify(props.descStyle)}`)

  return (
    <div 
    style={props.outerStyle}
		onClick={() => { props.toggleSelected() }}
		className={`switch-option ${props.selected? '--opt-selected' : '--opt-deselected'}`}>

      {props.image && 
        <img 
        src={props.image} 
        alt='icon' 
        className='switch-option-image' 
        style={{height: props.imageSize || 36, marginRight: props.imageGap || 20}} />
      }

      <div className='flex-column'>
        <span style={props.directiveStyle} dangerouslySetInnerHTML={{__html: props.directive}} />
        {props.desc && <span style={props.descStyle} dangerouslySetInnerHTML={{__html: props.desc}} />}
      </div>
    </div>
  );
};

export default SwitchOption;