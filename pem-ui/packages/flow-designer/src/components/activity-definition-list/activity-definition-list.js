import React, { useState, useEffect } from 'react';
import {
  ExpandableSearch,
  Dropdown,
  Button,
  Pagination,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  OverflowMenu,
  OverflowMenuItem
} from '@carbon/react';
import { NewTab, Add } from '@carbon/icons-react';
import './activity-definition-list.scss';
import { NEW_ACTIVITY_URL, API_URL } from '../../constants';

export default function ActivityDefinition() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rows, setRows] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const url = API_URL.ACTIVITY_DEFINITION;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();

      const customizedData = jsonData.content.map((e) => {
        return {
          id: e.activityDefnKey,
          ...e
        };
      });
      setRows(customizedData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);// Fetch data on component mount

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

  //Header of list
  const headers = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'activityDefnKey', header: 'ActivityDefnKey' },
    { key: 'ellipsis', header: '' }
  ];

  // Filter rows based on search query and filter key
  const filteredRows = rows.filter(row => {
    if (!searchQuery) return true;
    if (filterKey) {
      return row[filterKey.toLowerCase()].toString().toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return Object.keys(row).some(key => row[key].toString().toLowerCase().includes(searchQuery.toLowerCase()));
    }
  });

  // Sort rows based on sort configuration
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    if (typeof valA === 'string') {
      valA = valA.toUpperCase();
    }
    if (typeof valB === 'string') {
      valB = valB.toUpperCase();
    }

    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  // Paginate the sorted rows
  const currentPageData = sortedRows.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize);

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="activities-list-container">
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <ExpandableSearch
          labelText="Search"
          placeholder="Search by Name/ Description/ ActivityDefnKey"
          onChange={event => setSearchQuery(event.target.value)}
          value={searchQuery} />
        <Button style={{ marginLeft: '8px' }} renderIcon={NewTab} href={NEW_ACTIVITY_URL}>
          New
        </Button>
        <Button kind="tertiary" style={{ marginLeft: '8px' }} renderIcon={Add}>
          Import
        </Button>
        <Dropdown
          style={{ marginLeft: '8px' }}
          id={`action-dropdown-search`}
          items={[
            { id: 'name', label: 'Name' },
            { id: 'description', label: 'Description' },
            { id: 'activityDefnKey', label: 'ActivityDefnKey' },
            { id: '', label: 'All' }
          ]}
          label="Filter Option"
          selectedItem={filterKey}
          onChange={({ selectedItem }) => setFilterKey(selectedItem.label)}
        />
      </div>
      <DataTable rows={currentPageData} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader
                    {...getHeaderProps({
                      header,
                      isSortable: header.key !== 'ellipsis'
                    })}
                    onClick={header.key !== 'ellipsis' ? () => handleSort(header.key) : undefined}
                  >
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.info.header === 'ellipsis' ? getEllipsis(cell.id) : cell.value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
      <Pagination
        itemsPerPageText=""
        totalItems={filteredRows.length}
        pageSize={pageSize}
        page={currentPage}
        pageSizes={[5, 10, 15, 25]}
        onChange={({ page, pageSize }) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}
