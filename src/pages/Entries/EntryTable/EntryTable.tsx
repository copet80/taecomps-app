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
import {
  GenderMale as GenderMaleIcon,
  GenderFemale as GenderFemaleIcon,
} from '@carbon/icons-react';
import cx from 'classnames';

import './EntryTable.scss';

import {
  Entry,
  PaginationChangeParams,
  SortDirection,
  SortInfo,
  TableHeaderData,
} from '../../../types';
import { createSortEntry, formatDateTime } from '../../../utils';

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
    key: 'gender',
    header: 'Gender',
  },
  {
    key: 'createdAt',
    header: 'Entry date',
  },
];

const cellAlignments: Record<string, string> = {
  age: 'right',
  gender: 'center',
  weight: 'right',
};

function EntryTable({
  entries,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortInfo, setSortInfo] = useState<SortInfo>({
    headerKey: 'name',
    sortDirection: 'ASC',
  });
  const [pagination, setPagination] = useState<PaginationChangeParams>({
    page: 1,
    pageSize: 10,
  });

  const entriesById: Record<string, Entry> = useMemo(
    () => Object.fromEntries(entries.map((entry) => [entry.id, entry])),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => entry.name.toLowerCase().includes(searchQuery))
      .sort(createSortEntry(sortInfo));
  }, [entries, searchQuery, sortInfo]);

  const rows = useMemo(() => {
    const { page, pageSize } = pagination;
    return filteredEntries.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredEntries, pagination]);

  function handleSearchChange(event: FormEvent<HTMLInputElement>) {
    setSearchQuery(
      (event.target as HTMLInputElement).value.trim().toLowerCase(),
    );
  }

  function handlePaginationChange(params: PaginationChangeParams) {
    setPagination(params);
  }

  function handleChangeSort(headerKey: string) {
    const { sortDirection } = sortInfo;
    const oppositeSortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
    const newSortDirection =
      headerKey === sortInfo.headerKey ? oppositeSortDirection : sortDirection;
    setSortInfo({ headerKey, sortDirection: newSortDirection });
  }

  function renderCellValue(cell: any) {
    if (cell.info.header === 'createdAt') {
      return formatDateTime(cell.value);
    }
    if (cell.info.header === 'gender') {
      if (cell.value === 'Male') {
        return <GenderMaleIcon aria-label="Male" className="gender-male" />;
      }
      if (cell.value === 'Female') {
        return (
          <GenderFemaleIcon aria-label="Female" className="gender-female" />
        );
      }
      return '--';
    }
    return cell.value;
  }

  return (
    <div className="EntryTable">
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
                  {headers.map((header: TableHeaderData) => {
                    return (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({ header })}
                        className={cx(`align-${cellAlignments[header.key]}`)}
                        isSortHeader={sortInfo.headerKey === header.key}
                        sortDirection={sortInfo.sortDirection}
                        onClick={() => handleChangeSort(header.key)}>
                        {header.header}
                      </TableHeader>
                    );
                  })}
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell: any) => (
                      <TableCell
                        key={cell.id}
                        align={cellAlignments[cell.info.header]}
                        className={cx(
                          `align-${cellAlignments[cell.info.header]}`,
                        )}>
                        {renderCellValue(cell)}
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
      {filteredEntries.length > 10 && (
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
          totalItems={filteredEntries.length}
          onChange={handlePaginationChange}
        />
      )}
    </div>
  );
}

export default memo(EntryTable);
