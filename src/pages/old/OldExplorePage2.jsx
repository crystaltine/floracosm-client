import React from 'react';
import '../styles/explore/OldExplorePage2.css'
import '../styles/general/prebuilt.css'
import MenuBar from '../../components/MenuBar';
import SubmissionPreviewer from '../../components/SubmissionPreviewer';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";

function sortNewest(a, b) {
  return new Date(b.timestamp) - new Date(a.timestamp);
}
function sortOldest(a, b) {
  return new Date(a.timestamp) - new Date(b.timestamp);
}
function sortHighestValue(a, b) {
  return b.amount - a.amount;
}
function sortMostStars(a, b) {
  return b.stars - a.stars;
}

const ExplorePage = (props) => {

  const [cachedSubmissions, setCachedSubmissions] = React.useState([]);
  // This is the DEFINITION of idfk what this does but its the only thing that works
  // (its because the state is an array and refs dont change when the array changes, so component doesnt rerender)
  const [rerenderState, setRerenderState] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('amount');

  const [showCardsInsteadOfPictures, setShowCardsInsteadOfPictures] = React.useState(true);

  function refreshSubmissions() {
    fetch('http://localhost:3999/get-contributions')
      .then(res => res.json())
      .then(data => setCachedSubmissions(data.submissions.sort(sortHighestValue)))
      .catch(err => console.log(err));
  }

  React.useEffect(() => {
    fetch('http://localhost:3999/get-contributions')
      .then(res => res.json())
      .then(data => {

        //if (!data.success) {setFocusedMessage(data.message); return;}

        setCachedSubmissions(data.submissions.sort(sortHighestValue));
      })
      .catch(err => console.log(err));
  }, []);
  
  React.useEffect(() => {
    switch (sortBy) {
      case 'newest':
        setCachedSubmissions(cachedSubmissions.sort(sortNewest));
        break;
      case 'oldest':
        setCachedSubmissions(cachedSubmissions.sort(sortOldest));
        break;
      case 'amount':
        setCachedSubmissions(cachedSubmissions.sort(sortHighestValue));
        break;
      case 'starred':
        setCachedSubmissions(cachedSubmissions.sort(sortMostStars));
        break;
      default:
        setCachedSubmissions(cachedSubmissions.sort(sortHighestValue));
    }

    setRerenderState(() => !rerenderState);

  }, [sortBy, cachedSubmissions]); // don't include rerenderState or it also seems to break. idk why

  return (
    <div className='generic-page-body'>
      <MenuBar selected='Explore' />
      <div className='explore-page-content'>
          <div className='explore-page-controls'>
            <div className='display-flex align-center flex-gap-10px'>
              <input
              type='text'
              placeholder='Search'
              className='search-bar' />

              <button className='control-button' onClick={refreshSubmissions}>
                <img
                src={require('../assets/icons/search.png')}
                alt='refresh'
                className='button-icon' />
              </button>

            </div>

            <div className='display-flex align-center flex-gap-10px'>

              <select className='sort-selector' onChange={(e) => setSortBy(e.target.value)}>
                <option value='amount'>Highest Value</option>
                <option value='newest'>Newest</option>
                <option value='oldest'>Oldest</option>
              </select>

              <button className='control-button' onClick={() => setShowCardsInsteadOfPictures(!showCardsInsteadOfPictures)}>
                <img
                src={require('../assets/icons/image-icon.png')}
                alt='cards'
                className='button-icon' />
              </button>

              <button className='control-button' onClick={refreshSubmissions}>
                <img
                src={require('../assets/icons/refresh.png')}
                alt='refresh'
                className='button-icon' />
              </button>

              <button className='control-button'>
                <img
                src={require('../assets/icons/filter.png')}
                alt='refresh'
                className='button-icon' />
              </button>

              <button className='control-button' onClick={() => {}}>
                <img
                src={require('../assets/icons/shuffle.png')}
                alt='refresh'
                className='button-icon' />
              </button>
              
            </div>
          </div>

          <div className='explore-page-scrollcontainer'>
            <ResponsiveMasonry columnsCountBreakPoints={{500: 1, 700: 2, 900: 3}}>
              <Masonry gutter='40px' style={{padding: "10px 40px 40px 40px"}}>

                {/* TODO - add borders (outset) to expensive donos (as perks) */}
                
                {cachedSubmissions.map((entry, index) => {
                  return (
                    <div className='card-wrapper' onClick={() => {}}>
                      {showCardsInsteadOfPictures?
                        <SubmissionPreviewer 
                        key={index}
                        allowUpload={false}
                        imageRef={entry.imageRef}
                        displayName={entry.displayName}
                        displayAvatar={entry.displayAvatar}
                        username={entry.username}
                        postText={entry.postText}
                        denom='$'
                        selectedDonationAmount={entry.amount} 
                        fontSize={[20, 14, 30, 14]}
                        textPanelWidth={[240, 240]}
                        textPanelHeight={[240, 240]}
                        avatarSize={40}
                        padding={0}
                        topStyle={{width: '100%', display: 'block'}}
                        bgColor={entry.bgColor}
                        amountColor='rgb(216, 181, 8)' /> :

                        <img 
                        src={entry.imageRef}
                        alt='submission'
                        className='width-100 display-block rounded-10px' />
                      }
                    </div>
                  );
                })}
              </Masonry>
            </ResponsiveMasonry>
          </div>

        </div>

        {/*<div className='explore-page-right'>
          {focusedEntry?
          <SubmissionPreviewer 
          allowUpload={false}
          imageRef={focusedEntry.imageRef}
          displayName={focusedEntry.displayName}
          displayAvatar={focusedEntry.displayAvatar}
          username={focusedEntry.username}
          postText={focusedEntry.postText}
          denom='$'
          selectedDonationAmount={focusedEntry.amount} 
          imgSize={[550, 750]}
          fontSize={[36, 24, 48]}
          textPanelWidth={[400, 400]}
          textPanelHeight={[300, 300]}
          dir='column'
          padding={20}
          amountColor='rgb(216, 181, 8)' /> :
          
          <div className='explore-page-right-message'>
            {focusedMessage || <LoadingBox />}
          </div>
        }
      </div>*/}

    </div>
  );
};

export default ExplorePage;