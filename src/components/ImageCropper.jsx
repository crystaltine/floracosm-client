import React from 'react';
import Cropper from 'react-easy-crop';
import '../styles/general/ImageCropper.css';
import { LoadingBox } from './LoadingBox';
import { API } from '../utils';

function getCroppedImg(imageObj, croppedAreaPixels, callback) {
	var canvas = document.createElement("canvas");
	var context = canvas.getContext('2d');

	canvas.width = croppedAreaPixels.width;
	canvas.height = croppedAreaPixels.height;

	//console.log("Image URL: " + imageObj.src);
	imageObj.crossOrigin = "Anonymous";

	context.drawImage(imageObj, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);
	canvas.toBlob(blob => callback(blob), "image/png");
}

const ImageCropper = ({ onSave, onClose, onUploadError, imageRef }) => {

	const [crop, setCrop] = React.useState({ x: 0, y: 0 })
	const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null)
  const [zoom, setZoom] = React.useState(1)

	const [uploadLoading, setUploadLoading] = React.useState(false);

	const uploadCroppedImage = React.useCallback((imgFile) => {
		const formData = new FormData();
		formData.append("image", imgFile);
	
		// (Filename is determined randomly by server)
		fetch(API('/upload'), {
			method: 'POST',
			body: formData
		})
		.then(res => res.json())
		.then(data => {

			if (!data || data.error) {
				onUploadError(data.error);
				return;
			}

			// the upload was successful
			onSave(data.img_url)
			setUploadLoading(false);
			setZoom(1);
			setCrop({x: 0, y: 0});
		})
		.catch(err => { onUploadError("We couldn't contact the server. Try again in a bit!") })
	}, [onSave, onUploadError]);

	// Little hack since im too lazy to file a bug report for react-easy-crop
	// issue is that crop area size is broken and cannot pan all the way
	const [cropAspect, setCropAspect] = React.useState(1.001);
	React.useEffect(() => {
		setTimeout(() => { setCropAspect(1) }, 100);
	}, []);

	//console.log(`cropAspect: ${cropAspect}`)
	
  return (
		<div onMouseDown={onClose} className='image-cropper-popup-backdrop'>
			<div className='ic-popup-body-container'>

				<div onMouseDown={(e) => e.stopPropagation()} className='ic-popup-body'>
					<h3 className='margin-0px padding-0px'>Resize Image</h3>

						<div className='crop-supercontainer'>
							<div className='crop-container'>
							{ 
								cropAspect === 1.001? 
								
								<div className='centerer'>
									<LoadingBox outerStyle={{margin: "auto"}}/>
								</div> :
								
								<Cropper
									image={imageRef}
									crop={crop}
									zoom={zoom}
									maxZoom={5}
									zoomSpeed={0.25}
									cropShape="round"
									objectFit='cover'
									aspect={cropAspect}
									showGrid={false}
									onCropChange={setCrop}
									onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
									onZoomChange={setZoom}
									style={{ cropAreaStyle: {border: "3px solid white", }, }}
								/>
							}
							</div>
						</div>
					
					<input
						disabled={cropAspect === 1.001}
						type="range"
						value={zoom}
						min={1}
						max={5}
						step={0.02}
						aria-labelledby="Zoom"
						onChange={(e) => setZoom(e.target.value)}
						className="zoom-range"
					/>

					<div className='flex-row align-center justify-between flex-gap-20px'>
						<button
						onClick={onClose}
						className='button-secondary button-medium width-100'>
							Cancel
						</button>
						<button 
						disabled={cropAspect === 1.001 || uploadLoading}
						onClick={() => {
							setUploadLoading(true);
							const imgObj = new Image();
							imgObj.src = imageRef;

							// this is a fix for the image loading twice for some reason
							let hasLoadedOnce = false;
							imgObj.onload = () => {
								if (hasLoadedOnce) return;
								hasLoadedOnce = true;
								getCroppedImg(imgObj, croppedAreaPixels, (data) => uploadCroppedImage(data))
							}
						}}
						className='button-primary button-medium width-100'>
							{ uploadLoading? "Saving..." : "Save" }
						</button>
					</div>

				</div>

			</div>
		</div>
  );
};

export default ImageCropper;