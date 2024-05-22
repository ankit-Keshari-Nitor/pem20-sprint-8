import React, { useState, useEffect, useCallback } from 'react';
import './activity-list.scss';
import * as ActivityService from '../../activity-service'
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
import CustomModal from '../../components/helpers/wapper-modal';
import CustomInlineNotification from '../../components/helpers/wapper-notification-toast';

export default function ActivityList() {
  const [totalRows, setTotalRows] = useState(0);
  const [filterKey, setFilterKey] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [sortDir, setSortDir] = useState('ASC'); // Add state for sorting
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("DRAFT");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [actionText, setActionText] = useState('') // action Text
  const [message, setMessage] = useState(''); //message as per the action
  const [selectedAction, setSelectedAction] = useState(null);
  const [notificationProps, setNotificationProps] = useState(null);


  const fetchAndSetData = useCallback(() => {
    ActivityService.getActivityList(pageNo - 1, pageSize, sortDir, filterKey, searchKey, status).then((data) => {
      setRows(data.content);
      setTotalRows(data.pageContent.totalElements);
    });
  }, [pageNo, pageSize, sortDir, filterKey, searchKey, status]);

  useEffect(() => {
    fetchAndSetData();
  }, [fetchAndSetData]);

  const handleHeaderClick = () => {
    setSortDir((prevSortDir) => (prevSortDir === 'ASC' ? 'DESC' : 'ASC'));
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.selectedItem ? e.selectedItem.id : '';
    setFilterKey(selectedFilter);
    // setSearchKey("");
  };

  const handlePaginationChange = (pageNo, pageSize) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  };

  // Function to handle dropdown change
  const handleDropdownChange = (selectedItem, id) => {

    const itemId = selectedItem ? selectedItem.key : '';
    switch (itemId) {
      case 'markasfinal':
        setActionText("Mark as final");
        setMessage("The Activity can not be modified once you Mark as final. Do you want to Mark as final?")
        setSelectedAction(() => () => handleMarkAsFinal(id));
        break;
      default:
        return;
    }
    setIsModalOpen(true); // Open the modal

  };

  const handleMarkAsFinal = (id) => {
    // Implement the Mark as Final API call here
    /*  ActivityService.markAsFinal(id).then(() => {
       fetchAndSetData();
     }); 
     */
    setNotificationProps({
      open: true,
      title: 'Success - ',
      subtitle: 'Action completed successfully!',
      kind: 'success',
      onCloseButtonClick: () => setNotificationProps(null),
    });
  };

  const handleDelete = (id) => {
    setActionText("Delete");
    setMessage("Are you sure you want to delete? The Activity status will be changed to Deleted?");
    setSelectedAction(() => () => handleDeleteActivity(id));
    setIsModalOpen(true);
  };

  const handleDeleteActivity = (id) => {
    ActivityService.deleteActivityList(id).then((data) => {
      console.log(data, '-------');
      fetchAndSetData();
    });
  };


  // Function to generate overflow menu for each row
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
          <ExpandableSearch labelText="Search" placeholder="" onChange={(event) => setSearchKey(event.target.value)} value={searchKey} />
          <Button className="new-button" renderIcon={NewTab} href={NEW_ACTIVITY_URL}>
            New
          </Button>
          <Button kind="tertiary" className="import-button" renderIcon={Add}>
            Import
          </Button>
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
        <DataTable rows={rows} headers={ACTIVITY_LIST_COLUMNS} isSortable>
          {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header, i) => (
                    <TableHeader
                      key={header.key}
                      {...getHeaderProps({ header, isSortable: header.key !== 'ellipsis' && header.key !== 'action' })}
                      sortDirection={sortDir === 'ASC' ? 'ASC' : 'DESC'}
                      onClick={header.key !== 'ellipsis' && header.key !== 'action' ? handleHeaderClick : null}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell, index) => (
                      <TableCell key={cell.id}>
                        {
                          cell.info.header === 'action' ? getActionItem(status, row.id)
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
        <CustomModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} btnText={actionText} message={message} onPrimaryButtonClick={selectedAction} />
        {notificationProps && <CustomInlineNotification {...notificationProps} />}

      </TableContainer>
    </div>
  );
}
