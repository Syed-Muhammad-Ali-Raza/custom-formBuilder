import React from 'react';

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
      onDragOver={onDragOver}
      onDrop={onDropColumn}
      style={{
        flex: 1,
        minHeight: '400px',
        border: '2px dashed #ccc',
        padding: '20px',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2>Drop Area</h2>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#eaeaea',
            borderRadius: '5px',
          }}
        >
          {row.columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              onDragOver={onDragOver}
              onDrop={(e) => onFieldDrop(e, rowIndex, columnIndex)}
              style={{
                flex: 1,
                minHeight: '100px',
                margin: '0 10px',
                border: '1px dashed #000',
                padding: '10px',
                backgroundColor: '#fff',
              }}
            >
              {column.fields.map((field, fieldIndex) => (
                <div
                  key={fieldIndex}
                  style={{
                    margin: '10px 0',
                    padding: '10px',
                    backgroundColor: 'lightblue',
                    borderRadius: '5px',
                  }}
                >
                  <div>
                    <label>Label:</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        handleInputChange(e, rowIndex, columnIndex, fieldIndex, 'label')
                      }
                    />
                  </div>
                  <div>
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
                    <div>
                      <label>Options:</label>
                      {field.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
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
                            onClick={() =>
                              handleRemoveOption(rowIndex, columnIndex, fieldIndex, optionIndex)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button onClick={() => handleAddOption(rowIndex, columnIndex, fieldIndex)}>
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
