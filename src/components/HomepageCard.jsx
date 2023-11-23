import React from 'react';
import '../styles/home/HomepageCard.css';

const images = {
	"Sustainability": require('../assets/homepage/sustainability_card.jpeg'),
	"Research": require('../assets/homepage/research_card.jpg'),
	"Involvement": require('../assets/homepage/involvement_card.jpg'),
}

const icons = {
	"Sustainability": require('../assets/homepage/sustainability_icon.png'),
	"Research": require('../assets/homepage/research_icon.png'),
	"Involvement": require('../assets/homepage/involvement_icon.png'),
}

const colorClasses = {
	"red": "--vcard-red",
	"gold": "--vcard-gold",
	"magenta": "--vcard-magenta",
}

const selectedClasses = {
	"red": "--vcard-selected-red",
	"gold": "--vcard-selected-gold",
	"magenta": "--vcard-selected-magenta",
}

const HomepageCard = ({ onClick, title, subtitle, color, grow}) => {
  return (
    <div
		onClick={onClick}
		className={`homepage-value-card ${colorClasses[color]} ${grow? selectedClasses[color] : ''}`}>
			
			<div className='homepage-card-img-container'>
				<img src={images[title]} alt='card-top' className='homepage-card-img' />
			</div>
			
			<div className='homepage-value-card-text'>
				<h1 className='homepage-card-title'>
					<img src={icons[title]} alt='icon' className='homepage-card-icon' />
					{title}
				</h1>
				<h3 className='homepage-card-subtitle'>{subtitle}</h3>
			</div>

		</div>
  );
};

export default HomepageCard;