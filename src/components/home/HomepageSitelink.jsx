import React from 'react';
import '../../styles/home/HomepageSitelink.css';

const HomepageSitelink = ({title, desc, link, color, imgRef}) => {

	if (window.innerWidth < 1200) {
		return (
			<a className='hpsl-wrapper' href={link}>
				<img className='hpsl-image' src={imgRef} alt={`icon-${title}`}/>
			</a>
		)
	}

  return (
		<a className='hpsl-wrapper' href={link}>
			<div className='hpsl-outline-provider'>

				<div className='hpsl-container' style={{borderColor: color}}>
					<div className='hpsl-title' style={{color}}>{title}</div>

					<img className='hpsl-image' src={imgRef} alt={`icon-${title}`}/>
					<p className='hpsl-desc'>{desc}</p>
				</div>
				
			</div>
		</a>
  );
};

export default HomepageSitelink;