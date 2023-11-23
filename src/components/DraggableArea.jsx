const DraggableArea = ({ containerRef, position, setPosition, zoom, setZoom, children }) => {
  return (
    <div
		ref={containerRef}
    style={{
			minWidth: 2000,
			minHeight: 2000,
			backgroundColor: '#fff8',
			transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
		}}>
      <div className='image-400px blue' />
			<div className='image-100px red' />
			<div className='image-100px green' />
    </div>
  );
};

export default DraggableArea;
