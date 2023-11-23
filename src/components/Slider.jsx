import React from 'react';
import SliderItem from './SliderItem';
import '../styles/general/Slider.css'

const Slider = ({ children, style, prefix, selectedIdx, onClickChild, descIcon }) => {
  return (
    <div className='slider' style={style}>
      {children.map((child, index) => {
        return (
          <SliderItem 
            key={index} 
            value={child.value}
            subtext={child.sub} 
            color={child.color}
            bgVarname={child.bgVarname}
            style={child.style}
            descIcon={descIcon}
            selected={index === selectedIdx}
            onClick={() => onClickChild(index)}
            prefix={prefix}
            />
        );
      })}
    </div>
  );
};

export default Slider;