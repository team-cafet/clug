import React, { useMemo } from 'react';
import {
  useTable,
  Column,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { Table, Pagination } from 'react-bootstrap';
import { BasicFilter } from './BasicFilter';

interface IProps {
  data: any[];
  columns: Column[];
}

export interface IDataTableColumns {}

export const DataTable = (props: IProps) => {
  const data = useMemo(() => props.data, [props.data]);
  const columns = useMemo(() => props.columns, [props.columns]);

  const filterTypes = React.useMemo(
    () => ({
      text: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: BasicFilter,
    }),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 20 },
    } as any,
    useFilters,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    page,
    pageCount,
    gotoPage,
    prepareRow,
    state: { pageIndex, pageSize },
  } = tableInstance as any;

  return (
    <>
      <Table striped bordered hover size="sm" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()}>
                  <div {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </div>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <DataTablePagination
        pageCount={pageCount}
        current={pageIndex}
        gotoPage={gotoPage}
      />
    </>
  );
};

const DataTablePagination = (props: {
  pageCount: number;
  current: number;
  gotoPage: (pageIndex: any) => void;
}) => {
  const active = props.current;
  const items = [];
  for (let number = 1; number <= props.pageCount; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number - 1 === active}
        onClick={() => props.gotoPage(number - 1)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      {active - 1 >= 0 && (
        <Pagination.Prev onClick={() => props.gotoPage(active - 1)} />
      )}
      {items}
      {active + 1 < props.pageCount && (
        <Pagination.Next onClick={() => props.gotoPage(active + 1)} />
      )}
    </Pagination>
  );
};
