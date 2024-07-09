import React, { useState, useEffect, useCallback } from 'react';
import './activity-list.scss';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';
import * as ActivityService from '../../services/activity-service.js';
import * as RolloutService from '../../services/rollout-service';

import { ACTIVITY_LIST_COLUMNS, ACTION_COLUMN_KEYS, TEST_DIALOG_DATA } from '../../constants';
import { ExpandableSearch, MultiSelect, Button } from '@carbon/react';
import { NewTab, Add } from '@carbon/icons-react';

import GeneralModal from '../../helpers/wrapper-modal';
import WrapperNotification from '../../helpers/wrapper-notification-toast';

import useActivityStore from '../../store';
import PageDesigner from '@b2bi/page-designer';

import ActivityDataTableComponent from '../../components/datatable-component.js';

import ActivityRolloutModal from '../../components/rollout-wizard';
import ActivityTestModal from '../../components/test-wizard/test-wizard.js';

import ActivityVersionList from '../activity-version-list/activity-version-list.js';
import ActivityVersionsSideDrawer from '../../components/activity-sidedrawer/activity-sidedrawer.js';

export default function ActivityList() {
  const pageUtil = Shell.PageUtil();

  // State hooks for managing various states
  const store = useActivityStore();

  const [totalRows, setTotalRows] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [sortDir, setSortDir] = useState('DESC'); // Sorting direction state
  const [sortBy, setSortBy] = useState('modifyTs'); // Sorting direction state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('');

  const [showRolloutModal, setShowRolloutModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const [showGeneralActionModal, setShowGeneralActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [message, setMessage] = useState('');
  const [onPrimaryButtonClick, setOnPrimaryButtonClick] = useState(null); // Renamed state

  const [notificationProps, setNotificationProps] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);

  // Test operation states
  const [currentTestStep, setCurrentTestStep] = useState(0);
  const [testDialogData, setTestDialogData] = useState(TEST_DIALOG_DATA);
  const [currentTestData, setCurrentTestData] = useState(null);
  const [formRenderSchema, setFormRenderSchema] = useState();

  const [activityName, setActivityName] = useState('');
  const [activityDefnKey, setActivityDefnKey] = useState('');
  const [activityStatus, setActivityStatus] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    if (testDialogData) {
      let data = testDialogData[currentTestStep].schema.fields;
      setFormRenderSchema(data);
    }
  }, [currentTestData, currentTestStep, testDialogData]);

  // Function to fetch and set data from the API
  const fetchAndSetData = useCallback(() => {
    ActivityService.getActivityList(pageNo - 1, pageSize, sortDir, searchKey, status, sortBy)
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
  }, [pageNo, pageSize, sortDir, status, searchKey, sortBy]);

  // useEffect to trigger fetchAndSetData whenever dependencies change
  useEffect(() => {
    fetchAndSetData();
  }, [fetchAndSetData]);

  // Handler for sorting table columns
  const handleHeaderClick = (headerKey) => {
    if (headerKey === 'name') {
      setSortBy('activityName');
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

  // Handler for action clicks
  const onCellActionClick = (action, activityDefKey, actVersionKey = '') => {
    const record = rows.filter((x) => x.id === activityDefKey)[0];
    store.setSelectedActivity({
      activityDefKey: record.activityDefnKey,
      actDefName: record.name,
      actDefVerKey: record.activityDefnVersionKey,
      operation: action,
      status: record.status,
      version: record.version
    });
    setSelectedActivity(record);
    switch (action) {
      case ACTION_COLUMN_KEYS.MARK_AS_FINAL:
        setActionText('Mark as final');
        setMessage('The Activity can not be modified once you Mark as final. Do you want to Mark as final?');
        setOnPrimaryButtonClick(() => () => handleMarkAsFinal(activityDefKey, actVersionKey)); // Updated
        setShowGeneralActionModal(true);

        break;
      case ACTION_COLUMN_KEYS.DELETE:
        setActionText('Delete');
        setMessage('Are you sure you want to delete? The Activity status will be changed to Deleted.');
        setOnPrimaryButtonClick(() => () => handleDeleteActivity(activityDefKey));
        setShowGeneralActionModal(true);
        break;
      case ACTION_COLUMN_KEYS.ROLLOUT:
        setShowRolloutModal(true); //(id);
        break;
      case ACTION_COLUMN_KEYS.TEST_ACTIVITY:
        handleTestOperation(activityDefKey);
        break;
      case ACTION_COLUMN_KEYS.EDIT:
        handleEdit(activityDefKey);
        break;
      case ACTION_COLUMN_KEYS.VIEW:
        handleView(activityDefKey);
        break;
      case ACTION_COLUMN_KEYS.EXPORT_ACTIVITY:
        console.log('Export Activity');
        break;
      case ACTION_COLUMN_KEYS.CLONE_ACTIVITY:
        console.log('Clone Activity');
        break;
      case ACTION_COLUMN_KEYS.RESTORE:
        console.log('Restore Activity');
        break;
      default:
        return;
    }
  };

  // Handler for marking activity as final
  const handleMarkAsFinal = async (id, versionKey) => {
    const responseStatus = await ActivityService.markActivityDefinitionAsFinal(id, versionKey);

    if (responseStatus.success && responseStatus.status !== undefined && responseStatus.status === 'FINAL') {
      fetchAndSetData();
    }
    setNotificationProps({
      open: responseStatus.success,
      title: responseStatus.success ? 'Success - ' : 'Error - ',
      subtitle: responseStatus.success ? 'Action completed successfully!' : `Action not completed successfully - ${responseStatus}`,
      kind: responseStatus.success ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });
    setShowGeneralActionModal(false);
  };

  // Handler for actual delete API call
  const handleDeleteActivity = async (id) => {
    const response = await ActivityService.deleteActivity(id);
    if (response.success) {
      fetchAndSetData();
    }
    setNotificationProps({
      open: response.success,
      title: response.success ? 'Success - ' : 'Error - ',
      subtitle: response.success ? 'Action completed successfully!' : 'Action not completed successfully!',
      kind: response.success ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });
    setShowGeneralActionModal(false);
  };

  const handleEdit = (id) => {
    pageUtil.navigate(`${id}`, {});
  };

  const handleView = (id) => {
    pageUtil.navigate(`${id}`, {});
  };

  const onNewClick = () => {
    store.reset();
    pageUtil.navigate('new', {});
  };

  const handleVersion = (id, activityName, status) => {
    setActivityDefnKey(id);
    setActivityName(activityName);
    setActivityStatus(status);
    setShowDrawer(true);
  };

  const handleClose = () => {
    setShowDrawer(false);
  };

  // -------------------------------------Test operation Start-------------------------------------------------
  // Function to handle the Test operation
  const handleTestOperation = async (id) => {
    //const activityDetailsResponse = await getActivityDetails(id);
    // if (activityDetailsResponse) {
    //setActivityDetails(activityDetailsResponse);
    getTestData();
    //}
  };
  const getTestData = () => {
    RolloutService.getTestList().then((data) => {
      setTestDialogData(data);
      setCurrentTestStep(0);
      setCurrentTestData(data && data[currentTestStep]);
      setShowTestModal(true);
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
      setShowTestModal(false);
      // TODO -> Test API will call here
    }
  };
  // Function to handle the Cancel/Previous Button Click
  const handelTestCloseClick = () => {
    if (currentTestStep === 0) {
      setShowTestModal(false);
    } else if (currentTestStep > 0 && currentTestStep <= testDialogData.length - 1) {
      setCurrentTestData(testDialogData[currentTestStep - 1]);
      setCurrentTestStep(currentTestStep - 1);
    }
  };
  // -------------------------------------Test operation End-------------------------------------------------

  return (
    <>
      <div className="headers">
        <div className="header-button-right">
          {/* Header Title */}
          {pageUtil.t('mod-activity-definition:list.title')}
        </div>
        <div className="header-button-left">
          {/* Search, New, Import buttons */}
          <ExpandableSearch labelText="Search" placeholder="Search By Activity Name" onChange={(event) => setSearchKey(event.target.value)} value={searchKey} />
          <Button size="sm" className="new-button" renderIcon={NewTab} onClick={onNewClick}>
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
      <ActivityDataTableComponent
        headers={ACTIVITY_LIST_COLUMNS}
        rows={rows}
        sortDir={sortDir}
        totalRows={totalRows}
        pageNo={pageNo}
        pageSize={pageSize}
        handlePaginationChange={handlePaginationChange}
        onCellActionClick={onCellActionClick}
        handleHeaderClick={handleHeaderClick}
        handleVersion={handleVersion}
      />
      {/* For Version Drawer */}
      {activityDefnKey !== '' && (
        <ActivityVersionsSideDrawer anchor="right" showDrawer={showDrawer} onClose={handleClose}>
          <ActivityVersionList activityName={activityName} onClose={handleClose} activityDefnKey={activityDefnKey} status={activityStatus} showDrawer={showDrawer} />
        </ActivityVersionsSideDrawer>
      )}
      {/* For Version Drawer */}
      {/*  </Section> */}
      {/* Modal for action confirmation */}
      <GeneralModal
        isOpen={showGeneralActionModal}
        setIsOpen={setShowGeneralActionModal}
        modalHeading="Confirmation"
        secondaryButtonText="Cancel"
        primaryButtonText={actionText}
        onPrimaryButtonClick={onPrimaryButtonClick}
        onSecondaryButtonClick={() => setShowGeneralActionModal(false)}
        onRequestClose={() => setShowGeneralActionModal(false)}
      >
        {message}
      </GeneralModal>
      {/* Modal for Test operation */}
      {showTestModal && (
        <GeneralModal
          isOpen={showTestModal}
          setIsOpen={setShowTestModal}
          modalHeading={selectedActivity ? selectedActivity.name : ''}
          secondaryButtonText={currentTestStep === 0 ? 'Cancel' : 'Previous'}
          primaryButtonText={currentTestStep < testDialogData.length - 1 ? 'Next' : 'Finish'}
          onPrimaryButtonClick={handelTestFinishClick}
          onSecondaryButtonClick={handelTestCloseClick}
          onRequestClose={() => setShowTestModal(false)}
        >
          <ActivityTestModal currentTestData={currentTestData} formRenderSchema={formRenderSchema} />
        </GeneralModal>
      )}

      {/* Notification toast */}
      {notificationProps && notificationProps.open && <WrapperNotification {...notificationProps} />}

      {/* Modal for Rollout operation */}
      {showRolloutModal && (
        <ActivityRolloutModal
          showModal={showRolloutModal}
          setShowModal={() => setShowRolloutModal(false)}
          activityDefKey={selectedActivity ? selectedActivity.activityDefnKey : ''}
          activityVerKey={selectedActivity ? selectedActivity.activityDefnVersionKey : ''}
          activityName={selectedActivity ? selectedActivity.name : ''}
        />
      )}
    </>
  );
}
