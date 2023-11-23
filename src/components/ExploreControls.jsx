import React from 'react';
import '../styles/explore/ExploreControls.css';

const ExploreControls = ({
	zoomIn, zoomOut, resetToCenter, 
	refresh, zoomRange, currZoom, 
	canvasSize, hide }) => {
  return (
    <div className='explore-controls-container' style={{display: hide? 'none' : 'flex'}}>

      <button className='ec-button' onClick={refresh}>
        <img className='ec-btn-icon' src={require('../assets/icons/refresh.png')} alt='re' />
      </button>

			<button className='ec-button' onClick={zoomIn}> 
        <img className='ec-btn-icon' src={require('../assets/icons/zoom_in.png')} alt='in' />
      </button>

			<button className='ec-button' onClick={zoomOut}>
        <img className='ec-btn-icon' src={require('../assets/icons/zoom_out.png')} alt='out' />
      </button>

			<button className='ec-button' onClick={resetToCenter}>
        <img className='ec-btn-icon' src={require('../assets/icons/center.png')} alt='rs' />
      </button>

			<div className='ec-info'>
				Current Zoom: {currZoom?.toFixed(2)}x
				<br />
				Canvas Size: {canvasSize}&times;{canvasSize}
			</div>

    </div>
  );
};

export default ExploreControls;