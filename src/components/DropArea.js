import React from 'react';
import styles from './DropArea.module.css';

const DropArea = ({ rows, onDragOver, onDropColumn, onFieldDrop, onFieldUpdate }) => {
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
        <div
          key={rowIndex}
          className={styles['row']}
        >
          {row.columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={styles['column']}
              onDragOver={onDragOver}
              onDrop={(e) => onFieldDrop(e, rowIndex, columnIndex)}
            >
              {column.fields.map((field, fieldIndex) => (
                <div
                  key={fieldIndex}
                  className={styles['field']}
                >
                  <div className={styles['field-label']}>
                    <label>Label:</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'label')
                      }
                    />
                  </div>
                  <div className={styles['field-value']}>
                    <label>Value:</label>
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'value')
                      }
                    />
                  </div>
                  {field.type === 'dropdown' || field.type === 'radio' ? (
                    <div className={styles['field-options']}>
                      <label>Options:</label>
                      {field.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={styles['option']}>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              onFieldUpdate(
                                rowIndex,
                                columnIndex,
                                fieldIndex,
                                'options',
                                (prevOptions) =>
                                  prevOptions.map((opt, idx) =>
                                    idx === optionIndex ? e.target.value : opt
                                  )
                              )
                            }
                          />
                          <button
                            className={styles['remove-button']}
                            onClick={() =>
                              handleRemoveOption(rowIndex, columnIndex, fieldIndex, optionIndex)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        className={styles['add-option-button']}
                        onClick={() => handleAddOption(rowIndex, columnIndex, fieldIndex)}
                      >
                        Add Option
                      </button>
                    </div>
                  ) : null}
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
