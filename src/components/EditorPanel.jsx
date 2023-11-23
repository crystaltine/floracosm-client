import React from 'react';
import '../styles/contribute/EditorPanel.css';
import '../styles/contribute/ContributePage.css';

const frames = [
	{
		name: 'Gold 1',
		src: require('../assets/frames/gold_1.png'),
		type: 'gold',
	},
	{
		name: 'Gold 2',
		src: require('../assets/frames/gold_2.png'),
		type: 'gold',
	},
	{
		name: 'Gold 3',
		src: require('../assets/frames/gold_3.png'),
		type: 'gold',
	},
	{
		name: 'Gold 4',
		src: require('../assets/frames/gold_4.png'),
		type: 'gold',
	},
	{
		name: 'Gold 5',
		src: require('../assets/frames/gold_5.png'),
		type: 'gold',
	},
	{
		name: 'Planetary 1',
		src: require('../assets/frames/planetary_1.png'),
		type: 'planetary',
	},
	{
		name: 'Planetary 2',
		src: require('../assets/frames/planetary_2.png'),
		type: 'planetary',
	},
	{
		name: 'Planetary 3',
		src: require('../assets/frames/planetary_3.png'),
		type: 'planetary',
	},
	{
		name: 'Planetary 4',
		src: require('../assets/frames/planetary_4.png'),
		type: 'planetary',
	},
	{
		name: 'Planetary 5',
		src: require('../assets/frames/planetary_5.png'),
		type: 'planetary',
	},
	{
		name: 'Planetary 6',
		src: require('../assets/frames/planetary_6.png'),
		type: 'planetary',
	},
];

const EditorPanel = (props) => {
  return (
    <div className='editor-panel-content' ref={props.editorRef} style={{height: `${props.height}px`}}>
				
			<div className='minilabel'>Frame</div>
			<section className='editor-panel-section frames-container'>
				{frames.map((frame, idx) => {
					return (
						<div className='frame-preview-container'>
							<img className='frame-preview-img' src={frame.src} alt={frame.name} />
							{frame.name}
						</div>
					);
				})}
			</section>
			
			<div className='minilabel'>Effects</div>
			<section className='editor-panel-section'>
				E
			</section>

			<div className='minilabel'>Backgrounds</div>
			<section className='editor-panel-section'>
				B
			</section>

    </div>
  );
};

export default EditorPanel;