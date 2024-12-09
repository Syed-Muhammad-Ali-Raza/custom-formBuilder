import React, { useState } from 'react';
import SideBar from './SideBar';
import DropArea from './DropArea';
import './Layout.css'; // Import the CSS file

function DragDropLayout() {
  const [draggedItem, setDraggedItem] = useState(null);
  const [rows, setRows] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropColumn = (e) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type.startsWith('column')) {
      const newRow = {
        columns: Array.from({ length: draggedItem.columns }, () => ({
          fields: [],
        })),
      };
      setRows((prevRows) => [...prevRows, newRow]);
      setDraggedItem(null);
    }
  };

  const handleFieldDrop = (e, rowIndex, columnIndex) => {
    e.preventDefault();
    if (draggedItem && !draggedItem.type.startsWith('column')) {
      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[rowIndex].columns[columnIndex].fields.push({
          ...draggedItem,
          options: draggedItem.options || [],
        });
        return newRows;
      });
      setDraggedItem(null);
    }
  };

  const handleFieldUpdate = (rowIndex, columnIndex, fieldIndex, key, value) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const field = newRows[rowIndex].columns[columnIndex].fields[fieldIndex];

      if (typeof value === 'function') {
        field[key] = value(field[key]);
      } else {
        field[key] = value;
      }

      return newRows;
    });
  };

  const saveLayout = () => {
    localStorage.setItem('dragDropLayout', JSON.stringify(rows));
    alert('Layout saved successfully!');
  };

  const togglePreview = () => {
    setShowPreview((prev) => !prev);
  };

  return (
    <div className="main-container">
      <div style={{ display: 'flex', gap: '20px' }}>
        <SideBar onDragStart={handleDragStart} />
        <DropArea
          rows={rows}
          onDragOver={handleDragOver}
          onDropColumn={handleDropColumn}
          onFieldDrop={handleFieldDrop}
          onFieldUpdate={handleFieldUpdate}
        />
      </div>
      <div className="button-group">
        <button onClick={togglePreview} className="button preview-button">
          {showPreview ? 'Close Preview' : 'Preview'}
        </button>
        <button onClick={saveLayout} className="button save-button">
          Save
        </button>
      </div>
      {showPreview && (
        <div className="preview-container">
          <h3 className="preview-header">Preview</h3>
          {rows.length === 0 ? (
            <p>No layout to preview</p>
          ) : (
            rows.map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {row.columns.map((column, columnIndex) => (
                  <div key={columnIndex} style={{ flex: 1, margin: '0 10px', padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
                    {column.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} style={{ marginBottom: '10px' }}>
                        <strong>{field.label || 'Untitled Field'}</strong>
                        {field.type === 'dropdown' || field.type === 'radio' ? (
                          <ul>
                            {field.options.map((option, optionIndex) => (
                              <li key={optionIndex}>{option}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{field.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default DragDropLayout;
