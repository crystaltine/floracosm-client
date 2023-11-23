import React from 'react';
import '../styles/general/Footer.css'

const Footer = () => {

  return (
		<div className='reduce-margin-top'>
			<div className='footer-body'>
				
				<div className='footer-logo-container'>
					<img src={require('../assets/logo_v6_square.png')} alt='logo' className='footer-logo-img' />
					Floracosm
				</div>

				<div className='footer-links-container'>

					<div className='footer-column'>
						<h6 className='footer-column-title'>Links</h6>
						<a href='/' className='footer-link'>Home</a>
						<a href='/contribute' className='footer-link'>Donate</a>
						<a href='/canvasearth' className='footer-link'>CanvasEarth</a>
						<a href='/spotlight' className='footer-link'>Spotlight</a>
						<a href='/predictions' className='footer-link'>Predictions</a>
						<a href='/account' className='footer-link'>Your Account</a>
					</div>

					<div className='footer-column'>
						<h6 className='footer-column-title'>Organization</h6>
						<a href='/about' className='footer-link'>About Us</a>
						<a href='/about#contact' className='footer-link'>Contact</a>
						<a href='/about#faq' className='footer-link'>FAQ</a>
					</div>

					<div className='footer-column'>
					<h6 className='footer-column-title'>Legal Stuff</h6>
						<a href='/about/terms' className='footer-link'>Terms of Use</a>
						<a href='/about/privacy' className='footer-link'>Privacy Policy</a>
						<a href='/about/rules' className='footer-link'>Community Guidelines</a>
					</div>

				</div>

			</div>
			
			<div className='footer-copyright'>
				&#169; 2023 Floracosm by&nbsp;<a className='link' href='https://github.com/crystaltine' target='_blank' rel="noopener noreferrer">crystaltine</a>
			</div>
		</div>
  );
};

export default Footer;