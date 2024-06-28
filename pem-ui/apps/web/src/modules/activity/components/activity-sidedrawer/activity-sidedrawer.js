import React, { useCallback, useState, useEffect } from 'react';
import classes from './activity-sidedrawer.module.scss';
import { changeAnchor } from './change-anchor';
import * as ActivityService from '../../services/activity-service';

const ActivityVersionsSideDrawer = ({
  open,
  anchor,
  onClose,
  children,
  drawerVersionId,
  setVersionData,
  setTotalVersionRows,
  handleVersionPagination,
  versionPageNo,
  versionPageSize,
  sortDir,
  status
}) => {
  const { drawer, animate, hidden, overlay, overlayOpen, overlayHidden, header, actionItem } = classes;

  // Function to fetch and set data from the API
  const getVersionDrawerData = useCallback(
    (drawerVersionId) => {
      ActivityService.getActivityVersionkey(versionPageNo - 1, versionPageSize, sortDir, status, true, drawerVersionId)
        .then((data) => {
          setVersionData(data.content);
          setTotalVersionRows(data.pageContent.totalElements);
        })
        .catch((error) => {
          console.error('Failed to fetch data:', error);
        });
    },
    [versionPageNo, versionPageSize, sortDir, status]
  );

  // useEffect to trigger fetchAndSetData whenever dependencies change
  useEffect(() => {
    getVersionDrawerData(drawerVersionId);
  }, [getVersionDrawerData]);

  return (
    <>
      <div className={`${overlay} ${!open && overlayHidden} ${open && overlayOpen}`} onClick={onClose} aria-hidden="true" data-testid="overlay" />
      <div tabIndex="-1" className={`${drawer} ${actionItem} ${open && animate} ${!open && hidden}  ${changeAnchor(anchor, classes)}`} data-testid="drawer">
        {children}
      </div>
    </>
  );
};

export default ActivityVersionsSideDrawer;