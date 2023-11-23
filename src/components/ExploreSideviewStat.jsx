import React from 'react';
import '../styles/explore/ExploreSideview.css';

const ExploreSideviewStat = ({ title, value, icon, color }) => {  

  return (
    <div 
    style={{ borderColor: `${color}80`, backgroundColor: `${color}18`}}
    className='ess-stat-box'>

      <span style={{ color: color }} className='ess-stat-title'>
				<img src={icon} alt='st' className='ess-stat-icon' />
        {title}
    	</span>

			<span style={{ color: color }} className='ess-stat-value text-ellipsis'>
				{value}
			</span>

    </div>
  );
};

export default ExploreSideviewStat;