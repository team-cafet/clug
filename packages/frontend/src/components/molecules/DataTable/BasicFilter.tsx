import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import {ReactComponent as SearchIcon} from '../../../assets/search.svg';

export const BasicFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}: any) => {
  return (
    <InputGroup className="mb-3">
      <FormControl
        value={filterValue || ''}
        onChange={(e) => {
          // Set undefined to remove the filter entirely
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Rechercher...`}
      />
      <SearchIcon />
    </InputGroup>
  );
};
