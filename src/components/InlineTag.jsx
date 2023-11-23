import React from 'react';
import '../styles/general/InlineTag.css';

const InlineTag = ({
text, style,
color = '#cf4208', 
backgroundColor = '#f002', 
borderColor = '#cf4208',
fontSize = 16}) => {
  return (
    <div 
		style={{
			...style,
			fontSize,
			color,
			backgroundColor,
			borderColor,
			borderWidth: Math.ceil(fontSize / 10),
		}}
		className='inline-tag-container'>
			{text}
    </div>
  );
};

export default InlineTag;