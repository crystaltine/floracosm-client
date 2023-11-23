import React from 'react';
import '../styles/home/HomePage.css'

const StatsBarItem = (props) => {
  return (
    <div className='stats-bar-item'>
      <span className='stats-bar-item-desc'>{props.description || "~"}</span>
      <span className='stats-bar-item-value'>{props.prefix || ""}{props.value || "~"}</span>
    </div>
  );
};

export default StatsBarItem;