import React from 'react';
import '../styles/general/Sidebar.css';
import SidebarItem from './SidebarItem';

/**
 * `outerclassList`: space-separated STRING of classes to add to the outermost div
 * 
 * `sections`:
 * ```
 *   [
 *     {display (string), sectionID (in the DOM),
 *     {display (string), sectionID (in the DOM),
 *     ...
 *   ]
 * ```
 */
const Sidebar = ({outerClassList, outerStyle, innerClassList, innerStyle, sections}) => {

  const sidebarRef = React.useRef(null);

  const [currentlyScrolledTo, setCurrentlyScrolledTo] = React.useState(sections[0].sectionID);

  React.useEffect(() => {
    const handleScroll = () => {

      const sectionScrollYs = [];
      sections.forEach(element => {
        const sectionElement = document.getElementById(element.sectionID);
        const sectionScrollY = sectionElement.getBoundingClientRect().y;
        sectionScrollYs.push(sectionScrollY);
      });

      // set the selected index to the index of first section that is not above the top of the viewport
      let selectedIndex = 0;
      for (let i = 0; i < sectionScrollYs.length; i++) {
        if (sectionScrollYs[i] > 0) {
          selectedIndex = i;
          break;
        }
      }

      setCurrentlyScrolledTo(sections[selectedIndex].sectionID);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  return (
    <div className={`sidebar ${outerClassList}`} style={outerStyle} ref={sidebarRef}>

      <div className="sidebar-header">
        Sections
      </div>

      <div className={`sidebar-inner ${innerClassList}`} style={innerStyle}>

        {sections.map((section, idx) => {
          return (
            <SidebarItem
              key={section.display}
              active={currentlyScrolledTo === section.sectionID}
              name={section.display}
              onClick={() => {setCurrentlyScrolledTo(section.sectionID)}}
              href={`#${section.sectionID}`} />
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
