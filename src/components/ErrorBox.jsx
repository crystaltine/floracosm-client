import React from 'react';

const ErrorBox = ({ message, outerStyle, buttonStyle, imgStyle, imgSrc, retryText, onRetry }) => {

  return (
    <div className='font-size-16px margin-auto padding-20px border-box text-danger text-center flex-column flex-gap-10px' style={outerStyle}> 

			<img 
			alt='X'
			style={imgStyle}
			className='image-100px margin-x-auto' 
			src={imgSrc || require('../assets/error.png')} />

      {message} 

			{onRetry && 
				<button 
				className='button-primary button-medium font-size-16px width-100' 
				style={buttonStyle} 
				onClick={onRetry}>
					{retryText || 'Retry'}
				</button>}

		</div>
  );
};

export default ErrorBox;