import React, { useEffect, useState, useCallback } from 'react';
import { CrossIcon } from '../../icons';
import { TableContainer } from '@carbon/react';
import './activity-version-list.scss';

import DataTableComponent from '../../components/datatable-component';

import GeneralModal from '../../helpers/wrapper-modal';
import WrapperNotification from '../../helpers/wrapper-notification-toast';

import { ACTIVITY_VERSION_COLUMNS, ACTION_COLUMN_KEYS } from '../../constants';

import * as ActivityVersionService from '../../services/actvity-version-service.js';
import * as ActivityService from '../../services/activity-service.js';

const ActivityVersionList = ({ activityName, activityDefnKey, status, onClose, showDrawer }) => {
  // Version Side drawer
  const [totalRows, setTotalRows] = useState(0);
  const [sortDir, setSortDir] = useState('DESC'); // Sorting direction state
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [versionRows, setVersionRows] = useState([]);

  const [notificationProps, setNotificationProps] = useState(null);

  const [showGeneralActionModal, setShowGeneralActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [message, setMessage] = useState('');
  const [onPrimaryButtonClick, setOnPrimaryButtonClick] = useState(null); // Renamed state


  // Function to fetch and set data from the API
  const fetchVersionRowData = useCallback(
    async (activityDefnKey) => {
      try {
        const data = await ActivityVersionService.getActivityVersionList(activityDefnKey, pageNo - 1, pageSize, sortDir);
        setVersionRows(data.content);
        setTotalRows(data.pageContent.totalElements);
      } catch (error) {
        console.error('Failed to fetch expanded row data:', error);
      }
    },
    [pageNo, pageSize, sortDir]
  );

  useEffect(() => {
    if (activityDefnKey !== '' && status !== '') {
      fetchVersionRowData(activityDefnKey, status);
    }
  }, [activityDefnKey, status, fetchVersionRowData]);

  // Handler for pagination changes
  const handlePaginationChange = (page, pageSize) => {
    setPageNo(page);
    setPageSize(pageSize);
  };

  // Handler for sorting table columns
  const handleHeaderClick = (headerKey) => {
    if (headerKey !== 'ellipsis' && headerKey !== 'action') {
      setSortDir((prevSortDir) => (prevSortDir === 'ASC' ? 'DESC' : 'ASC'));
    }
  };

  // Handler for action clicks
  const onCellActionClick = (action, actVersionKey = '', versionName = '') => {
    /* const record = rows.filter((x) => x.id === activityDefKey)[0];
    store.setSelectedActivity({
      activityDefKey: record.activityDefnKey,
      actDefName: record.name,
      actDefVerKey: record.activityDefnVersionKey,
      operation: action,
      status: record.status,
      version: record.version
    });
    setSelectedActivity(record); */

    switch (action) {
      case ACTION_COLUMN_KEYS.MARK_AS_FINAL:
        setActionText('Mark as final');
        setMessage('The Version can not be modified once you Mark as final. Do you want to Mark as final?');
        setOnPrimaryButtonClick(() => () => handleMarkAsFinal(activityDefnKey, actVersionKey)); // Updated
        setShowGeneralActionModal(true);
        break;
      case ACTION_COLUMN_KEYS.DELETE:
        console.log('Delete Version');
        break;
      case ACTION_COLUMN_KEYS.MARK_AS_DEFAULT:
        setActionText('Yes');
        setMessage(`Are you sure you want to make 'Ver.${versionName}' Mark as default? The Activity version will be marked as default.`);
        setOnPrimaryButtonClick(() => () => handleMarkAsDefaultActivity(activityDefnKey, actVersionKey)); // Updated
        setShowGeneralActionModal(true);
        break;
      case ACTION_COLUMN_KEYS.ROLLOUT:
        console.log('Rollout Version');
        break;
      case ACTION_COLUMN_KEYS.TEST_ACTIVITY:
        console.log('Test Version');
        break;
      case ACTION_COLUMN_KEYS.EDIT:
        console.log('Edit Version');
        break;
      case ACTION_COLUMN_KEYS.VIEW:
        console.log('View Version');
        break;
      case ACTION_COLUMN_KEYS.EXPORT_ACTIVITY:
        console.log('Export Version');
        break;
      case ACTION_COLUMN_KEYS.CLONE_ACTIVITY:
        console.log('Clone Version');
        break;
      case ACTION_COLUMN_KEYS.RESTORE:
        console.log('Restore Version');
        break;
      default:
        return;
    }
  };

  // Handler for marking activity as final
  const handleMarkAsFinal = async (activityDefnKey, versionKey) => {
    const response = await ActivityService.markActivityDefinitionAsFinal(activityDefnKey, versionKey);

    if (response) {
      fetchVersionRowData(activityDefnKey);
    }
    setNotificationProps({
      open: true,
      title: response ? 'Success - ' : 'Error - ',
      subtitle: response ? 'Action completed successfully!' : `Action not completed successfully!`,
      kind: response ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });
    setShowGeneralActionModal(false);
  };

  //Handle Mark As Default action
  const handleMarkAsDefaultActivity = async (activityDefnKey, versionKey) => {
    const response = await ActivityVersionService.markVersionAsDefault(activityDefnKey, versionKey);

    if (response) {
      fetchVersionRowData(activityDefnKey);
    }
    setNotificationProps({
      open: true,
      title: response ? 'Success - ' : 'Error - ',
      subtitle: response ? 'Action completed successfully!' : `Action not completed successfully!`,
      kind: response ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });

    setShowGeneralActionModal(false);
  }


  return (
    <>
      <div className="headers-drawer">
        <div className="header-button-right-drawer">
          {/* Header Title */}
          {activityName} (Version History)
        </div>
        <div className="header-button-left-drawer" aria-label="close" onClick={onClose}>
          <CrossIcon labelText="close" placeholder="Close Side Drawer" />
        </div>
      </div>
      <TableContainer>
        <DataTableComponent
          headers={ACTIVITY_VERSION_COLUMNS}
          rows={versionRows}
          sortDir={sortDir}
          totalRows={totalRows}
          pageNo={pageNo}
          pageSize={pageSize}
          handlePaginationChange={handlePaginationChange}
          handleHeaderClick={handleHeaderClick}
          showDrawer={showDrawer}
          onCellActionClick={onCellActionClick}
        />
      </TableContainer>

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

      {/* Notification toast */}
      {notificationProps && notificationProps.open && <WrapperNotification {...notificationProps} />}

    </>
  );
};

export default ActivityVersionList;
