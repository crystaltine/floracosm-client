import React from 'react';
import '../styles/general/SubmissionPreviewer.css';
import { LoadingBox } from './LoadingBox';
import { API } from '../utils';

/**
 * `onUploadError: (type, title, message) => void`
 */
const ImageUploadArea = ({ imageRef, updateImageRef, allowUpload, imgSize, border, borderRadius, onUploadError }) => {

  const uploadImage = React.useCallback((e) => {

    if (!allowUpload) return;

    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.match(/\.(png|jpg|jpeg)$/)) {
      onUploadError("invalid-type", "Invalid File Type", "The only file types that can be submitted are .jpg, .jpeg, and .png.");
      e.target.files = null;
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    fetch(API('/upload'), {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then((data) => {

      if (!data.success) {
        onUploadError("upload-error", "Upload Error", data.message);
        return;
      }

      const img_url = data.img_url;
      updateImageRef(img_url);
    }).catch(err => {
      onUploadError("upload-error", "Upload Error", "An error occurred while uploading your image. Try again in a bit!");
    });
  }, [allowUpload, onUploadError, updateImageRef]);

  const dropRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const [hoveringImage, setHoveringImage] = React.useState(false);

  const handleDrop = React.useCallback((e) => {
    if (!allowUpload) return;

    e.preventDefault();
    setHoveringImage(false);
    
    uploadImage(e);
  }, [allowUpload, uploadImage]);

  React.useEffect(() => {
    if (!allowUpload) return

    const dropArea = dropRef.current;
    dropArea.addEventListener('dragover', () => { setHoveringImage(true) });
    ['dragleave', 'dragend'].forEach(eType => dropArea.addEventListener(eType, () => { setHoveringImage(false) }));
    document.addEventListener('drop', (e) => { e.preventDefault(); setHoveringImage(false) })
    window.addEventListener('drop', (e) => { e.preventDefault(); setHoveringImage(false) })


    return () => {
      dropArea.removeEventListener('dragover', () => { setHoveringImage(true) });
      ['dragleave', 'dragend'].forEach(eType => dropArea.removeEventListener(eType, () => { setHoveringImage(false) }));
      dropArea.removeEventListener('drop', (e) => handleDrop(e));  
    }
  }, [allowUpload, handleDrop]);

  return (
    <div 
    style={{width: imgSize[0], maxHeight: imgSize[1], border: border, borderRadius: borderRadius}}
    onDrop={(e) => handleDrop(e)}
    className={`submission-preview-upload-area${hoveringImage? ' hovering-image' : ''}`} 
    ref={dropRef}>

      {imageRef? 
        <img 
        src={imageRef} 
        alt='upload' 
        style={{borderRadius: borderRadius, width: imgSize[0], maxHeight: imgSize[1]}}
        className='submission-preview-img' /> :
        <div style={{borderRadius: borderRadius, width: imgSize[0], maxHeight: imgSize[1]}} className='submission-preview-img'>
          <LoadingBox />
        </div>}

      {allowUpload && 
      <input 
      onChange={(e) => { uploadImage(e) }}
      onDrop={(e) => handleDrop(e)} 
      type='file'
      name='upload' 
      className='upload-input-element' 
      ref={inputRef} />}

    </div>
  );
};

export default ImageUploadArea;