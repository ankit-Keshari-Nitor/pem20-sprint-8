import React, { useEffect, useState, useCallback } from 'react';
import { CrossIcon } from '../../icons';
import { TableContainer } from '@carbon/react';

import DataTableComponent from '../../components/datatable-component';

import { ACTIVITY_VERSION_COLUMNS } from '../../constants'

import * as ActivityService from '../../services/activity-service.js';

const ActivityVersionList = ({ activityName, activityDefnKey, status, onClose, showDrawer }) => {

    // Version Side drawer
    const [totalRows, setTotalRows] = useState(0);
    const [sortDir, setSortDir] = useState('ASC'); // Sorting direction state
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [versionRows, setVersionRows] = useState([]);

    // Function to fetch and set data from the API
    const fetchVersionRowData = useCallback(async (activityDefnKey, status) => {
        try {
            const data = await ActivityService.getActivityVersionkey(pageNo - 1, pageSize, sortDir, status, true, activityDefnKey);
            setVersionRows(data.content);
            setTotalRows(data.pageContent.totalElements);
        } catch (error) {
            console.error('Failed to fetch expanded row data:', error);
        }
    }, [pageNo, pageSize, sortDir]);

    useEffect(() => {
        if (activityDefnKey !== "" && status !== "") {
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

    return (
        <>
            <div className="headers-drawer">
                <div className="header-button-right-drawer">
                    {/* Header Title */}
                    {activityName} (Version History)
                </div>
                <div className="header-button-left-drawer" onClick={onClose}>
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
                />
            </TableContainer>
        </>
    );
}

export default ActivityVersionList;


