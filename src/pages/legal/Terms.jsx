import React from 'react';
import Footer from '../../components/Footer';
import MenuBar from '../../components/MenuBar';
import Sidebar from '../../components/Sidebar';
import '../../styles/about/Legal.css';
import { setTabInfo } from '../../utils';

const sections = require('../../static/terms_sections.json');

const Terms = () => {

	React.useEffect(() => {
		setTabInfo('Terms | Floracosm');
	}, []);

  return (
    <div className='generic-page-body-expandable'>

			<MenuBar selected='About' />

			<div className='legal-page-body'>

				<Sidebar outerClassList='legal-sidebar' innerClassList='legal-sidebar-inner' sections={sections} />

				<div 
				dangerouslySetInnerHTML={{
					__html: `<a class='display-block font-size-16px' href='/home'>&larr; Home</a>` + require('../../static/terms.json').content
				}} />

			</div>

			<Footer />

		</div>
  );
};

export default Terms;