import React, { } from 'react';

export const BasicFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}: any) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        // Set undefined to remove the filter entirely
        setFilter(e.target.value || undefined); 
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};
