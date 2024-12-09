import React, { useState } from 'react';
import styles from './DropArea.module.css';
import { FaTrashAlt, FaCog } from 'react-icons/fa';

const DropArea = ({ rows, onDragOver, onDropColumn, onFieldDrop, onFieldUpdate }) => {
  const [editLabelIndex, setEditLabelIndex] = useState(null);
  const [editPlaceholderIndex, setEditPlaceholderIndex] = useState(null);

  const handleInputChange = (e, rowIndex, columnIndex, fieldIndex, key) => {
    const value = e.target.value;
    onFieldUpdate(rowIndex, columnIndex, fieldIndex, key, value);
  };

  const handleAddOption = (rowIndex, columnIndex, fieldIndex) => {
    onFieldUpdate(rowIndex, columnIndex, fieldIndex, 'options', (prevOptions) => [
      ...prevOptions,
      `Option ${prevOptions.length + 1}`,
    ]);
  };

  const handleRemoveOption = (rowIndex, columnIndex, fieldIndex, optionIndex) => {
    onFieldUpdate(rowIndex, columnIndex, fieldIndex, 'options', (prevOptions) =>
      prevOptions.filter((_, idx) => idx !== optionIndex)
    );
  };

  return (
    <div
      className={styles['drop-area']}
      onDragOver={onDragOver}
      onDrop={onDropColumn}
    >
      <h2>Drop Area</h2>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles['row']}>
          {row.columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={styles['column']}
              onDragOver={onDragOver}
              onDrop={(e) => onFieldDrop(e, rowIndex, columnIndex)}
            >
              {column.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className={styles['field']}>
                  {['text', 'email', 'textarea'].includes(field.type) && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {editLabelIndex === fieldIndex ? (
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'label')}
                          onBlur={() => setEditLabelIndex(null)}
                          style={{ marginBottom: '10px', flex: 1 }}
                        />
                      ) : (
                        <label onClick={() => setEditLabelIndex(fieldIndex)} className="tooltip">
                          <span className="formFieldLabel">{field.label}</span>
                        </label>
                      )}
                      <FaTrashAlt
                        onClick={() => {
                          const updatedFields = column.fields.filter((_, i) => i !== fieldIndex);
                          onFieldUpdate(rowIndex, columnIndex, 'fields', updatedFields);
                        }}
                        style={{ cursor: 'pointer', color: '#FF5733' }}
                      />
                    </div>
                  )}

                  {field.type === 'dropdown' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <select
                        value={field.value}
                        onChange={(e) => handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'value')}
                        style={{ marginBottom: '10px', padding: '8px', flex: 1 }}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {field.options.map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <div>
                        {field.options.map((option, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleInputChange(e, rowIndex, columnIndex, fieldIndex, i)}
                              style={{ marginRight: '5px', flex: 1 }}
                            />
                            <FaTrashAlt
                              onClick={() => handleRemoveOption(rowIndex, columnIndex, fieldIndex, i)}
                              style={{ cursor: 'pointer', color: '#FF5733' }}
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddOption(rowIndex, columnIndex, fieldIndex)}
                          style={{
                            marginTop: '5px',
                            padding: '5px',
                            background: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  {field.type === 'radio' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {field.options.map((option, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="radio"
                            name={`radio-${rowIndex}-${columnIndex}-${fieldIndex}`}
                            value={option}
                            checked={field.value === option}
                            onChange={(e) => handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'value')}
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddOption(rowIndex, columnIndex, fieldIndex)}
                        style={{
                          marginTop: '5px',
                          padding: '5px',
                          background: '#007BFF',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DropArea;
