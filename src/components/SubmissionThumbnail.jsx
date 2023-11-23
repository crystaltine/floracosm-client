import React from 'react';
import ExploreHoverWidget from '../components/ExploreHoverWidget';
import '../styles/explore/SubmissionThumbnail.css';
import { TILE_SIZE } from '../pages/ExplorePage';

/**
 * A square thumbnail of various size to be tiled on the explore page. 
 * pos 0,0 means center of the canvas.
 * On click, it should open a detailed view of the submission.
 * 
 * @param {number} size - The side length in units of 100px (1-10)
 * @param {number} canvasSize - The num of tiles in side len of the entire canvas
 * @param {Array} position - [left, top] on the grid, in units of 100px
 * @param {string} imageRef - The URL of the image to display
 * @param {string} intentID - The intentID in order to fetch submission details from server
 * @param {(intentID: String) => void} openDetailedView - Should send a request to server to fetch submission details and open a detailed view
 * @param {() => void} onHover - function to call when the thumbnail is hovered over
 * @param {() => void} onStopHover - function to call when the thumbnail is no longer hovered over
 */
const SubmissionThumbnail = ({ submission, position, size, canvasSize, imageRef, intentID, openDetailedView }) => {

  /**
   * Calculates CSS left, top, width, height based on the position and size
   * Canvas is a cartesian plane with origin at the center.
   * position[0] is the x coord, position[1] is the y coord.
   * (0,0) is the center of the canvas.
   */
  const calculateCSSPositions = React.useCallback(() => {
    const left = ((canvasSize-1)/2 + position[0]) * TILE_SIZE;
    const top = ((canvasSize-1)/2 + position[1]) * TILE_SIZE;
    
    //console.log("left should be", left, "top should be", top)
    return { left, top, width: TILE_SIZE*size, height: TILE_SIZE*size };
  }, [position, size, canvasSize]);

  const [hovering, setHovering] = React.useState(false);

  return (
    <>
      <div 
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className='submission-thumbnail' 
      onClick={openDetailedView? (() => openDetailedView(intentID)) : null}
      style={{
      ...calculateCSSPositions(),
      backgroundImage: `url(${imageRef})`,}}>

        <ExploreHoverWidget
        sizeMultiplier={size}
        hidden={!hovering}
        info={{
          displayName: submission.entry.displayName,
          username: submission.profile?.username,
          avatarRef: submission.profile?.avatarRef,
          postText: submission.entry.postText,
          amount: submission.entry.amount,
          timestamp: submission.entry.timestamp}} />
      
      </div>

    </>
  );
};

export default SubmissionThumbnail;