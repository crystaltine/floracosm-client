import React from 'react';
import '../styles/general/CenteredPopup.css'

export const CenteredPopup = (props) => {
  return (
    <div id='popup-backdrop' className='centered-popup-backdrop' style={{display: props.visible? 'block' : 'none'}}>
			<div className='popup-body-container'>
				<div className='popup-body'>

					<div className='popup-header'>
						{props.titleHTML? props.titleHTML : props.title}
					</div>

					<div className='popup-content'>
						{props.contentHTML? props.contentHTML : props.content}
					</div>

					<button onClick={props.onClose} className='button-medium button-primary cp-fontsizer width-100'>
						{props.closeButtonText? props.closeButtonText : "Close"}
					</button>

				</div>
			</div>
    </div>
  );
};

/**
 * Requires: 
 * onClose: () => void
 * visible: boolean
 * 
 * Optional:
 * bodyStyle: object
 */
export const Popup = (props) => {
  return (
    <div 
		onMouseDown={(e) => { if (e.target.id === 'popup-backdrop') props.onClose() }}
		id='popup-backdrop' 
		className='centered-popup-backdrop' 
		style={{display: props.visible? 'block' : 'none'}}>

			<div className='popup-body-container'>
				<div className='popup-body text-black' style={props.bodyStyle}>
					{props.children}
				</div>
			</div>

		</div>
	)
}

/**
 * Requires: 
 * 
 * onClose: () => void
 * 
 * visible: boolean
 * 
 * title: string
 * 
 * Optional:
 * 
 * bodyStyle: object
 * 
 * children: (nested elements)
 * 
 * zIndex: number (z-index of entire popup)
 */
export const HeaderedPopup = ({
	onClose, visible, title, children,
	bodyStyle = {}, contentStyle = {},
	zIndex = 50, closeButton = false}) => {
  return (
    <div 
		onMouseDown={(e) => {if (e.target.id === 'popup-clicktoclose') onClose()}}
		id='popup-backdrop' 
		className='centered-popup-backdrop' 
		style={{display: visible? 'block' : 'none', zIndex: zIndex}}>

			<div className='popup-body-container height-100' id='popup-clicktoclose'>
				<div className='hpopup-body' style={bodyStyle}>

					<div className='hpopup-header'>
						<span className='hpopup-header-title'>{title}</span>
						<button className='hpopup-header-close-button' onClick={onClose}>
							<img src={require('../assets/icons/close.png')} className='hpopup-header-close-icon' alt='[X]' />
						</button>
					</div>

					<div className='hpopup-content' style={contentStyle}>
						{children}
						{closeButton &&
							<button className='button-medium button-primary cp-fontsizer margin-top-10px width-100' onClick={onClose}>
								Close
							</button>}
					</div>
				</div>
			</div>

		</div>
	)
}
