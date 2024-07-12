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
          <div className='tbody-wrapper'>
            <Button
              kind="tertiary"
              size="sm"
              className={showDrawer ? 'action-item-drawer' : 'action-item'}
              onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.MARK_AS_FINAL, id, versionKey)}
            >
              {ACTION_COLUMN_KEYS.MARK_AS_FINAL}
            </Button>
          </div>
        );
      case 'FINAL':
        return (
          <div className='tbody-wrapper'>
            <Button kind="tertiary" size="sm" className={showDrawer ? 'action-item-drawer' : 'action-item'} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.ROLLOUT, id)}>
              {ACTION_COLUMN_KEYS.ROLLOUT}
            </Button>
          </div>
        );
      case 'DELETE':
        return (
          <div className='tbody-wrapper'>
            <Button kind="tertiary" size="sm" className={`${showDrawer ? 'action-item-drawer' : 'action-item'} action-item-delete`}>
              {ACTION_COLUMN_KEYS.RESTORE}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  // Generate the ellipsis menu for each row
  const renderEllipsisMenu = (id, status = '', isDefault = false, versionName = '') => {
    return (
      <OverflowMenu size="sm" flipped className="always-visible-overflow-menu">
        <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.VIEW} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.VIEW, id)} />
        {status !== 'DELETE' && status !== 'FINAL' && <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.EDIT} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.EDIT, id)} />}
        {!showDrawer ? (
          <>
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.EXPORT_ACTIVITY} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.EXPORT_ACTIVITY, id)} />
            {status !== 'DELETE' && <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.TEST_ACTIVITY} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.TEST_ACTIVITY, id)} />}
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.CLONE_ACTIVITY} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.CLONE_ACTIVITY, id)} />
          </>
        ) : (
          <>
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.EXPORT_VERSION} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.EXPORT_VERSION, id)} />
            {!isDefault ? <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.MARK_AS_DEFAULT} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.MARK_AS_DEFAULT, id, versionName)} /> : null}
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.TEST_VERSION} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.TEST_VERSION, id)} />
            <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.CLONE_VERSION} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.CLONE_VERSION, id)} />
          </>
        )}
        {status !== 'DELETE' && <OverflowMenuItem itemText={ACTION_COLUMN_KEYS.SHARE_UNSHARE} onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.SHARE_UNSHARE, id)} />}
        {status !== 'DELETE' && (
          <OverflowMenuItem
            hasDivider
            itemText={
              <>
                <span>{ACTION_COLUMN_KEYS.DELETE} </span>
                <Delete className="overflow-menu-icon" />
              </>
            }
            className="overflow-option-delete"
            onClick={() => onCellActionClick(ACTION_COLUMN_KEYS.DELETE, id)}
          />
        )}
      </OverflowMenu>
    );
  };

  // Render information icon and text
  const renderInformation = (value, description = '') => (
    <div className="information-wrapper">
      {description !== '' ? (
        <Tooltip align="bottom" label={description}>
          <Information className="information-icon" />
        </Tooltip>
      ) : null}
      <span className="information-text">{value}</span>
    </div>
  );

  // Capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  // Render status tag
  const renderTag = (status) => {
    const formattedStatus = capitalizeFirstLetter(status);
    return (
      <div className='tbody-wrapper'>
        <Tag type={status === 'draft' ? 'cool-gray' : status === 'final' ? 'green' : 'red'}>{formattedStatus}</Tag>
      </div>
    )
  };

  // Render recently viewed icon and text
  const renderRecentlyViewed = (value = '', id, activityName = '', status = '', description = '', isDefault = false) => (
    <div >
      {showDrawer ? (
        <div className="information-wrapper">
          {description !== '' ? (
            <Tooltip align="bottom" label={description}>
              <Information className="information-icon" />
            </Tooltip>
          ) : null}
          <span className="information-text">{`Ver. ${value}`}</span>
          {isDefault ? <Tag type='cyan'>Default</Tag> : null}
        </div>
      ) : (
        <div className='tbody-wrapper'>
          <Tooltip label='Version History'>
            <div className="recently-view-wrapper" onClick={() => handleVersion(id, activityName, status)}>
              <span className="recently-view-text">{`Ver. ${value}`}</span>
              <RecentlyViewed />
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );

  // Render checkmark icon and text for encryption status
  const renderCheckmarkFilled = (encryptedvalue = '') => (
    <div className='tbody-wrapper'>
      <span className="encrypted-wrapper">
        {encryptedvalue ? (
          <>
            <CheckmarkFilled className="checkmark-filled-encrypted" /> <span className="encrypted-wrapper-text">Yes</span>
          </>
        ) : (
          <>
            <CloseFilled className="close-filled-encrypted" />
            <span className="encrypted-wrapper-text">No</span>
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
                      isSortable={header.key === 'name' ? true : false}
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
                    const versionKeyCell = row.cells.find((cell) => cell.id === `${row.id}:activityDefnVersionKey`);
                    const statusCell = row.cells.find((cell) => cell.id === `${row.id}:status`);
                    const activityName = row.cells.find((cell) => cell.id === `${row.id}:name`);
                    const description = row.cells.find((cell) => cell.id === `${row.id}:description`);
                    const isDefault = row.cells.find((cell) => cell.id === `${row.id}:isDefault`);
                    const versionName = row.cells.find((cell) => cell.id === `${row.id}:version`);

                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'action'
                              ? renderActionItem(statusCell.value, row.id, versionKeyCell.value)
                              : cell.info.header === 'ellipsis'
                                ? renderEllipsisMenu(row.id, statusCell.value, isDefault?.value, versionName?.value)
                                : cell.info.header === 'status'
                                  ? renderTag(cell.value.toLowerCase())
                                  : cell.info.header === 'name'
                                    ? renderInformation(cell.value, description?.value)
                                    : cell.info.header === 'version'
                                      ? renderRecentlyViewed(cell.value, row.id, activityName?.value, statusCell?.value, description?.value, isDefault?.value)
                                      : cell.info.header === 'isEncrypted'
                                        ? renderCheckmarkFilled(cell.value)
                                        : null}
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
};

export default ActivityDataTableComponent;
