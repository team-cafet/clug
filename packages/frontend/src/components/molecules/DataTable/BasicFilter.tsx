import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

export const BasicFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}: any) => {
  const count = preFilteredRows.length;

  return (
    <InputGroup className="mb-3">
      <InputGroup.Append>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji*/}
        <InputGroup.Text>🔎</InputGroup.Text>
      </InputGroup.Append>
      <FormControl
        value={filterValue || ''}
        onChange={(e) => {
          // Set undefined to remove the filter entirely
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    </InputGroup>
  );
};
