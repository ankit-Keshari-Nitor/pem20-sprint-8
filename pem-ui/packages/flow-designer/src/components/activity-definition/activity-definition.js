import React, { useState } from 'react';
import {
  ExpandableSearch,
  Dropdown,
  Button,
  Pagination,
  Tag,
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
import { CheckmarkFilled, NewTab, Add } from '@carbon/icons-react';
import './activity-definition.scss';

export default function ActivityDefinition() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const getStatusIcon = (encrypted) => {
    return (
      <span>
        <CheckmarkFilled style={{ fill: 'blue' }} /> {encrypted}
      </span>
    );
  };

  const getTag = (status) => {
    return (
      <Tag className="some-class" type={status === 'Completed' ? 'green' : 'gray'}>
        {status}
      </Tag>
    );
  };

  const getEllipsis = (i) => {
    return (
      <OverflowMenu size="sm" flipped className="always-visible-overflow-menu">
        <OverflowMenuItem itemText="Edit" />
        <OverflowMenuItem itemText="Export" />
        <OverflowMenuItem itemText="Save as" />
        <OverflowMenuItem itemText="Shared/Unshared" />
        <OverflowMenuItem itemText="Deavtivate" />
        <OverflowMenuItem itemText="Delete" />
      </OverflowMenu>
    );
  };

  const generateData = (count) => {
    let data = [];
    for (let i = 1; i <= count; i++) {
      const name = `Load balancer ${i}`;
      data.push({
        id: `id_${i}`,
        name: name,
        encrypted: getStatusIcon('Yes'),
        status: i % 2 === 0 ? 'Completed' : 'Pending',
        migrationstatus: i % 2 === 0 ? 'Completed' : 'Pending',
        version: 'Ver.3',
        actions: i % 2 === 0 ? 'View' : 'Rollout',
        ellipsis: getEllipsis(i)
      });
    }
    return data;
  };

  const [rows, setRows] = useState(generateData(100));

  const headers = [
    { key: 'name', header: 'Name' },
    { key: 'encrypted', header: 'Encrypted' },
    { key: 'status', header: 'Status' },
    { key: 'migrationstatus', header: 'Migration Status' },
    { key: 'version', header: 'Version' },
    { key: 'actions', header: 'Actions' },
    { key: 'ellipsis', header: '' }
  ];

  const actionOptions = [
    { id: 'view', label: 'View' },
    { id: 'test', label: 'Test ' },
    { id: 'rollout', label: 'Rollout' },
    { id: 'mark as final', label: 'Mark as Final' }
  ];

  const filteredRows = rows.filter((row) => {
    if (!searchQuery) return true;
    if (filterKey) {
      return row[filterKey].toString().toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return Object.keys(row).some((key) => row[key].toString().toLowerCase().includes(searchQuery.toLowerCase()));
    }
  });

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

  const currentPageData = sortedRows.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDropdownChange = (rowId, selectedItem) => {
    const newRows = rows.map((row) => {
      if (row.id === rowId) {
        return { ...row, actions: selectedItem.label };
      }
      return row;
    });
    setRows(newRows);
  };

  return (
    <div className="activities-list-container">
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <ExpandableSearch labelText="Search" placeholder="Search by name" onChange={(event) => setSearchQuery(event.target.value)} value={searchQuery} />
        <Button style={{ marginLeft: '8px' }} renderIcon={NewTab}>
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
            { id: 'status', label: 'Status' },
            { id: 'migrationstatus', label: 'Migration Status' },
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
                      isSortable: header.key !== 'ellipsis' // Make header not sortable if it's the ellipsis column
                    })}
                    onClick={header.key !== 'ellipsis' ? () => handleSort(header.key) : undefined} // Prevent sorting function call for ellipsis column
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
                      {cell.info.header === 'status' || cell.info.header === 'migrationstatus' ? (
                        getTag(cell.value)
                      ) : cell.info.header === 'actions' ? (
                        <Dropdown
                          id={`action-dropdown-${cell.id}`}
                          items={actionOptions}
                          label="Choose an action"
                          selectedItem={actionOptions.find((option) => option.label === cell.value)}
                          itemToString={(item) => (item ? item.label : '')}
                          onChange={({ selectedItem }) => handleDropdownChange(row.id, selectedItem)}
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
