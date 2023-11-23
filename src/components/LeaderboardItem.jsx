import React from 'react';
import '../styles/LeaderboardItem.css'

const LeaderboardItem = (props) => {
  return (
    <div 
    className='leaderboard-item'
    style={{
      animationDelay: `${props.animDelay}s`,
    }}
    >

      <img className='leaderboard-item-avatar' src='https://via.placeholder.com/70' alt='avatar' />
      <div className='leaderboard-item-text'>
        <h2 className='leaderboard-item-name'>{props.name}</h2>
				<p className='leaderboard-item-message'>{props.message}</p>
      </div>

      <div className='leaderboard-item-info'>
        <h4 className='leaderboard-item-amount'>${props.amount}</h4>
        <p className='leaderboard-item-timestamp'>{props.timestamp}</p>
      </div>

    </div>
  );
};

export default LeaderboardItem;