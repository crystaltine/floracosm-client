import React from 'react';
import '../styles/general/Sidebar.css';

const SidebarItem = ({ name, href, active, onClick }) => {
  return (
    <div 
    onClick={() => {onClick(); window.location.href = href}}
    className={`sidebar-item ${active? 'si-selected' : null}`}>
      {name}
    </div>
  );
};

export default SidebarItem;