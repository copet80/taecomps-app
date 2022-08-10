import React, { FormEvent, memo, useMemo, useState } from 'react';

import {
  Button,
  DataTable,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from '@carbon/react';

import { Entry, PaginationChangeParams, TableHeaderData } from '../../../types';
import { formatDateTime } from '../../../utils';

type Props = {
  entries: Entry[];
  onCreateClick: () => void;
  onEditClick: (entry: Entry) => void;
  onDeleteClick: (entry: Entry) => void;
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
  {
    key: 'createdAt',
    header: 'Entry date',
  },
];

function EntryTable({
  entries,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationChangeParams>({
    page: 1,
    pageSize: 10,
  });

  const entriesById: Record<string, Entry> = useMemo(
    () => Object.fromEntries(entries.map((entry) => [entry.id, entry])),
    [entries],
  );

  const rows = useMemo(() => {
    const { page, pageSize } = pagination;
    return entries
      .filter((entry) => entry.name.toLowerCase().includes(searchQuery))
      .slice((page - 1) * pageSize, page * pageSize);
  }, [entries, searchQuery, pagination]);

  function handleSearchChange(event: FormEvent<HTMLInputElement>) {
    setSearchQuery(
      (event.target as HTMLInputElement).value.trim().toLowerCase(),
    );
  }

  function handlePaginationChange(params: PaginationChangeParams) {
    setPagination(params);
  }

  return (
    <>
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
            <TableToolbar
              {...getToolbarProps()}
              aria-label="data table toolbar">
              <TableToolbarContent>
                <TableToolbarSearch onChange={handleSearchChange} />
                <Button onClick={onCreateClick}>Create new</Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header: TableHeaderData) => (
                    <TableHeader
                      key={header.key}
                      {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell: any) => (
                      <TableCell key={cell.id}>
                        {cell.info.header === 'createdAt'
                          ? formatDateTime(cell.value)
                          : cell.value}
                      </TableCell>
                    ))}
                    <TableCell className="cds--table-column-menu">
                      <OverflowMenu size="sm" light flipped>
                        <OverflowMenuItem
                          itemText="Edit"
                          onClick={() => onEditClick(entriesById[row.id])}
                        />
                        <OverflowMenuItem
                          itemText="Delete"
                          isDelete
                          onClick={() => onDeleteClick(entriesById[row.id])}
                        />
                      </OverflowMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      {entries.length > 10 && (
        <Pagination
          backwardText="Previous page"
          forwardText="Next page"
          itemsPerPageText="Entries per page:"
          pageNumberText="Page Number"
          itemRangeText={(min: number, max: number, total: number) =>
            `${min}–${max} of ${total} entries`
          }
          page={pagination.page}
          pageSize={pagination.pageSize}
          pageSizes={[10, 25, 50, 75, 100]}
          totalItems={entries.length}
          onChange={handlePaginationChange}
        />
      )}
    </>
  );
}

export default memo(EntryTable);
