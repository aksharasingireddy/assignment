import { useState } from 'react';
import './App.css'

const App = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('string');
  const [filterValue, setFilterValue] = useState('');
  const [filterColumn, setFilterColumn] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Add new column
  const handleAddColumn = () => {
    if (newColumnName && newColumnType) {
      setColumns([...columns, { name: newColumnName, type: newColumnType }]);
      setNewColumnName('');
    }
  };

  // Add a new row
  const handleAddRow = () => {
    const newRow = columns.reduce((row, col) => {
      row[col.name] = col.type === 'number' ? [] : [];
      return row;
    }, {});
    setRows([...rows, newRow]);
  };

  // Update cell data
  const handleCellChange = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value.split(',').map(item => item.trim());
    setRows(updatedRows);
  };

  // Filter rows based on column data
  const handleFilter = () => {
    if (filterValue && filterColumn) {
      return rows.filter(row =>
        row[filterColumn].includes(filterValue)
      );
    }
    return rows;
  };

  // Sort rows based on a column
  const handleSort = (rows) => {
    if (!sortColumn) return rows;

    const sortedRows = [...rows];
    if (columns.find(col => col.name === sortColumn)?.type === 'number') {
      sortedRows.sort((a, b) => {
        const aValue = parseFloat(a[sortColumn]) || 0;
        const bValue = parseFloat(b[sortColumn]) || 0;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }
    return sortedRows;
  };

  // Render filtered and sorted rows
  const renderRows = handleSort(handleFilter());

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Dynamic Table Management</h1>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Column</h3>
        <input
          className="border p-2 rounded mr-2"
          type="text"
          placeholder="Column Name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        <select
          className="border p-2 rounded mr-2"
          value={newColumnType}
          onChange={(e) => setNewColumnType(e.target.value)}
        >
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleAddColumn}
        >
          Add Column
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Row</h3>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={handleAddRow}
        >
          Add Row
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Filter</h3>
        <select
          className="border p-2 rounded mr-2"
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
        >
          <option value="">Select Column</option>
          {columns.map((col, index) => (
            <option key={index} value={col.name}>
              {col.name}
            </option>
          ))}
        </select>
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Filter Value"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Sort</h3>
        <select
          className="border p-2 rounded mr-2"
          value={sortColumn}
          onChange={(e) => setSortColumn(e.target.value)}
        >
          <option value="">Select Column</option>
          {columns.filter(col => col.type === 'number').map((col, index) => (
            <option key={index} value={col.name}>
              {col.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col, index) => (
              <th key={index} className="border px-4 py-2">{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderRows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="border px-4 py-2">
                  <input
                    className="w-full border p-2 rounded"
                    type="text"
                    value={row[col.name].join(', ')}
                    onChange={(e) => handleCellChange(rowIndex, col.name, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
