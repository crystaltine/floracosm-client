import React from 'react';
import '../styles/account/ChangesMadeBanner.css'

const ChangesMadeBanner = (props) => {
  return (
    <div className='changes-made-banner' style={{display: (props.visible? 'flex' : 'none')}}>
      <span className='font-size-16px font-weight-600'>You have unsaved changes! Don't forget to save before you leave!</span>
      <div className='flex-row flex-gap-20px'>
				<button className='button-secondary button-medium' onClick={props.resetChanges}>Reset</button>
        <button className='button-primary button-medium' onClick={props.saveChanges}>Save Changes</button>
			</div>
    </div>
  );
};

export default ChangesMadeBanner;