import React, { useState, useEffect } from 'react';
import './activity-list.scss';
import * as ActivityService from '../activity-service';
import { NEW_ACTIVITY_URL, ACTIVITY_LIST_COLUMNS } from '../constants';
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

export default function ActivityList() {
  const [totalRows, setTotalRows] = useState(0);
  const [filterKey, setFilterKey] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [sortDir, setSortDir] = useState('ASC'); // Add state for sorting
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);

  const fetchAndSetData = () => {
    ActivityService.getActivityList(pageNo - 1, pageSize, sortDir, filterKey, searchKey).then((data) => {
      setRows(data.content);
      setTotalRows(data.pageContent.totalElements);
    });
  };

  useEffect(() => {
    fetchAndSetData(); // Fetch data on component mount and when sortDir changes
  }, [pageNo, pageSize, sortDir, filterKey, searchKey]);

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
    const newUrl = `/#/activities/definitions/${itemId}?id=${id}`;
    console.log('URL - ', newUrl);
  };

  // Function to generate overflow menu for each row
  const getEllipsis = (i) => {
    return (
      <OverflowMenu size="sm" flipped className="always-visible-overflow-menu">
        <OverflowMenuItem itemText="Edit" />
        <OverflowMenuItem itemText="Export" />
        <OverflowMenuItem itemText="Save as" />
        <OverflowMenuItem itemText="Delete" />
      </OverflowMenu>
    );
  };

  return (
    <div className="activities-list-container">
      <TableContainer title="Activity Definitions">
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <ExpandableSearch labelText="Search" placeholder="" onChange={(event) => setSearchKey(event.target.value)} value={searchKey} />
          <Button style={{ marginLeft: '8px' }} renderIcon={NewTab} href={NEW_ACTIVITY_URL}>
            New
          </Button>
          <Button kind="tertiary" style={{ marginLeft: '8px' }} renderIcon={Add}>
            Import
          </Button>
          <Dropdown
            style={{ marginLeft: '8px' }}
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
                        {cell.info.header === 'ellipsis' ? (
                          getEllipsis(row.id)
                        ) : cell.info.header === 'action' ? (
                          <Dropdown
                            id={`action-dropdown-${cell.id}`}
                            items={[
                              { key: 'rollout', label: 'RollOut' },
                              { key: 'final', label: 'Final' },
                              { key: 'draft', label: 'Draft' }
                            ]}
                            label="Choose an action"
                            itemToString={(item) => (item ? item.label : '')}
                            onChange={({ selectedItem }) => handleDropdownChange(selectedItem, row.id)}
                          />
                        ) : (
                          cell.value
                        )}
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
      </TableContainer>
    </div>
  );
}
