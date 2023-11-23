import React from 'react';
import '../styles/LeaderboardsPage.css';
import '../styles/general/prebuilt.css';
import MenuBar from '../../components/MenuBar';
import LeaderboardItem from '../../components/LeaderboardItem';

const testLbData = require('../debug_lb_data.json')
const loadLimitIncrement = 10;

const LeaderbordsPage = (props) => {

  const [loadLimit, setLoadLimit] = React.useState(10); // 2 for debug, 20 for prod
  const lbRef = React.useRef(null);

  // Scroll to bottom whenever loadLimit is updated
  React.useEffect(() => {
    lbRef.current.scrollTop = lbRef.current.scrollHeight;
  }, [loadLimit]);

  return (
    <div className='generic-page-body'>
      <MenuBar selected='Leaderboards' />
      <div className='leaderboards-page-content'>
        <section className='leaderboards-container' ref={lbRef}>
          <div className='leaderboards-titlebar'>
            <h1 className='leaderboards-title'>Leaderboards</h1>
            <div className='filter-selector'>Filter</div>
          </div>
          <div className='leaderboards-body'>
            {testLbData.map((item, index) => {
              if (index < loadLimit) {
                return (
                  <LeaderboardItem
                    key={index}
                    animDelay={(index - loadLimit) * 0.15}
                    name={item.name}
                    message={item.message}
                    amount={item.amount}
                    timestamp={item.timestamp}
                    bgStyle={item.backgroundStyle}
                  />
                );
              }
              return null;
            })}
          </div>

          <div className='leaderboards-loadmore-button-container'>
            <button
            onClick={() => setLoadLimit(loadLimit + loadLimitIncrement)}
            className='leaderboards-loadmore-button'
            >
              Load More
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LeaderbordsPage;