import React, { useMemo } from 'react';
import {
  useTable,
  Column,
  useSortBy,
  useFilters,
  useGlobalFilter,
} from 'react-table';
import { Table } from 'react-bootstrap';

interface IProps {
  data: any[];
  columns: Column[];
}

export const DataTable = (props: IProps) => {
  const data = useMemo(() => props.data, [props.data]);
  const columns = useMemo(() => props.columns, [props.columns]);

  const tableInstance = useTable(
    { columns, data },
    useSortBy,
    useFilters,
    useGlobalFilter
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <Table striped bordered hover size="sm" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {rows.map((row: any) => {
          prepareRow(row);

          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
