import React, { useState, useEffect, useCallback } from 'react';
import './activity-list.scss';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';
import * as ActivityService from '../../services/activity-service.js';
import * as RolloutService from '../../services/rollout-service';
import { ACTIVITY_LIST_COLUMNS, ACTION_COLUMN_DRAFT, ACTION_COLUMN_FINAL, ACTION_COLUMN_KEYS, TEST_DIALOG_DATA } from '../../constants';
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
  Pagination,
  Section
} from '@carbon/react';
import { NewTab, Add } from '@carbon/icons-react';
import ActivityDropdown from '../../components/actions-dropdown';
import WrapperModal from '../../helpers/wrapper-modal';
import WrapperNotification from '../../helpers/wrapper-notification-toast';
import TestWizard from '../../components/test-wizard/test-wizard.js';
import useActivityStore from '../../store';
import PageDesigner from '@b2bi/page-designer';
import RolloutTest from '../../components/rollout-wizard/rollout-gap-details.js';
import RolloutDetails from '../../components/rollout-wizard/rollout-details.js';

export default function ActivityList() {
  const pageUtil = Shell.PageUtil();
  // State hooks for managing various states
  const editDefinition = useActivityStore((state) => state.editDefinitionProps);
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
  const [tempSelectedItem, setTempSelectedItem] = useState({}); // Temporarily store selected item
  const [activityDefnKey, setActivityDefnKey] = useState('');
  const [activityDetails, setActivityDetails] = useState(null);

  // Test operation states
  const [openTestModal, setOpenTestModal] = useState(false);
  const [currentTestStep, setCurrentTestStep] = useState(0);
  const [testDialogData, setTestDialogData] = useState(TEST_DIALOG_DATA);
  const [currentTestData, setCurrentTestData] = useState(null);
  const [formRenderSchema, setFormRenderSchema] = useState();

  // Rollout operation states
  const [openRolloutModal, setOpenRolloutModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [rolloutGapData, setRolloutGapData] = useState({ selectedGroupsData: [], selectedAttributesData: [], selectedPartnersData: [] });

  useEffect(() => {
    if (testDialogData) {
      let data = testDialogData[currentTestStep].schema.fields;
      setFormRenderSchema(data);
    }
  }, [currentTestData, currentTestStep, testDialogData]);

  // Function to fetch and set data from the API
  const fetchAndSetData = useCallback(() => {
    ActivityService.getActivityList(pageNo - 1, pageSize, sortDir, searchKey, status)
      .then((data) => {
        console.log('data>>>>', data);
        if (data.content != null) {
          setRows(data.content);
          setTotalRows(data.pageContent.totalElements);
        } else {
          setRows([]);
          setTotalRows(0);
        }
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
    setTempSelectedItem((prevSelectedItems) => ({
      ...prevSelectedItems,
      [id]: selectedItem
    })); // Temporarily store the selected item
    setActivityDefnKey(id);
    const itemId = selectedItem ? selectedItem.key : '';
    switch (itemId) {
      case ACTION_COLUMN_KEYS.MARK_AS_FINAL:
        setActionText('Mark as final');
        setMessage('The Activity can not be modified once you Mark as final. Do you want to Mark as final?');
        setOnPrimaryButtonClick(() => () => handleMarkAsFinal(id)); // Updated
        setIsModalOpen(true);
        break;
      case ACTION_COLUMN_KEYS.ROLLOUT:
        handleRolloutOperation(id);
        break;
      case ACTION_COLUMN_KEYS.TEST:
        handleTestOperation(id);
        break;
      default:
        return;
    }
  };

  // Handler to clear the selected item
  const clearSelectedItem = (id) => {
    setTempSelectedItem((prevSelectedItems) => ({
      ...prevSelectedItems,
      [id]: null
    }));
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
    handleModalClose();
    setIsModalOpen(false);
  };

  // Handler for delete action initiation
  const handleDelete = (id) => {
    setActionText('Delete');
    setMessage('Are you sure you want to delete? The Activity status will be changed to Deleted.');
    setOnPrimaryButtonClick(() => () => handleDeleteActivity(id)); // Updated
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const editRow = rows.filter((row) => row.id === id)[0];
    editDefinition(editRow);
    pageUtil.navigate(`${id}`, {});
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

  // Handler for modal close/cancel
  const handleModalClose = () => {
    clearSelectedItem(activityDefnKey); // Clear the selected item
    setIsModalOpen(false);
  };

  // Generate the ellipsis menu for each row
  const getEllipsis = (id) => {
    return (
      <OverflowMenu size="sm" flipped className="always-visible-overflow-menu">
        <OverflowMenuItem itemText="View" />
        <OverflowMenuItem itemText="Edit" onClick={() => handleEdit(id)} />
        <OverflowMenuItem itemText="Export" />
        <OverflowMenuItem itemText="Create Version" />
        <OverflowMenuItem itemText="Delete" onClick={() => handleDelete(id)} />
      </OverflowMenu>
    );
  };

  // Generate action items based on the activity status
  const getActionItem = (status, id) => {
    if (status === 'DRAFT' || status === '') {
      return (
        <ActivityDropdown
          statusLabel="Draft"
          selectedItem={tempSelectedItem[id]}
          id={id}
          items={ACTION_COLUMN_DRAFT}
          onChange={({ selectedItem }) => handleDropdownChange(selectedItem, id)}
        />
      );
    } else if (status === 'FINAL') {
      return (
        <ActivityDropdown
          statusLabel="Mark as Final"
          selectedItem={tempSelectedItem[id]}
          id={id}
          items={ACTION_COLUMN_FINAL}
          onChange={({ selectedItem }) => handleDropdownChange(selectedItem, id)}
        />
      );
    }
  };

  // -------------------------------------Test operation Start-------------------------------------------------
  // Function to handle the Test operation
  const handleTestOperation = async (id) => {
    const activityDetailsResponse = await getActivityDetails(id);
    if (activityDetailsResponse) {
      setActivityDetails(activityDetailsResponse);
      getTestData();
    }
  };

  const getTestData = () => {
    RolloutService.getTestList().then((data) => {
      setTestDialogData(data);
      setCurrentTestStep(0);
      setCurrentTestData(data && data[currentTestStep]);
      setOpenTestModal(true);
    });
  };

  // Function to handle the Next/rollout Button Click
  const handelTestFinishClick = () => {
    let schema = JSON.parse(JSON.stringify(formRenderSchema));
    schema = PageDesigner.formValidation(schema);
    setFormRenderSchema(schema);

    if (currentTestStep < testDialogData.length - 1) {
      setCurrentTestData(testDialogData[currentTestStep + 1]);
      setCurrentTestStep(currentTestStep + 1);
    } else if (currentTestStep === testDialogData.length - 1) {
      setOpenTestModal(false);
      // TODO -> Test API will call here
    }
  };

  // Function to handle the Cancel/Previous Button Click
  const handelTestCloseClick = () => {
    if (currentTestStep === 0) {
      setOpenTestModal(false);
    } else if (currentTestStep > 0 && currentTestStep <= testDialogData.length - 1) {
      setCurrentTestData(testDialogData[currentTestStep - 1]);
      setCurrentTestStep(currentTestStep - 1);
    }
  };

  // -------------------------------------Test operation End-------------------------------------------------

  // -------------------------------------Rollout operation Start-------------------------------------------------
  // Function to handle the Rollout operation
  const handleRolloutOperation = async (id) => {
    const activityDetailsResponse = await getActivityDetails(id);
    if (activityDetailsResponse) {
      setActivityDetails(activityDetailsResponse);
      setOpenRolloutModal(true);
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

  // Function to handle the Next/rollout Button Click
  const handleBackToDetails = () => {
    setOpenAddModal(false);
    setOpenRolloutModal(true);
  };

  const handleAddGroups = (selectedGroupsData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedGroupsData: [...selectedGroupsData] }));
  };

  const handleAddAttributes = (selectedAttributesData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedAttributesData: [...selectedAttributesData] }));
  };

  const handleAddPartners = (selectedPartnersData) => {
    setRolloutGapData((prev) => ({ ...prev, selectedPartnersData: [...selectedPartnersData] }));
  };

  // Function to handle the Next/rollout Button Click
  const handleSubmitClick = (data) => {
    console.log('data', data);
    // TODO -> Rollout API will call here
  };

  // -------------------------------------Rollout operation End-------------------------------------------------

  return (
    <>
      {/* Modal for Rollout operation */}
      {openRolloutModal && (
        <WrapperModal
          isOpen={openRolloutModal}
          modalHeading={activityDetails?.name}
          secondaryButtonText={'Cancel'}
          primaryButtonText={'Rollout'}
          onPrimaryButtonClick={handleSubmitClick}
          onSecondaryButtonClick={() => setOpenRolloutModal(false)}
          onRequestClose={() => setOpenRolloutModal(false)}
        >
          <RolloutDetails
            handleAddClick={() => {
              setOpenAddModal(true);
              setOpenRolloutModal(false);
            }}
          />
        </WrapperModal>
      )}
      {/* Modal for Add Partners and Groups, Attributes */}
      {openAddModal && (
        <WrapperModal
          isOpen={openAddModal}
          modalHeading={activityDetails?.name}
          secondaryButtonText={'Back to Details'}
          primaryButtonText={'Save'}
          onPrimaryButtonClick={handleSubmitClick}
          onSecondaryButtonClick={handleBackToDetails}
          onRequestClose={() => setOpenAddModal(false)}
        >
          <RolloutTest handleAddGroups={handleAddGroups} handleAddAttributes={handleAddAttributes} handleAddPartners={handleAddPartners} rolloutGapData={rolloutGapData} />
        </WrapperModal>
      )}
      <Shell.Page type="LIST" className="sfg--page--partner-list">
        <Shell.PageHeader title={pageUtil.t('mod-activity-definition:list.title')} description={pageUtil.t('mod-activity-definition:list.pageDescription')}></Shell.PageHeader>
        <Section className="page-notification-container">
          <Shell.NotificationMessage></Shell.NotificationMessage>
        </Section>
        <Section className="page-body">
          <div className="headers">
            <div className="header-buttons">
              {/* Search, New, Import buttons */}
              <ExpandableSearch labelText="Search" placeholder="Search By Activity Name" onChange={(event) => setSearchKey(event.target.value)} value={searchKey} />
              <Button size="sm" className="new-button" renderIcon={NewTab} onClick={() => pageUtil.navigate('new', {})}>
                New
              </Button>
              <Button size="sm" kind="tertiary" className="import-button" renderIcon={Add}>
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
          </div>
          <TableContainer>
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
        </Section>
        {/* Modal for action confirmation */}
        <WrapperModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          modalHeading="Confirmation"
          secondaryButtonText="Cancel"
          primaryButtonText={actionText}
          onPrimaryButtonClick={onPrimaryButtonClick}
          onSecondaryButtonClick={handleModalClose}
          onRequestClose={handleModalClose}
        >
          {message}
        </WrapperModal>
        {/* Modal for Test operation */}
        {openTestModal && (
          <WrapperModal
            isOpen={openTestModal}
            setIsOpen={setOpenTestModal}
            modalHeading={'Activity Test - ' + activityDetails?.name}
            secondaryButtonText={currentTestStep === 0 ? 'Cancel' : 'Previous'}
            primaryButtonText={currentTestStep < testDialogData.length - 1 ? 'Next' : 'Finish'}
            onPrimaryButtonClick={handelTestFinishClick}
            onSecondaryButtonClick={handelTestCloseClick}
            onRequestClose={() => setOpenTestModal(false)}
          >
            <TestWizard currentTestData={currentTestData} formRenderSchema={formRenderSchema} />
          </WrapperModal>
        )}
        {/* Notification toast */}
        {notificationProps && <WrapperNotification {...notificationProps} />}
      </Shell.Page>
    </>
  );
}
