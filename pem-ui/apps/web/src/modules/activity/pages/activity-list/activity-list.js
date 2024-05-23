import React, { useState, useEffect, useCallback } from 'react';
import './activity-list.scss';
import * as ActivityService from '../../activity-service';
import { NEW_ACTIVITY_URL, ACTIVITY_LIST_COLUMNS, ACTION_COLUMN_DRAFT, ACTION_COLUMN_FINAL } from '../../constants';
import {
  OverflowMenu,
  OverflowMenuItem,
  ExpandableSearch,
  Dropdown,
  Button,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Pagination
} from '@carbon/react';
import { NewTab, Add } from '@carbon/icons-react';
import ActivityDropdown from '../../components/actions-dropdown';
import WrapperModal from '../../components/helpers/wrapper-modal';
import WrapperNotification from '../../components/helpers/wrapper-notification-toast';

export default function ActivityList() {
  // State hooks for managing various states
  const [totalRows, setTotalRows] = useState(0);
  const [filterKey, setFilterKey] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [sortDir, setSortDir] = useState('ASC'); // Sorting direction state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("DRAFT");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionText, setActionText] = useState('');
  const [message, setMessage] = useState('');
  const [onPrimaryButtonClick, setOnPrimaryButtonClick] = useState(null); // Renamed state
  const [notificationProps, setNotificationProps] = useState(null);

  // Function to fetch and set data from the API
  const fetchAndSetData = useCallback(() => {
    ActivityService.getActivityList(pageNo - 1, pageSize, sortDir, filterKey, searchKey, status).then((data) => {
      setRows(data.content);
      setTotalRows(data.pageContent.totalElements);
    }).catch(error => {
      console.error('Failed to fetch data:', error);
      setNotificationProps({
        open: true,
        title: 'Error - ',
        subtitle: 'Failed to fetch data',
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null),
      });
    });
  }, [pageNo, pageSize, sortDir, filterKey, searchKey, status]);

  // useEffect to trigger fetchAndSetData whenever dependencies change
  useEffect(() => {
    fetchAndSetData();
  }, [fetchAndSetData]);

  // Handler for sorting table columns
  const handleHeaderClick = (headerKey) => {
    if (headerKey !== 'ellipsis' && headerKey !== 'action') {
      setSortDir((prevSortDir) => (prevSortDir === 'ASC' ? 'DESC' : 'ASC'));
    }
  };

  // Handler for changing filter selection
  const handleFilterChange = (e) => {
    const selectedFilter = e.selectedItem ? e.selectedItem.id : '';
    setFilterKey(selectedFilter);
  };

  // Handler for pagination changes
  const handlePaginationChange = (page, pageSize) => {
    setPageNo(page);
    setPageSize(pageSize);
  };

  // Handler for dropdown action changes
  const handleDropdownChange = (selectedItem, id) => {
    const itemId = selectedItem ? selectedItem.key : '';
    switch (itemId) {
      case 'markasfinal':
        setActionText("Mark as final");
        setMessage("The Activity can not be modified once you Mark as final. Do you want to Mark as final?");
        setOnPrimaryButtonClick(() => () => handleMarkAsFinal(id)); // Updated
        break;
      default:
        return;
    }
    setIsModalOpen(true);
  };

  // Handler for marking activity as final
  const handleMarkAsFinal = (id) => {
    // Implement the Mark as Final API call here
    setNotificationProps({
      open: true,
      title: 'Success - ',
      subtitle: 'Action completed successfully!',
      kind: 'success',
      onCloseButtonClick: () => setNotificationProps(null),
    });
    setIsModalOpen(false);
  };

  // Handler for delete action initiation
  const handleDelete = (id) => {
    setActionText("Delete");
    setMessage("Are you sure you want to delete? The Activity status will be changed to Deleted.");
    setOnPrimaryButtonClick(() => () => handleDeleteActivity(id)); // Updated
    setIsModalOpen(true);
  };

  // Handler for actual delete API call
  const handleDeleteActivity = async (id) => {
    try {
      const responseMsg = await ActivityService.deleteActivityList(id);
      if (responseMsg) {
        fetchAndSetData();
        setNotificationProps({
          open: true,
          title: 'Success - ',
          subtitle: 'Action completed successfully!',
          kind: 'success',
          onCloseButtonClick: () => setNotificationProps(null),
        });
      } else {
        setNotificationProps({
          open: true,
          title: 'Error - ',
          subtitle: 'Action not completed successfully!',
          kind: 'error',
          onCloseButtonClick: () => setNotificationProps(null),
        });
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
      setNotificationProps({
        open: true,
        title: 'Error - ',
        subtitle: 'Failed to delete activity',
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null),
      });
    }
    setIsModalOpen(false);
  };

  // Generate the ellipsis menu for each row
  const getEllipsis = (id) => {
    return (
      <OverflowMenu size="sm" flipped className="always-visible-overflow-menu">
        <OverflowMenuItem itemText="Edit" />
        <OverflowMenuItem itemText="Export" />
        <OverflowMenuItem itemText="Save as" />
        <OverflowMenuItem itemText="Delete" onClick={() => handleDelete(id)} />
      </OverflowMenu>
    );
  };

  // Generate action items based on the activity status
  const getActionItem = (status, id) => {
    if (status === "DRAFT") {
      return (
        <ActivityDropdown id={id} items={ACTION_COLUMN_DRAFT} onChange={({ selectedItem }) => handleDropdownChange(selectedItem, id)} />
      );
    } else if (status === "FINAL") {
      return (
        <ActivityDropdown id={id} items={ACTION_COLUMN_FINAL} onChange={({ selectedItem }) => handleDropdownChange(selectedItem, id)} />
      );
    }
  };

  return (
    <div className="activities-list-container">
      <TableContainer title="Activity Definitions">
        <div className='header-buttons'>
          {/* Search, New, Import buttons */}
          <ExpandableSearch labelText="Search" placeholder="" onChange={(event) => setSearchKey(event.target.value)} value={searchKey} />
          <Button className="new-button" renderIcon={NewTab} href={NEW_ACTIVITY_URL}>
            New
          </Button>
          <Button kind="tertiary" className="import-button" renderIcon={Add}>
            Import
          </Button>
          {/* Filter dropdown */}
          <Dropdown
            className="filter-dropdown"
            id="filter-dropdown"
            titleText=""
            label="Select Filter"
            items={[{ id: 'name', text: 'Activity Name' }]}
            itemToString={(item) => (item ? item.text : '')}
            onChange={handleFilterChange}
          />
        </div>
        {/* Data Table */}
        <DataTable rows={rows} headers={ACTIVITY_LIST_COLUMNS} isSortable>
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.key}
                      {...getHeaderProps({ header })}
                      isSortable={header.key !== 'ellipsis' && header.key !== 'action'}
                      sortDirection={sortDir}
                      onClick={() => handleHeaderClick(header.key)}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.info.header === 'action' ? getActionItem(status, row.id)
                          : cell.info.header === 'ellipsis' ? getEllipsis(row.id)
                            : cell.value
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
        {/* Pagination controls */}
        <Pagination
          backwardText="Previous page"
          forwardText="Next page"
          itemsPerPageText="Items per page:"
          totalItems={totalRows}
          pageSize={pageSize}
          pageSizes={[5, 10, 20, 50]}
          page={pageNo}
          onChange={({ page, pageSize }) => handlePaginationChange(page, pageSize)}
        />
        {/* Modal for action confirmation */}
        <WrapperModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} modalHeading="Confirmation" secondaryButtonText="Cancel" primaryButtonText={actionText} onPrimaryButtonClick={onPrimaryButtonClick} onSecondaryButtonClick={() => setIsModalOpen(false)} >
          {message}
        </WrapperModal>
        {/* Notification toast */}
        {notificationProps && <WrapperNotification {...notificationProps} />}
      </TableContainer>
    </div>
  );
}
