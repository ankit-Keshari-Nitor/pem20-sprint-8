import React, { useState, useEffect, useCallback } from 'react';
import './activity-list.scss';
import * as ActivityService from '../../activity-service';
import { NEW_ACTIVITY_URL, ACTIVITY_LIST_COLUMNS, ACTION_COLUMN_DRAFT, ACTION_COLUMN_FINAL, ACTION_COLUMN_KEYS } from '../../constants';
import {
  OverflowMenu,
  OverflowMenuItem,
  ExpandableSearch,
  MultiSelect,
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
import { RolloutDetails, RolloutGapDetails, RolloutProgressSteps } from '../../components';

export default function ActivityList() {
  // State hooks for managing various states
  const [totalRows, setTotalRows] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [sortDir, setSortDir] = useState('ASC'); // Sorting direction state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('DRAFT');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionText, setActionText] = useState('');
  const [message, setMessage] = useState('');
  const [onPrimaryButtonClick, setOnPrimaryButtonClick] = useState(null); // Renamed state
  const [notificationProps, setNotificationProps] = useState(null);

  // Rollout operation states
  const [openRolloutModal, setOpenRolloutModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activityDetails, setActivityDetails] = useState(null);

  // Function to fetch and set data from the API
  const fetchAndSetData = useCallback(() => {
    ActivityService.getActivityList(pageNo - 1, pageSize, sortDir, searchKey, status)
      .then((data) => {
        setRows(data.content);
        setTotalRows(data.pageContent.totalElements);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
        setNotificationProps({
          open: true,
          title: 'Error - ',
          subtitle: 'Failed to fetch data',
          kind: 'error',
          onCloseButtonClick: () => setNotificationProps(null)
        });
      });
  }, [pageNo, pageSize, sortDir, searchKey, status]);

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
  const handleFilterChange = (selectedItems) => {
    if (Array.isArray(selectedItems.selectedItems)) {
      const selectedIds = selectedItems.selectedItems.map((item) => item.id);
      setStatus(selectedIds.join(','));
    } else {
      setStatus([]);
    }
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
        setActionText('Mark as final');
        setMessage('The Activity can not be modified once you Mark as final. Do you want to Mark as final?');
        setOnPrimaryButtonClick(() => () => handleMarkAsFinal(id)); // Updated
        setIsModalOpen(true);
        break;
      case ACTION_COLUMN_KEYS.ROLLOUT:
        handleRolloutOperation(id);
        break;
      default:
        return;
    }
  };

  // Handler for marking activity as final
  const handleMarkAsFinal = async (id) => {
    try {
      let activityVersionKey;
      const response = await ActivityService.getActivityVersionkey(pageNo - 1, pageSize, sortDir, status, true, id);

      if (response !== undefined) {
        activityVersionKey = response[0].activityDefnKeyVersion;

        const responseStatus = await ActivityService.markActivityDefinitionAsFinal(id, activityVersionKey);

        if (responseStatus !== undefined && responseStatus === 'FINAL') {
          fetchAndSetData();
          setNotificationProps({
            open: true,
            title: 'Success - ',
            subtitle: 'Action completed successfully!',
            kind: 'success',
            onCloseButtonClick: () => setNotificationProps(null)
          });
        } else {
          setNotificationProps({
            open: true,
            title: 'Error - ',
            subtitle: 'Action not completed successfully!',
            kind: 'error',
            onCloseButtonClick: () => setNotificationProps(null)
          });
        }
      } else {
        setNotificationProps({
          open: true,
          title: 'Error - ',
          subtitle: 'Action not completed successfully!',
          kind: 'error',
          onCloseButtonClick: () => setNotificationProps(null)
        });
      }
    } catch (error) {
      console.error('Failed to mark as final activity:', error);
      setNotificationProps({
        open: true,
        title: 'Error - ',
        subtitle: 'Failed to mark as final activity',
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null)
      });
    }
    setIsModalOpen(false);
  };

  // Handler for delete action initiation
  const handleDelete = (id) => {
    setActionText('Delete');
    setMessage('Are you sure you want to delete? The Activity status will be changed to Deleted.');
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
          onCloseButtonClick: () => setNotificationProps(null)
        });
      } else {
        setNotificationProps({
          open: true,
          title: 'Error - ',
          subtitle: 'Action not completed successfully!',
          kind: 'error',
          onCloseButtonClick: () => setNotificationProps(null)
        });
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
      setNotificationProps({
        open: true,
        title: 'Error - ',
        subtitle: 'Failed to delete activity',
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null)
      });
    }
    setIsModalOpen(false);
  };

  // Generate the ellipsis menu for each row
  const getEllipsis = (id) => {
    return (
      <OverflowMenu size="sm" flipped className="always-visible-overflow-menu">
        <OverflowMenuItem itemText="View" />
        <OverflowMenuItem itemText="Edit" />
        <OverflowMenuItem itemText="Export" />
        <OverflowMenuItem itemText="Create Version" />
        <OverflowMenuItem itemText="Delete" onClick={() => handleDelete(id)} />
      </OverflowMenu>
    );
  };

  // Generate action items based on the activity status
  const getActionItem = (status, id) => {
    if (status === 'DRAFT' || status === '') {
      return <ActivityDropdown id={id} items={ACTION_COLUMN_DRAFT} onChange={({ selectedItem }) => handleDropdownChange(selectedItem, id)} />;
    } else if (status === 'FINAL') {
      return <ActivityDropdown id={id} items={ACTION_COLUMN_FINAL} onChange={({ selectedItem }) => handleDropdownChange(selectedItem, id)} />;
    }
  };

  const handleRolloutOperation = async (id) => {
    const activityDetailsResponse = await getActivityDetails(id);
    if (activityDetailsResponse) {
      setActivityDetails(activityDetailsResponse);
      setCurrentStep(0);
      setOpenRolloutModal(true);
    }
  };

  // Function to handle the Progress Indicator Click
  const handelStepChange = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  };

  // Function to handle the Cancel/Previous Button Click
  const handelCloseClick = () => {
    if (currentStep === 0) {
      setOpenRolloutModal(false);
    } else {
      setCurrentStep(0);
    }
  };

  // Function to handle the Next/rollout Button Click
  const handelSubmitClick = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else {
      // TODO -> Rollout API will call here
    }
  };

  // Handler for actual delete API call
  const getActivityDetails = async (id) => {
    try {
      const responseMsg = await ActivityService.getActivityDetails(id);
      if (responseMsg) {
        return responseMsg;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to get activity details:', error);
      return null;
    }
  };

  return (
    <div className="activities-list-container">
      <TableContainer title="Activity Definitions">
        <div className="header-buttons">
          {/* Search, New, Import buttons */}
          <ExpandableSearch labelText="Search" placeholder="Search By Activity Name" onChange={(event) => setSearchKey(event.target.value)} value={searchKey} />
          <Button className="new-button" renderIcon={NewTab} href={NEW_ACTIVITY_URL}>
            New
          </Button>
          <Button kind="tertiary" className="import-button" renderIcon={Add}>
            Import
          </Button>
          {/* Filter dropdown */}
          <MultiSelect
            className="filter-dropdown"
            id="filter-dropdown"
            titleText=""
            label="Filter Option"
            items={[
              { id: 'DRAFT', text: 'DRAFT' },
              { id: 'FINAL', text: 'FINAL' },
              { id: 'DELETE', text: 'DELETE' }
            ]}
            itemToString={(item) => (item ? item.text : '')}
            onChange={handleFilterChange} // Ensure this is correctly set to your onChange handler
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
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'action' ? getActionItem(status, row.id) : cell.info.header === 'ellipsis' ? getEllipsis(row.id) : cell.value}
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
          page={pageNo}
          onChange={({ page, pageSize }) => handlePaginationChange(page, pageSize)}
        />
      </TableContainer>
      {/* Modal for action confirmation */}
      <WrapperModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        modalHeading="Confirmation"
        secondaryButtonText="Cancel"
        primaryButtonText={actionText}
        onPrimaryButtonClick={onPrimaryButtonClick}
        onSecondaryButtonClick={() => setIsModalOpen(false)}
      >
        {message}
      </WrapperModal>
      {/* Modal for Rollout operation */}
      {openRolloutModal && (
        <WrapperModal
          isOpen={openRolloutModal}
          setIsOpen={setOpenRolloutModal}
          modalHeading={'Activity Rollout - ' + activityDetails?.name}
          secondaryButtonText={currentStep === 0 ? 'Cancel' : 'Previous'}
          primaryButtonText={currentStep === 0 ? 'Next' : 'Rollout'}
          onPrimaryButtonClick={handelSubmitClick}
          onSecondaryButtonClick={handelCloseClick}
        >
          <RolloutProgressSteps currentStep={currentStep} handelStepChange={handelStepChange} />
          {currentStep === 0 ? <RolloutDetails /> : <RolloutGapDetails />}
        </WrapperModal>
      )}
      {/* Notification toast */}
      {notificationProps && <WrapperNotification {...notificationProps} />}
    </div>
  );
}
