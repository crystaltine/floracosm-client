import React from 'react';
import '../../../styles/spotlight/UpcomingView.css';
import CompactProfile from '../../CompactProfile';

const winningIcon = require('../../../assets/icons/crown.png');
const losingIcon = require('../../../assets/icons/losing.png');

/**
 * Calculated as 10% above the previous highest 
 * minimum of $1 increase over previous highest
 * @param {Number} highestBid current highest bid
 */
export function calcMinBid(highestBid) {
	const bid = Number(highestBid);

	if (bid < 10) return bid + 1;
	else return bid * 1.1;
}

/**
 * Custom bid must be at or above the minimum bid
 * Does not have to be an integer value
 */
export function isCustomBidValid(customBid, highestBid) {
	return Number.parseFloat(customBid) >= calcMinBid(highestBid);
}
	

const UpcomingView = ({
	userBid, highestBid, highestBidderProfile, 
	number, durationLeft, userBalance, message,
	openBidPopup, }) => {

	const userHasHighestBid = userBid === highestBid;
	const [selectedBidAmt, setSelectedBidAmt] = React.useState(calcMinBid(highestBid));

  return (
    <div className='sl-view-container-general sl-upcoming-container'>
			<div className='sl-upcoming-main'>

				<div className='sl-upcoming-left'>
					<div className='sl-upcoming-left-shape'></div>
					<span className='sl-upcoming-num'>#{number}</span>
				</div>

				<div className='sl-upcoming-mid'>
					<div className='sl-winning-bid-card height-100'>

						<img className='sl-winning-bid-icon' src={winningIcon} alt='crown' />

						<hr className='margin-top-5px margin-bottom-5px' />

						<div className='sl-winning-bid-text'>
							<span className='sl-winning-bid-text-header'>HIGHEST BID</span>
							${highestBid.toFixed(2)}
						</div>

						<div className='sl-winning-bid-profilecontainer'>
							<CompactProfile
							fontSizes={[16, 14]}
							imgSize={32}
							displayName={highestBidderProfile.displayName}
							username={highestBidderProfile.username}
							avatarRef={highestBidderProfile.avatarRef} />
						</div>

						<hr className='margin-top-auto' />

						<p className='sl-winning-bid-timestamp'>1m 47s ago</p>

					</div>
				</div>

				<div className='sl-upcoming-right'>

					<div className='sl-winning-bid-card height-100'>

						<div className='sl-winning-bid-text'>
							<span className='sl-winning-bid-text-header'>YOUR BID</span>
							${userBid.toFixed(2)}
						</div>

						<p className='sl-winning-bid-timestamp'>33s ago</p>

					</div>

					<div className='sl-user-bid-options-container'>

						<div className='sl-winning-bid-text-header margin-bottom-5px'>PLACE BID</div>

						<div className='sl-user-bid-options'>

							<div className='sl-user-bid-price-setter'>

								<div className='display-flex justify-center width-100 font-weight-800'>$&nbsp;
								<input
								value={selectedBidAmt}
								onChange={e => setSelectedBidAmt(e.target.value)}
								className='sl-customamount-input' /></div>

								<button 
								onClick={() => setSelectedBidAmt(calcMinBid(highestBid).toFixed(2))}
								className='button-primary button-medium width-100'>
									Minimum
								</button>

							</div>

							<button 
							onClick={openBidPopup}
							className='button-secondary button-medium width-100'>
								Edit Bid Details
							</button>		

							<button 
							className='button-primary button-medium width-100'>
								Place Bid
							</button>		

						</div>

					</div>
				</div>

			</div>
    </div>
  );
};

export default UpcomingView;