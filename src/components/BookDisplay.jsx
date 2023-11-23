import React from 'react';
import '../styles/explore/BookStyles.css'
import BookPage from './BookPage';
import PageControls from './PageControls';

const BookDisplay = (props) => {

  return (
    <div className='book-display'>

      <PageControls 
      numPages={props.numPages} 
      currentPage={props.currentPage} 
      setCurrentPage={props.setCurrentPage} 
      sortBy={props.sortBy} 
      setSortBy={props.setSortBy}
      onRefresh={props.onRefresh}
      onRandomPage={props.onRandomPage} />

      <BookPage contents={props.contents}/>
      
    </div>
  );
};

export default BookDisplay;