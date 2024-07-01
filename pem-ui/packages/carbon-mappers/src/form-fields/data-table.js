import React, { useEffect, useState } from 'react';
import { DataTable as CarbonDataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableSelectRow, TableSelectAll, Pagination, TableContainer } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE } from '../constant/form-field-type';
import { NameLabel, helperText, isRequired, labelText, pageSize, placeHolder, readOnly, selectRow, tableColumn, tableRows as tableRowsData } from '../constant';
import { DataTable as DataTableIcon } from '@carbon/icons-react';

const DataTable = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { labelText, helperText, disabled, isRequired, selectablerows, pagesize, tableRows, tableColumns, ...rest } = field;
  const [headers, setHeaders] = useState(tableColumns ? tableColumns : []);
  const [selectRow, setSelectRow] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: Number(pagesize) || 20
  });
  const dataRows = [
    {
      id: 'a',
      column0: 'Load balancer 1',
      column1: 'Disabled'
    },
    {
      id: 'b',
      column0: 'Load balancer 2',
      column1: 'Starting'
    },
    {
      id: 'c',
      column0: 'Load balancer 3',
      column1: 'Active'
    }
  ];
  //const [dataRows, setDataRows] = useState([]);
  const [rows, setRows] = useState(dataRows);

  // useEffect(()=>{
  //   setDataRows(tableRows? tableRows : []);
  //   tableRows && setRows(tableRows)
  // },[tableRows])

  useEffect(()=>{
    setHeaders(tableColumns);
  },[tableColumns])

  useEffect(()=>{
    setSelectRow(selectablerows ? selectablerows : false)
  },[selectablerows])

  useEffect(()=>{
        setPagination({
            page: 1,
            pageSize: Number(pagesize) || 20
        })
        setRows(dataRows.slice(0,Number(pagesize)))
  },[pagesize])

  useEffect(()=>{
    const endIdx = pagination.page*pagination.pageSize;
    const startIdx = endIdx - pagination.pageSize;
    setRows(dataRows.slice(startIdx,endIdx))
  },[pagination])


//   const headers = [
//     {
//       key: 'column0',
//       header: 'column0',
//     },
//     {
//       key: 'column1',
//       header: 'column1'
//     }
//   ];
  return (
    <>
      <CarbonDataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getSelectionProps }) => (
            <TableContainer title={labelText} description={helperText}>
                <Table {...getTableProps()}>
                    <TableHead>
                    <TableRow>
                        {selectRow && <TableSelectAll {...getSelectionProps()} data-testid="row-selection" />}
                        {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header, isSortable: header.sortable })}>{header.header}</TableHeader>
                        ))}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.length > 0 ? (rows.map((row) => (
                        <TableRow {...getRowProps({ row })}>
                        {selectRow && <TableSelectRow data-testid="row-selection" {...getSelectionProps({ row })} />}
                        {row.cells.map((cell) => (
                            <TableCell key={cell.id}>
                            {cell.value}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))) : <TableRow>
                        <div>No Record Found</div>
                    </TableRow> }
                    </TableBody>
                </Table>
                <Pagination
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                onChange={({ page, pageSize }) => {
                    setPagination({ page, pageSize });
                  }}
                page={pagination.page}
                pageSize={pagination.pageSize}
                pageSizes={[pagesize ? pagesize : 20]}
                size="md"
                totalItems={dataRows.length}
            />
            </TableContainer>
        )}
      </CarbonDataTable>
    </>
  );
};

export default DataTable;

// Config of Accordion for Left Palette & Right Palette
DataTable.config = {
  type: FORM_FIELD_TYPE.DATATABLE,
  label: FORM_FIELD_LABEL.DATATABLE,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <DataTableIcon />,
  editableProps: {
    Basic: [NameLabel, labelText, helperText, selectRow, pageSize, tableColumn],
    Condition: []
  },
  advanceProps: [isRequired]
};