import React from 'react';
import '../styles/explore/PageControls.css'

const PageControls = (props) => {
  return (
    <div className='page-controls'>

      <div className='page-controls-pgnum'>
        Page 
        <input 
        className='page-control-number-input' 
        type='number'
        onChange={(e) => {
          props.setCurrentPage(Math.min(Math.max(1, e.target.value), props.numPages));
        }}
        value={props.currentPage} /> of {props.numPages}
      </div>

      <div className='page-controls-search'>
        <input className='page-control-search-bar' type='text' placeholder='Search...' />
        <button className='page-control-button'>Search</button>
      </div>

      <div className='page-controls-sortby'>
        Sort by:
        <select 
        onChange={(e) => {
          props.setSortBy(e.target.value);
        }}
        className='page-control-sortby-select'>
          <option value='recent'>Recent</option>
          <option value='amount'>Most Donated</option>
        </select>
      </div>

      <div className='page-control-buttons'>
        <button className='page-control-button' onClick={() => props.onRefresh()}>Refresh</button>
        <button className='page-control-button' onClick={() => props.onRandomPage()}>Random</button>
      </div>

    </div>
  );
};

export default PageControls;