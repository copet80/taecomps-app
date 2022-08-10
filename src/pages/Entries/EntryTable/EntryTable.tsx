import React, { FormEvent, memo, useMemo, useState } from 'react';

import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch,
} from '@carbon/react';

import { Entry, TableHeaderData } from '../../../types';

type Props = {
  entries: Entry[];
  onCreateClick: () => void;
};

const headers: TableHeaderData[] = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'club',
    header: 'Club',
  },
  {
    key: 'belt',
    header: 'Belt',
  },
  {
    key: 'age',
    header: 'Age',
  },
  {
    key: 'weight',
    header: 'Weight',
  },
];

function EntryTable({ entries, onCreateClick }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const rows = useMemo(
    () =>
      entries.filter((entry) => entry.name.toLowerCase().includes(searchQuery)),
    [entries, searchQuery],
  );

  function handleSearchChange(event: FormEvent<HTMLInputElement>) {
    setSearchQuery(
      (event.target as HTMLInputElement).value.trim().toLowerCase(),
    );
  }

  return (
    <DataTable rows={rows} headers={headers} isSortable>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getToolbarProps,
        getTableContainerProps,
      }: any) => (
        <TableContainer
          title="Tournament Entries"
          description="Listing all tournament participants who have entered"
          {...getTableContainerProps()}>
          <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
            <TableToolbarContent>
              <TableToolbarSearch onChange={handleSearchChange} />
              <TableToolbarMenu light>
                <TableToolbarAction onClick={console.log}>
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction onClick={console.log}>
                  Action 2
                </TableToolbarAction>
                <TableToolbarAction onClick={console.log}>
                  Action 3
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={onCreateClick}>Create new</Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header: TableHeaderData) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any) => (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  {row.cells.map((cell: any) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
}

export default memo(EntryTable);
