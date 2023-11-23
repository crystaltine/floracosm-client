import React from 'react';
import '../styles/general/Slider.css'

const SliderItem = ({ value, bgVarname, color, selected, onClick, prefix, style, subtext, descIcon }) => {

	const [hovering, setHovering] = React.useState(false);

	const styles = {
		...style,
    backgroundImage: (selected || hovering)? `var(${bgVarname})` : undefined,
		border: (selected || hovering)? `2px solid ${color}a0` : `2px solid ${color}40`,
		boxShadow: (selected || hovering)? `0 0 1px 4px ${color}40` : `0 0 1px 0px ${color}10`,
		color: (selected || hovering)? `#000` : `#0006`,
	}

  return (
    <div 
    className='slider-item' 
    style={styles} 
    onClick={onClick}
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}>

      <span className='font-display font-size-20px font-weight-800'>{prefix}{value}</span>

      <span className='slider-subtext'>
        <img className={`image-20px ${selected? "" : "filter-opacity-50"}`} src={descIcon} alt='.' />
        {subtext}
      </span>
    </div>
  );
};

export default SliderItem;