import React from 'react';
import { ROUTES, ACTION_COLUMN_KEYS } from '../constants';
import {
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Pagination,
  OverflowMenuItem,
  OverflowMenu,
  Tag
} from '@carbon/react';
import { Information, RecentlyViewed, CheckmarkFilled, Delete } from '@carbon/icons-react';

const DataTableComponent = ({
  rows = [],
  headers,
  status,
  sortDirection,
  totalRows,
  pageNumber,
  pageSize,
  handlePaginationChange,
  handleEdit,
  handleDelete,
  handleActionChange,
  handleHeaderClick
}) => {

  // Generate action items based on the activity status
  const renderActionItem = (status, id) => {
    if (status === 'DRAFT' || status === '') {
      return (
        <Button kind="tertiary" size='sm' className='action-item' onClick={() => handleActionChange(ACTION_COLUMN_KEYS.MARK_AS_FINAL, id)}>
          {ACTION_COLUMN_KEYS.MARK_AS_FINAL}
        </Button>
      );
    } else if (status === 'FINAL') {
      return (
        <Button kind="tertiary" size='sm' className='action-item' onClick={() => handleActionChange(ACTION_COLUMN_KEYS.ROLLOUT, id)}>
          {ACTION_COLUMN_KEYS.ROLLOUT}
        </Button>
      );
    } else if (status === 'DELETE') {
      return (
        <Button kind="tertiary" size='sm' className='action-item action-item-delete'>
          Restore
        </Button>
      );
    }
  };

  // Generate the ellipsis menu for each row
  const renderEllipsisMenu = (id) => {
    return (
      <OverflowMenu size="sm" flipped className="always-visible-overflow-menu">
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.VIEW} />
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.EDIT} onClick={() => handleEdit(id)} href={ROUTES.ACTIVITY_EDIT + id} />
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.EXPORT_ACTIVITY} />
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.TEST_ACTIVITY} onClick={() => handleActionChange(ACTION_COLUMN_KEYS.TEST, id)} />
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.CLONE_ACTIVITY} />
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.SHARE_UNSHARE} />
        <OverflowMenuItem hasDivider itemText={
          <>
            <span>{ACTION_COLUMN_KEYS.DELETE} </span>
            <Delete className='overflow-menu-icon' />
          </>
        }
          className='overflow-option-delete' onClick={() => handleDelete(id)} />
      </OverflowMenu>
    );
  };

  // Render information icon and text
  const renderInformation = (value) => {
    return (
      <div>
        <Information className='information-icon' />
        <span className='information-text'>{value}</span>
      </div>
    );
  };

  // Render status tag
  const renderTag = (value) => {
    let status = value === "" ? 'draft' : value;
    return (
      <Tag type={status === 'draft' ? 'cool-gray' : status === 'final' ? 'green' : 'red'}>
        {status}
      </Tag>
    );
  };

  // Render recently viewed icon and text
  const renderRecentlyViewed = (value = "") => {
    return (
      <div>
        <span>{value}</span>
        <RecentlyViewed />
      </div>
    );
  };

  // Render checkmark icon and text for encryption status
  const renderCheckmarkFilled = (value = "") => {
    return (
      <div>
        <CheckmarkFilled className='checkmark-filled-encrypted' />
        <span>{value}</span>
      </div>
    );
  };

  return (
    <>
      {/* Data Table */}
      <DataTable rows={rows} headers={headers} isSortable>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader
                    key={header.key}
                    {...getHeaderProps({ header })}
                    isSortable={header.key !== 'ellipsis' && header.key !== 'action'}
                    sortDirection={sortDirection}
                    onClick={() => handleHeaderClick(header.key)}
                  >
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.info.header === 'action' ? renderActionItem(status, row.id) :
                          cell.info.header === 'ellipsis' ? renderEllipsisMenu(row.id) :
                            cell.info.header === 'status' ? renderTag(status.toLowerCase()) :
                              cell.info.header === 'name' ? renderInformation(cell.value) :
                                cell.info.header === 'version' ? renderRecentlyViewed(cell.value) :
                                  cell.info.header === 'encrypted' ? renderCheckmarkFilled(cell.value) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} className="no-records-message">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DataTable>
      {/* Pagination controls */}
      <Pagination
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Items per page:"
        totalItems={totalRows !== undefined ? totalRows : 0}
        pageSize={pageSize}
        pageSizes={[5, 10, 20, 50]}
        page={pageNumber}
        onChange={({ page, pageSize }) => handlePaginationChange(page, pageSize)}
      />
    </>
  );
}

export default DataTableComponent;