import React from 'react';
import { ACTION_COLUMN_KEYS } from '../constants';
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
  Tag,
  Tooltip,
  TableContainer
} from '@carbon/react';
import { Information, RecentlyViewed, CheckmarkFilled, Delete, CloseFilled } from '@carbon/icons-react';

const ActivityDataTableComponent = ({
  rows = [],
  headers,
  sortDirection,
  totalRows,
  pageNumber,
  pageSize,
  handlePaginationChange,
  onCellActionClick,
  handleHeaderClick,
  handleVersion,
  showDrawer = false
}) => {

  // Generate action items based on the activity status
  const renderActionItem = (status, id, versionKey) => {
    switch (status) {
      case 'DRAFT':
        return (
          <Button kind="tertiary" size='sm' className={showDrawer ? 'action-item-drawer' : 'action-item'} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.MARK_AS_FINAL, id, versionKey)}>
            {ACTION_COLUMN_KEYS.MARK_AS_FINAL}
          </Button >
        );
      case 'FINAL':
        return (
          <Button kind="tertiary" size='sm' className={showDrawer ? 'action-item-drawer' : 'action-item'} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.ROLLOUT, id)}>
            {ACTION_COLUMN_KEYS.ROLLOUT}
          </Button>
        );
      case 'DELETE':
        return (
          <Button kind="tertiary" size='sm' className={`${showDrawer ? 'action-item-drawer' : 'action-item'} action-item-delete`} >
            {ACTION_COLUMN_KEYS.RESTORE}
          </Button>
        );
      default:
        return null;
    }
  };

  // Generate the ellipsis menu for each row
  const renderEllipsisMenu = (id, status = "") => {
    return (
      <OverflowMenu size="sm" flipped className="always-visible-overflow-menu">
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.VIEW} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.VIEW, id)} />
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.EDIT} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.EDIT, id)} />
        {!showDrawer ? (
          <>
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.EXPORT_ACTIVITY} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.EXPORT_ACTIVITY, id)} />
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.TEST_ACTIVITY} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.TEST_ACTIVITY, id)} />
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.CLONE_ACTIVITY} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.CLONE_ACTIVITY, id)} />
          </>
        ) : (
          <>
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.EXPORT_VERSION} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.EXPORT_VERSION, id)} />
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.MARK_AS_DEFAULT} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.MARK_AS_DEFAULT, id)} />
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.TEST_VERSION} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.TEST_VERSION, id)} />
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.CLONE_VERSION} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.CLONE_VERSION, id)} />
          </>
        )}
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.SHARE_UNSHARE} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.SHARE_UNSHARE, id)} />
        {status !== 'DELETE' && (
          <OverflowMenuItem hasDivider itemText={
            <>
              <span>{ACTION_COLUMN_KEYS.DELETE} </span>
              <Delete className='overflow-menu-icon' />
            </>
          } className='overflow-option-delete' onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.DELETE, id)} />
        )}
      </OverflowMenu>
    );
  }

  // Render information icon and text
  const renderInformation = (value, description = "") => (
    <div className='information-wrapper'>
      {description !== '' ? <Tooltip align="bottom" label={description}>
        <Information className='information-icon' />
      </Tooltip> : null}
      <span className='information-text'>{value}</span>
    </div>
  );

  // Capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  // Render status tag
  const renderTag = (status) => {
    const formattedStatus = capitalizeFirstLetter(status);
    return (
      <Tag type={status === 'draft' ? 'cool-gray' : status === 'final' ? 'green' : 'red'}>
        {formattedStatus}
      </Tag>
    );
  };

  // Render recently viewed icon and text
  const renderRecentlyViewed = (value = '""', id, activityName = '', status = '', description = '') => (
    <div>
      {showDrawer ?
        <div className='information-wrapper'>
          {description !== '' ? <Tooltip align="bottom" label={description}>
            <Information className='information-icon' />
          </Tooltip> : null}
          <span className='information-text'>{`Ver. ${value}`}</span>
        </div>
        : <div className='recently-view-wrapper' onClick={() => handleVersion(id, activityName, status)}>
          <span className='recently-view-text'>{`Ver. ${value}`}</span>
          <RecentlyViewed />
        </div>
      }
    </div>
  );

  // Render checkmark icon and text for encryption status
  const renderCheckmarkFilled = (encryptedvalue = "") => (
    <div>
      <span className='encrypted-wrapper'>
        {encryptedvalue ? (
          <>
            <CheckmarkFilled className='checkmark-filled-encrypted' /> <span className="encrypted-wrapper-text">Yes</span>
          </>
        ) : (
          <>
            <CloseFilled className='close-filled-encrypted' /><span className="encrypted-wrapper-text">No</span>
          </>
        )}
      </span>
    </div>
  );

  return (
    <>
      <TableContainer>
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
                      isSortable={header.key !== 'ellipsis' && header.key !== 'description' && header.key !== 'action' && header.key !== 'activityDefnVersionKey'}
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
                  rows.map((row) => {
                    const versionKeyCell = row.cells.find(cell => cell.id === `${row.id}:activityDefnVersionKey`);
                    const statusCell = row.cells.find(cell => cell.id === `${row.id}:status`);
                    const activityName = row.cells.find(cell => cell.id === `${row.id}:name`)
                    const description = row.cells.find(cell => cell.id === `${row.id}:description`)
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'action' ? renderActionItem(statusCell.value, row.id, versionKeyCell.value) :
                              cell.info.header === 'ellipsis' ? renderEllipsisMenu(row.id, statusCell.value) :
                                cell.info.header === 'status' ? renderTag(cell.value.toLowerCase()) :
                                  cell.info.header === 'name' ? renderInformation(cell.value, description?.value) :
                                    cell.info.header === 'version' ? renderRecentlyViewed(cell.value, row.id, activityName?.value, statusCell?.value, description?.value) :
                                      cell.info.header === 'isEncrypted' ? renderCheckmarkFilled(cell.value) :
                                        null}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
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
      </TableContainer>
    </>
  );
}

export default ActivityDataTableComponent;