import React from 'react';
import '../styles/account/PastPaymentItem.css';

const PastPaymentItem = (props) => {

	const [textCopied, setTextCopied] = React.useState(false);

  return (
		<div className='payment-history-item'>
			
			<div className='flex-row flex-gap-10px align-center'>
				<img className="phi-image" src={props.imageRef} alt="" />

				<div className='flex-column flex-gap-5px'>

					<div className='font-display font-size-36px font-weight-700 flex-row flex-gap-10px align-center'>
						${props.amount}
					</div>

					<div className='flex-row flex-gap-5px align-center'>
						<span className='font-weight-700 font-size-18px text-faded'>{props.timeInfo.formattedDate}</span>
						<span className='font-weight-500 font-size-16px text-light'>{props.timeInfo.formattedTime}</span>
					</div>

				</div>
			</div>

			<div className='flex-column flex-gap-10px align-end'>
				<a href={`https://floracosm.org/canvasearth?focus=${props.intentID}`} target='_blank' rel='noreferrer' className='text-decoration-none text-black'>
					<button className='button-primary button-medium'>View</button>
				</a>
				<button 
				onClick={() => {
					setTextCopied(true);
					navigator.clipboard.writeText(`https://floracosm.org/canvasearth?focus=${props.intentID}`);
				}}
				onMouseEnter={() => setTextCopied(false) }
				className='button-secondary button-medium'>
					{textCopied? 'Copied!' : 'Copy Link'}
				</button>
			</div>

		</div>
  );
};

export default PastPaymentItem;