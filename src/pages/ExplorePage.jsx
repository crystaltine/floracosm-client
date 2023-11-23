import React from 'react';
import '../styles/explore/ExplorePage.css'
import '../styles/general/prebuilt.css'
import MenuBar from '../components/MenuBar';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import SubmissionThumbnail from '../components/SubmissionThumbnail';
import ExploreSideview from '../components/ExploreSideview';
import { LoadingBox } from '../components/LoadingBox';
import ErrorBox from '../components/ErrorBox';
import ExploreControls from '../components/ExploreControls';

export const TILE_SIZE = 100; // px side len of each square on the explore grid
export const EXPLORE_PADDING = 1000; // px padding around the explore grid

const currYear = new Date().getFullYear();

const calcFillColor = (r, c) => {	
	// If row + col is odd, light square
	const isLight = (r + c) % 2 === 1
	return isLight? '#ffffff09' : '#ffffff03'
}

const ExplorePage = () => {

	document.title = 'CanvasEarth | Floracosm';

	const sideviewRef = React.useRef(null);

	const urlParams = new URLSearchParams(window.location.search);
	const requestedFocus = urlParams.get('focus');
	const requestedYear = parseInt(urlParams.get('year'));

  const [cachedSubmissions, setCachedSubmissions] = React.useState(null);
	const [selectedSubmissionID, setSelectedSubmissionID] = React.useState(requestedFocus);

	const [canvasSize, setCanvasSize] = React.useState(null) // Side length in 100px units, obtained from initial fetch
	const [loadingSubmissions, setLoadingSubmissions] = React.useState(true);
	const [message, setMessage] = React.useState(null); // used for error while fetching

	const [currPanZoom, setCurrPanZoom] = React.useState(null); // used for info about curr zoom
	const fullSize = (window.screen.height - 60) / ((canvasSize || 21) * TILE_SIZE) * 0.75;

	React.useEffect(() => {
		// If neither are specified, just use current year
		if (!requestedYear && !requestedFocus) {
			window.location.href = `/canvasearth?year=${new Date().getFullYear()}`;
		}

		// If year specified, but its invalid (<2023 or >currYear), just use current year
		if (requestedYear && (requestedYear < 2023 || requestedYear > currYear)) {
			window.location.href = `/canvasearth?year=${new Date().getFullYear()}`;
		}

		// If requestedFocus is specified but no year, fetch submission first, then determine year and redirect
		if (requestedFocus && !requestedYear) {
			fetch(`https://floracosm-server.azurewebsites.net/year-of?intentID=${requestedFocus}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})
			.then(res => {
				if (res.status !== 200) {
					return
				}
				return res.json();
			})
			.then(data => {
				if (!data) {
					// Just try current year, sidebar will yell at them if it doesn't exist
					window.location.href = `/canvasearth?year=${new Date().getFullYear()}&focus=${requestedFocus}`;
					return;
				}

				const { year } = data;
				window.location.href = `/canvasearth?year=${year}&focus=${requestedFocus}`;
			})
			.catch(err => {
				// Just try current year, idk what happened
				window.location.href = `/canvasearth?year=${new Date().getFullYear()}&focus=${requestedFocus}`;
			});
		}
	}, [requestedFocus, requestedYear]);

  const fetchSubmissions = React.useCallback((year = null) => {

		year = year || requestedYear || currYear;

		if (year < 2023 || year > currYear) {
			year = currYear;
		}

		setCachedSubmissions(null);
		setLoadingSubmissions(true);
		setMessage(null);

    fetch(`https://floracosm-server.azurewebsites.net/get-contributions?year=${year}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		.then(res => res.json())
		.then(data => {

			if (!data.success) {
				setMessage(data.message)
				setLoadingSubmissions(false);
				return;
			}

			setLoadingSubmissions(false);
			setMessage(null);
			setCachedSubmissions(data.submissions)
			setCanvasSize(data.canvasSize)
		})
		.catch(err => {
			setLoadingSubmissions(false);
			setMessage('An error occured, likely because the server is down. Hopefully it gets fixed soon!');
		});
  }, [requestedYear]);

	React.useEffect(() => fetchSubmissions(requestedYear), [fetchSubmissions, requestedYear]);
	
  return (
    <div className='generic-page-body'>

      <MenuBar selected='CanvasEarth' />

      {((cachedSubmissions !== null) && requestedYear)?
				<div className='explore-page-content'>

					<ExploreSideview 
					visible={selectedSubmissionID !== null} 
					innerRef={sideviewRef}
					submissionData={cachedSubmissions.find(submission => submission.entry.intentID === selectedSubmissionID)}
					closeSideview={() => setSelectedSubmissionID(null)} />

					<div className='explore-page-pannable'>

						<div className='ep-year-container'>

							Year: 

							<button 
							disabled={requestedYear <= 2023}
							className={`ec-button ${requestedYear <= 2023? 'ec-btn-disabled' : ''}`}
							onClick={() => window.location.href = `/canvasearth?year=${requestedYear - 1}`}>
								<img className='ec-btn-icon' src={require('../assets/icons/caret_left.png')} alt='l' />
							</button>

							<h3>{requestedYear}</h3>

							<button 
							disabled={requestedYear >= currYear}
							className={`ec-button ${requestedYear >= currYear? 'ec-btn-disabled' : ''}`}
							onClick={() => window.location.href = `/canvasearth?year=${requestedYear + 1}`}>
								<img className='ec-btn-icon' src={require('../assets/icons/caret_right.png')} alt='r' />
							</button>

						</div>

						<TransformWrapper
						panning={{ velocityDisabled: true }}
						doubleClick={{ disabled: true }}
						minScale={fullSize}
						onTransformed={(_, newState) => setCurrPanZoom(newState.scale)}
						maxScale={3}
						initialScale={fullSize}
						centerOnInit={true}
						centerZoomedOut={true}>

							{({ zoomIn, zoomOut, centerView, }) => (

								<div className='position-relative'>

									<ExploreControls 
									zoomIn={() => zoomIn(0.2, 100, 'easeInOutCubic')}
									zoomOut={() => zoomOut(0.2, 100, 'easeInOutCubic')}
									currZoom={currPanZoom}
									canvasSize={canvasSize}
									hide={
										// Only be hidden if sideview is open and coming from the bottom
										// That happens when @media screen and (max-width: 1000px) and (min-height: 800px) {
										selectedSubmissionID !== null && window.screen.width <= 1000 && window.screen.height >= 800
									}
									resetToCenter={() => centerView(fullSize, 200, 'easeInOutCubic')}
									refresh={() => fetchSubmissions()} />

									<TransformComponent 
									contentClass='pan-content' 
									contentStyle={{padding: EXPLORE_PADDING}}
									wrapperClass='pan-wrapper'>
										<div 
										style={{width: canvasSize*TILE_SIZE, height: canvasSize*TILE_SIZE}}>

											{cachedSubmissions.map((submission, index) => {
												return (
													<SubmissionThumbnail
													key={index}
													canvasSize={canvasSize}
													position={[submission.entry.x + EXPLORE_PADDING/TILE_SIZE, submission.entry.y + EXPLORE_PADDING/TILE_SIZE]} // add padding cuz offset
													size={submission.entry.size}
													imageRef={submission.entry.imageRef}
													intentID={submission.entry.intentID}
													submission={submission}
													openDetailedView={() => setSelectedSubmissionID(submission.entry.intentID)} />
												)})
											}

											<svg // adding 4 to size here for a bit of padding
											style={{width: canvasSize*TILE_SIZE, height: canvasSize*TILE_SIZE}}
											className='exp-grid-overlay'>
											{Array.from({length: canvasSize}, (_, c) => {
												return Array.from({length: canvasSize}, (_, r) => {
													return (
														<rect
														key={`${r}-${c}`}
														x={c * TILE_SIZE}
														y={r * TILE_SIZE}
														width={TILE_SIZE}
														height={TILE_SIZE}
														fill={calcFillColor(r, c, canvasSize)} />
													);
												});
											})}
											</svg>

										</div>
									</TransformComponent>

								</div>

							)}

						</TransformWrapper>
					</div>

      	</div> :

				// Loading or error
				<div className='explore-page-content flex-column'>
					{ loadingSubmissions && <LoadingBox outerStyle={{margin: 'auto'}} /> }
					{message && 
						<ErrorBox
						message={message} 
						onRetry={fetchSubmissions}
						style={{margin: 'auto'}} />}
				</div>
			}

    </div>
  );
};

export default ExplorePage;