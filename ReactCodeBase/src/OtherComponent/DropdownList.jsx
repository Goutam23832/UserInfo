import React, { useState } from 'react';

const DropdownExample = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="p-4">
      <label htmlFor="roles" className="block mb-2 text-sm font-medium">
        Select Report type:
      </label>
      <select
        id="roles"
        value={selectedOption}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded"
      >
        <option value="">-- Choose Report type --</option>
        <option value="Excel">Excel</option>
        <option value="Word">Word</option>
        <option value="PDF">PDF</option>    
        <option value="Text">Text</option>
      </select>

      <p className="mt-3">You selected: {selectedOption}</p>
    </div>
  );
};

export default DropdownExample;
