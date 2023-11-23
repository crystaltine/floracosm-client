import React from 'react';
import '../../styles/spotlight/UploadScroller.css';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

/**
 * @param {*} mime file mimeType for example, 'image/png'
 * @returns [broad type, file format], e.g. ['Image', 'png'] (returns sentence case broad type for display purposes)
 */
const mediaTypeFromMime = (mime) => {
	const broadType = mime.split('/')[0];
	const fileFormat = mime.split('/')[1];

	const broadTypeSentenceCase = broadType.charAt(0).toUpperCase() + broadType.slice(1);
	return [broadTypeSentenceCase, fileFormat];
}

const UploadScroller = ({
	userUploads, selectedIndex, setSelectedIndex,
	outerHeight = '100%', fontSizes = [14, 12],
	columnsCountBreakPoints={700: 1, 1100: 2, 1500: 3, 2000: 4}}) => {

  return (
		<div className='upload-scroller-container' style={{maxHeight: outerHeight}}>
			<ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
				<Masonry gutter='10px'>
					{userUploads.map((upload, index) => {
						return (
							<div 
							key={upload.url}
							onClick={setSelectedIndex? () => setSelectedIndex(index) : undefined}
							className={`sl-upload-container ${index === selectedIndex? 'sl-upload-selected' : ''}`}>
								{upload.type.mime.includes('image')?
									<img className='sl-uploaded-media' src={upload.url} alt='Spotlight Upload' /> :

									<video className='sl-uploaded-media' src={upload.url} title='Spotlight Upload' height='100%' width='100%' controls>
										<source src={upload.url} type="video/mp4" />
									</video>
								}

								<div 
								className='sl-uploaded-media-details' 
								style={{
									padding: `${0.35*fontSizes[0]}px ${0.7*fontSizes[0]}px`,
									gap: `${0.35*fontSizes[0]}px`,
								}}>
									<span className='text-ellipsis width-100' style={{fontSize: fontSizes[0]}}>
										{upload.fileName || "Unnamed File"}
									</span>
									<span className='text-ellipsis text-right width-100' style={{fontSize: fontSizes[1]}}>
										Type: <b>{mediaTypeFromMime(upload.type.mime).join(" - ")}</b>
									</span>
								</div>

							</div>
						)
					})}
				</Masonry>
			</ResponsiveMasonry>
		</div>
  );
};

export default UploadScroller;