import React from 'react';
import '../styles/contribute/ContributeLocationSelector.css';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import SubmissionThumbnail from './SubmissionThumbnail';
import { TILE_SIZE } from '../pages/ExplorePage';
import ErrorBox from './ErrorBox';
import { LoadingBox } from './LoadingBox';
import { API, convertToCenterCoords, convertToTopLeftCoords, squareOutOfBounds, squaresOverlap } from '../utils';

/**
 * Basically an emulation of the Explore page, which allows users to select squares on the grid to place their submission
 * @param {Number} previewSize The side length of the image to be submitted (defines side len of hover)
 * @param {[Number, Number]} selectedPos The currently selected position to highlight
 * @param {(Number, Number) => void} onSelectPos Callback function to be called when a position is selected
 * @returns 
 */
const ContributeLocationSelector = ({ previewSize, selectedPos, onSelectPos }) => {

	const gridRef = React.useRef(null);

  const [cachedSubmissions, setCachedSubmissions] = React.useState(null);

	const [canvasSize, setCanvasSize] = React.useState(null) // Side length in 100px units, obtained from initial fetch
	const [loadingSubmissions, setLoadingSubmissions] = React.useState(true);
	const [message, setMessage] = React.useState(null); // used for error while fetching

	function fetchSubmissions() {
		setLoadingSubmissions(true);
		setMessage(null);
		fetch(API('/get-contributions'))
		.then(res => {

			if (res.status !== 200) {
				setMessage('An error occured on our end... We\'re working on it!');
				setLoadingSubmissions(false);
				return;
			}

			return res.json();
		})
		.then(data => {
			if (!data) return;

			setLoadingSubmissions(false);
			setMessage(null);
			setCachedSubmissions(data.submissions)
			setCanvasSize(data.canvasSize)
		})
		.catch(err => {
			setLoadingSubmissions(false);
			setMessage('An error occured, likely because the server is down. Hopefully it gets fixed soon!');
		});
	}

  React.useEffect(fetchSubmissions, []);

	/** Stores top-left based indices */
	const [hoveredCellRange, setHoveredCellRange] = React.useState(null); // format [startRow, startCol, size]
	const [hoverIsObstructed, setHoverIsObstructed] = React.useState(false); // format [startRow, startCol, size]
	const [currPanZoom, setCurrPanZoom] = React.useState(1); // scale 1 means each cell is 100px

	const calcFillColor = React.useCallback((r, c) => {
		// If row + col is odd, light square
		const isLight = (r + c) % 2 === 1
		return isLight? '#ffffff09' : '#ffffff03'
	}, []);

	const isSelectionObstructed = React.useCallback(() => {
		if (!hoveredCellRange) return false;

		if (squareOutOfBounds(
			{x: hoveredCellRange[1], y: hoveredCellRange[0], size: previewSize},
			canvasSize)) return true;
		
		for (const submission of cachedSubmissions) {
			const topLeftCoords = convertToTopLeftCoords(submission.entry.x, submission.entry.y, canvasSize);
			if (squaresOverlap(
				{x: topLeftCoords[0], y: topLeftCoords[1], size: submission.entry.size},
				{x: hoveredCellRange[1], y: hoveredCellRange[0], size: previewSize}
			)) return true;
		}

		return false;

	}, [hoveredCellRange, previewSize, canvasSize, cachedSubmissions]);

	React.useEffect(() => {
		if (!hoveredCellRange) return;
		setHoverIsObstructed(isSelectionObstructed());
	}, [hoveredCellRange, isSelectionObstructed]);

	const handleMouseMove = (e) => {

    // Set the hovered cell based on the mouse position
		const rect = gridRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const col = Math.floor(x / (TILE_SIZE * currPanZoom));
		const row = Math.floor(y / (TILE_SIZE * currPanZoom));

		const halfSize = Math.floor((previewSize - 1) / 2);
		setHoveredCellRange([row - halfSize, col - halfSize, previewSize]);
  };

	const handleClick = (e) => {
		if (!hoveredCellRange || hoverIsObstructed) return;

		const [x, y] = convertToCenterCoords(hoveredCellRange[1], hoveredCellRange[0], canvasSize);

		onSelectPos(x, y, previewSize, !hoverIsObstructed);
	}

	// Max zoom out for transform wrapper
	const fullSize = (window.screen.height - 60) / ((canvasSize || 21) * TILE_SIZE) * 0.75;

  return (
    <div className='locsel-container'>
			{
				(cachedSubmissions !== null)?

				<TransformWrapper
				panning={{ velocityDisabled: true }}
				doubleClick={{ disabled: true }}
				minScale={fullSize}
				maxScale={3}
				initialScale={fullSize}
				onTransformed={(_, newState) => setCurrPanZoom(newState.scale)}
				centerOnInit={true}
				centerZoomedOut={true}>

					<TransformComponent contentClass='locsel-pan-content' wrapperClass='locsel-pan-wrapper'>

						<div
						style={{width: canvasSize*TILE_SIZE, height: canvasSize*TILE_SIZE}} 
						className='locsel-thumbnails-container'>
							{cachedSubmissions.map((submission, index) => {
								return (
									<SubmissionThumbnail
									key={index}
									position={[submission.entry.x, submission.entry.y]}
									size={submission.entry.size}
									canvasSize={canvasSize}
									submission={submission}
									imageRef={submission.entry.imageRef}
									intentID={submission.entry.intentID} />
								)})
							}

							{/* Overlay for grid */}
							<svg 
							className='grid-overlay z-index-3' 
							style={{width: canvasSize*TILE_SIZE, height: canvasSize*TILE_SIZE}}
							onClick={handleClick}
							onTouchStart={handleClick}
							onMouseLeave={() => setHoveredCellRange(null)}
							onMouseMove={handleMouseMove} 
							ref={gridRef}>
							{Array.from({length: canvasSize}, (_, c) => {
								return Array.from({length: canvasSize}, (_, r) => {
									return (
										<rect
										key={`${r}-${c}`}
										x={c * TILE_SIZE}
										y={r * TILE_SIZE}
										width={TILE_SIZE}
										height={TILE_SIZE}
										fill={calcFillColor(r, c)} />
									);
								});
							})}
							</svg>

							{/* Overlay for hover/selected */}
							<svg 
							className='grid-overlay z-index-2' 
							style={{width: canvasSize*TILE_SIZE, height: canvasSize*TILE_SIZE}}>

								<rect // hover area
								display={hoveredCellRange? 'block' : 'none'}
								x={hoveredCellRange? hoveredCellRange[1] * TILE_SIZE : 0}
								y={hoveredCellRange? hoveredCellRange[0] * TILE_SIZE : 0}
								width={previewSize * TILE_SIZE}
								height={previewSize * TILE_SIZE}
								fill={hoverIsObstructed? '#ff000020' : '#5dfe1820'}
								strokeWidth={TILE_SIZE / 20}
								stroke={hoverIsObstructed? '#ff0000bf' : '#5dfe18bf'} />

								<rect // selected area
								display={((typeof selectedPos[0] === 'number') && (typeof selectedPos[1] === 'number'))? 'block' : 'none'}
								x={selectedPos? (selectedPos[0] + Math.floor((canvasSize - 1) / 2)) * TILE_SIZE : 0}
								y={selectedPos? (selectedPos[1] + Math.floor((canvasSize - 1) / 2)) * TILE_SIZE : 0}
								width={previewSize * TILE_SIZE}
								height={previewSize * TILE_SIZE}
								fill='#198cff20'
								strokeWidth={TILE_SIZE / 20}
								stroke='#198cffef' />

							</svg>

						</div>

					</TransformComponent>

				</TransformWrapper> :

				// Loading or error
				<div className='explore-page-content'>
					{ loadingSubmissions && <LoadingBox outerStyle={{margin: 'auto'}} /> }
					{ 
						message && 
						<ErrorBox
						message={message} 
						onRetry={fetchSubmissions}
						style={{margin: 'auto'}} /> 
					}
				</div>
			}
    </div>
  );
};

export default ContributeLocationSelector;