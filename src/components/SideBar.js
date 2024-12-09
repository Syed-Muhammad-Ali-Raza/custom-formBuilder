import React from 'react';
import data from './data.json';

const SideBar = ({ onDragStart }) => {
  return (
    <div style={{ backgroundColor: 'grey', padding: '10px', width: '200px' }}>
      {data.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => onDragStart(e, item)}
          style={{
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '5px',
            cursor: 'grab',
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default SideBar;
