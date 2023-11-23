import React from 'react';
import '../styles/general/Loading.css';

const LoadGif = () => {
  return (
    <div className="loadingio-spinner-ripple-zavvin6qy4">
      <div className="ldio-mx77hswobgl">
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export const LoadingBox = ({ outerStyle, message }) => {
  // Just the loading spinner
  return (
    <div className='loadingbox-container' style={outerStyle}>

      <LoadGif />

      {message || "Loading..."}
    </div>
  );
};