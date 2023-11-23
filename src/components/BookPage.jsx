import React from 'react';
import '../styles/explore/BookStyles.css'
import SubmissionPreviewer from '../components/SubmissionPreviewer.jsx';

const BookPage = (props) => {
  return (
    <div className='book-page'>
      {props.contents.map((entry, index) => {
        return (
          <SubmissionPreviewer 
            key={index}
            allowUpload={false}
            imageRef={entry.imageRef}
            displayName={entry.displayName}
            postText={entry.postText}
            denom='$'
            selectedDonationAmount={entry.amount} 
            imgSize={[200, 200]}
            fontSize={[25, 10, 40]}
            textPanelWidth={[200, 200]}
            textPanelHeight={[200, 200]}
            amountColor='rgb(216, 181, 8)' />
        );
      })}
    </div>
  );
};

export default BookPage;