import { Table } from 'antd'
import React from 'react'
import Loading from '../LoadingComponent/Loading';

const TableComponent= (props) => {
    const { selectionType = 'checkbox', data=[], isPending=false, columns =[] } = props
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disable User',
            name: record.name
        })
    };
return (
    <Loading isPending={isPending}>
      <Table
        rowSelection={{ type: selectionType, ...rowSelection }}
        columns={columns}
        dataSource={data}
        {...props}
        />
    </Loading>    
  )
}

export default TableComponent