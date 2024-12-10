import React, { useState } from 'react';
import styles from './DropArea.module.css';
import { FaTrashAlt, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const DropArea = ({ rows, onDragOver, onDropColumn, onFieldDrop, onFieldUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleInputChange = (e, rowIndex, columnIndex, fieldIndex, key, optionIndex = null) => {
    const value = e.target.value;
    if (key === 'options') {
      onFieldUpdate(rowIndex, columnIndex, fieldIndex, key, (prevOptions) => {
        const updatedOptions = [...prevOptions];
        if (optionIndex !== null) updatedOptions[optionIndex] = value;
        return updatedOptions;
      });
    } else {
      onFieldUpdate(rowIndex, columnIndex, fieldIndex, key, value);
    }
  };

  const handleRemoveField = (rowIndex, columnIndex, fieldIndex) => {
    const updatedColumns = rows[rowIndex].columns.map((column, colIdx) =>
      colIdx === columnIndex
        ? { ...column, fields: column.fields.filter((_, idx) => idx !== fieldIndex) }
        : column
    );
    onFieldUpdate(rowIndex, 'columns', updatedColumns);
  };

  const handleAddOption = (rowIndex, columnIndex, fieldIndex) => {
    onFieldUpdate(rowIndex, columnIndex, fieldIndex, 'options', (prevOptions) => [
      ...prevOptions,
      `New Option ${prevOptions.length + 1}`,
    ]);
  };

  const handleRemoveOption = (rowIndex, columnIndex, fieldIndex, optionIndex) => {
    onFieldUpdate(rowIndex, columnIndex, fieldIndex, 'options', (prevOptions) =>
      prevOptions.filter((_, idx) => idx !== optionIndex)
    );
  };

  const startEditing = (rowIndex, columnIndex, fieldIndex, key, currentValue, optionIndex = null) => {
    setEditingField({ rowIndex, columnIndex, fieldIndex, key, optionIndex });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField) {
      const { rowIndex, columnIndex, fieldIndex, key, optionIndex } = editingField;
      if (key === 'options') {
        handleInputChange({ target: { value: editValue } }, rowIndex, columnIndex, fieldIndex, key, optionIndex);
      } else {
        handleInputChange({ target: { value: editValue } }, rowIndex, columnIndex, fieldIndex, key);
      }
      setEditingField(null);
    }
  };

  const renderEditableContent = (content, rowIndex, columnIndex, fieldIndex, key, optionIndex = null) => {
    const isEditing =
      editingField &&
      editingField.rowIndex === rowIndex &&
      editingField.columnIndex === columnIndex &&
      editingField.fieldIndex === fieldIndex &&
      editingField.key === key &&
      editingField.optionIndex === optionIndex;

    return isEditing ? (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          style={{ flex: 1, marginRight: '5px' }}
        />
        <FaCheck onClick={saveEdit} style={{ cursor: 'pointer', color: 'green', marginRight: '5px' }} />
        <FaTimes onClick={() => setEditingField(null)} style={{ cursor: 'pointer', color: 'red', marginRight: '5px' }} />
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: 1 }}>{content}</span>
        <FaEdit
          onClick={() => startEditing(rowIndex, columnIndex, fieldIndex, key, content, optionIndex)}
          style={{ cursor: 'pointer', color: '#007BFF', marginLeft: '5px' }}
        />
      </div>
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
                  {renderEditableContent(field.label, rowIndex, columnIndex, fieldIndex, 'label')}
                
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={field.value || ''}
                      onChange={(e) => handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'value')}
                      placeholder={field.label}
                      style={{ marginTop: '5px' }}
                    />
                  )}

                  {field.type === 'email' && (
                    <input
                      type="email"
                      value={field.value || ''}
                      onChange={(e) => handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'value')}
                      placeholder={field.label}
                      style={{ marginTop: '5px' }}
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={field.value || ''}
                      onChange={(e) => handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'value')}
                      placeholder={field.label}
                      style={{ marginTop: '5px', height: '80px' }}
                    />
                  )}

                  {field.type === 'dropdown' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div>
                        {field.options.map((option, optionIndex) => (
                          <div key={optionIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            {renderEditableContent(option, rowIndex, columnIndex, fieldIndex, 'options', optionIndex)}
                            <FaTrashAlt
                              onClick={() => handleRemoveOption(rowIndex, columnIndex, fieldIndex, optionIndex)}
                              style={{ cursor: 'pointer', color: '#FF5733', marginLeft: '5px' }}
                            />
                          </div>
                        ))}
                        <button  className='dropdown-radio-btn'
                          onClick={() => handleAddOption(rowIndex, columnIndex, fieldIndex)}
                       
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  {field.type === 'radio' && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {field.options.map((option, optionIndex) => (
                        <div key={optionIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                          {renderEditableContent(option, rowIndex, columnIndex, fieldIndex, 'options', optionIndex)}
                          <FaTrashAlt
                            onClick={() => handleRemoveOption(rowIndex, columnIndex, fieldIndex, optionIndex)}
                            style={{ cursor: 'pointer', color: '#FF5733', marginLeft: '5px' }}
                          />
                        </div>
                      ))}
                     <button className='dropdown-radio-btn'
                          onClick={() => handleAddOption(rowIndex, columnIndex, fieldIndex)}
                         
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
