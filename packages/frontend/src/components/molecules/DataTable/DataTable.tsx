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
import { useFilterTypes } from './UseFilterTypes';
import './table.scss';
import {ReactComponent as SortArrows} from '../../../assets/sort-arrows.svg';
import {ReactComponent as SortIcon} from '../../../assets/sort-down.svg';

interface IProps {
  id?: string;
  className?: string;
  pageSize?: number;
  data: any[];
  columns: Column[];
  customRowProps?: (row: any) => any;
}

export interface IDataTableColumns {}

export const DataTable = (props: IProps) => {
  const data = useMemo(() => props.data, [props.data]);
  const columns = useMemo(() => props.columns, [props.columns]);

  const filterTypes = useFilterTypes();

  const defaultColumn = React.useMemo(
    () => ({
      // Add a basic text filter to all column that haven't disable filtering
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
      initialState: { pageIndex: 0, pageSize: props.pageSize || 20 },
    } as any,
    useFilters,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    pageCount,
    gotoPage,
    prepareRow,
    state: { pageIndex },
  } = tableInstance as any;

  return (
    <>
      <Table id={props.id} className={props.className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()}>
                  <FilterHeader column={column}/>
                  <SortingHeader column={column} />
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            const customRowProps = props.customRowProps
              ? props.customRowProps(row)
              : {};

            return (
              <tr {...row.getRowProps(customRowProps)}>
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

const SortingHeader = ({ column }: { column: any }) => (
  <div className="sortable"
    {...column.getSortByToggleProps()}>
    {column.render('Header')}
    <span>{column.isSorted ? (column.isSortedDesc ? <SortIcon className="down"/> : <SortIcon className="up"/>) : <SortArrows className="sorting"/>}</span>
  </div>
);

const FilterHeader = ({ column }: { column: any }) => (
  <div>{column.canFilter ? column.render('Filter') : null}</div>
);
