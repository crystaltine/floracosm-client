import React from 'react';
import '../styles/LivePanelStyles.css'
import LiveContribute from './LiveContribute';

const LivePanel = (props) => {
  return (
    <div className='live-panel-container'>
      <LiveContribute />
    </div>
  );
};

export default LivePanel;