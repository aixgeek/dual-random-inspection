import { history } from 'umi';
import { Button, Drawer, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ListItem } from './data';
import { queryList, exportList } from './service';
// import { downloadFile } from '@/utils'

/**
 *  导出节点
 * @param selectedRows
 */
const handleExport = async (selectedRows: ListItem[]) => {

  const hide = message.loading('正在导出');
  if (!selectedRows) return true;
  try {
    const { data } = await exportList({
      ids: selectedRows.map((row) => row._id),
    });
    await downloadFile(data.fileID)
    hide();
    message.success('导出成功');
    return true;
  } catch (error) {
    hide();
    message.error('导出失败，请重试');
    return false;
  }
};

const List: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<ListItem>();
  const [selectedRowsState, setSelectedRows] = useState<ListItem[]>([]);
  const columns: ProColumns<ListItem>[] = [
    {
      title: '抽查事项',
      tip: '详情见随机抽查事项清单',
      dataIndex: 'inspectionMatter',
      width: 350,
      fieldProps: {
        rules: [
          {
            required: true,
            message: '抽查事项为必填项',
          },
        ],
      },
      render: (dom, record) => {
        return <a onClick={() => setRow(record)}>{dom}</a>;
      },
    },
    {
      title: '市场主体类型',
      dataIndex: 'industryType',
      width: 300,
      search: true,
    },
    {
      title: '抽查数量',
      dataIndex: 'inspectionAmount',
      search: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      valueType: 'date',
    },
    {
      title: '监管单位',
      dataIndex: 'supervisionAdministration',
      search: true,
      hideInTable: true,
    },
    {
      title: '分管部门',
      dataIndex: 'dutyDepartment',
      search: true,
      hideInTable: true,
    },
    {
      title: '检查日期',
      dataIndex: 'inspectedAt',
      valueType: 'date',
    },
    {
      title: '备注',
      dataIndex: 'desc',
      valueType: 'textarea',
      search: true,
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <>
          <a onClick={() => history.push(`/double-random/history/${record._id}`)}>查看详情</a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<ListItem>
        headerTitle="查询结果"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        request={(params, sorter, filter) => queryList({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{ simple: true }}
        scroll={{ x: 1300 }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
              <span>
                抽查市场主体数量总计{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.inspectionAmount, 0)} 家
              </span>
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleExport(selectedRowsState);
            }}
          >
            批量导出
          </Button>
        </FooterToolbar>
      )}

      <Drawer
        width={350}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.inspectionMatter && (
          <ProDescriptions<ListItem>
            column={1}
            title={row?.inspectionMatter}
            request={async () => ({
              data: row || {},
            })}
            params={{
              key: row?._id,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default List;
