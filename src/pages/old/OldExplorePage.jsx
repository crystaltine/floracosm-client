import React from 'react';
import '../styles/OldExplorePage.css'
import '../styles/general/prebuilt.css'
import MenuBar from '../../components/MenuBar';
import BookDisplay from '../../components/BookDisplay';

const ExplorePage = (props) => {

  const [cachedSubmissions, setCachedSubmissions] = React.useState([]);
  // This is the DEFINITION of idfk what this does but its the only thing that works
  const [rerenderState, setRerenderState] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState('recent');

  function getEntriesAtPage(pageNum) {
    // 4 Per page
    if (!cachedSubmissions) return [];
    console.log("Getting entries at page " + pageNum)
    console.log("They are:")
    cachedSubmissions.slice((pageNum-1)*4, Math.min(pageNum*4, cachedSubmissions.length)).forEach((entry) => {
      console.log("[toplvl] ENTRY: " + JSON.stringify([entry.displayName, entry.amount, entry.timestamp]));
    });
    return cachedSubmissions.slice((pageNum-1)*4, Math.min(pageNum*4, cachedSubmissions.length));
  }

  function refreshSubmissions() {
    fetch('http://localhost:3999/get-contributions')
      .then(res => res.json())
      .then(data => {
        setCachedSubmissions(data.submissions.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }));
      })
      .catch(err => console.log(err));
  }
  function randomPage() {
    setCurrentPage(Math.floor(Math.random() * Math.ceil(cachedSubmissions.length/4)) + 1);
  }


  React.useEffect(() => {
    fetch('http://localhost:3999/get-contributions')
      .then(res => res.json())
      .then(data => {
        setCachedSubmissions(data.submissions.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }));
      })
      .catch(err => console.log(err));
  }, []);

  React.useEffect(() => {
    if (sortBy === 'recent') {
      setCachedSubmissions(cachedSubmissions.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }));
    } else if (sortBy === 'amount') {
      setCachedSubmissions(cachedSubmissions.sort((a, b) => {
        return b.amount - a.amount;
      }));
    }
    setCurrentPage(1);
    setRerenderState(() => !rerenderState);
  }, [sortBy, cachedSubmissions]); // don't include rerenderState or it also seems to break. idk why

  return (
    <div className='generic-page-body'>
      <MenuBar selected='Explore' />
      <div className='live-page-content'>

        <button className='explore-pagenav-button' onClick={() => setCurrentPage(1)}>
          <img className='explore-pagenav-button-img' src={require('../assets/icons/caret_left_to_end.png')} alt='back-far' />
        </button>
        <button className='explore-pagenav-button' onClick={() => setCurrentPage(Math.max(1, currentPage-1))}>
          <img className='explore-pagenav-button-img' src={require('../assets/icons/caret_left_one.png')} alt='back-far' />
        </button>

        <BookDisplay 
        contents={getEntriesAtPage(currentPage)} 
        numPages={Math.ceil(cachedSubmissions.length/4)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sortBy={sortBy}
        setSortBy={setSortBy} 
        onRefresh={refreshSubmissions}
        onRandomPage={randomPage} />

        <button className='explore-pagenav-button' onClick={() => setCurrentPage(Math.min(Math.ceil(cachedSubmissions.length/4), currentPage+1))}>
          <img className='explore-pagenav-button-img --r180' src={require('../assets/icons/caret_left_one.png')} alt='back-far' />
        </button>
        
        <button className='explore-pagenav-button' onClick={() => setCurrentPage(Math.ceil(cachedSubmissions.length/4))}>
          <img className='explore-pagenav-button-img --r180' src={require('../assets/icons/caret_left_to_end.png')} alt='back-far' />
        </button>
      
      </div>
    </div>
  );
};

export default ExplorePage;