import { history } from 'umi';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { downloadFile } from '@/utils/cloudbase'
import { queryDoubleRandomInspection } from '@/services/dual-random-inspection/doubleRadomInspection'
import { exportDoubleRandomResultByDRIs } from '@/services/dual-random-inspection/doubleRandomResult';
import { DoubleRandomInspection as ListItem } from '../data';

/**
 *  导出节点
 * @param selectedRows
 */
const handleExport = async (selectedRows: ListItem[]) => {
  const hide = message.loading('正在导出');
  if (!selectedRows) return true;
  try {
    const { data } = await exportDoubleRandomResultByDRIs({
      doubleRandomIds: selectedRows.map((row) => row._id),
    });
    hide();
    await downloadFile(data.fileID)
    message.success('导出成功');
    return true;
  } catch (error) {
    message.error('导出失败，请重试');
    return false;
  }
};

const Index: React.FC<{}> = () => {
  const [exporting, setExporting] = useState(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<ListItem[]>([]);
  const columns: ProColumns<ListItem>[] = [
    {
      title: '抽查事项',
      tip: '详情见随机抽查事项清单',
      dataIndex: 'inspectionMatters',
      width: 350,
      render: (dom, record) => {
        return <div>{(dom as { _id: string, name: string }[]).map(d => d.name).join(',')}</div>;
      },
    },
    {
      title: '市场主体类型',
      dataIndex: 'industryTypes',
      render: (dom) => {
        return <div>{(dom as { _id: string, name: string }[]).map(d => d.name).join(',')}</div>;
      },
    },
    {
      title: '数量',
      dataIndex: 'inspectionAmount',
    },
    {
      title: '主管单位',
      dataIndex: 'supervisionAdministrations',
      render: (dom) => {
        return <div>{(dom as string[]).join(',')}</div>;
      }
    },
    {
      title: '分管部门',
      dataIndex: 'dutyDepartments',
      render: (dom) => {
        return <div>{(dom as { _id: string, name: string }[]).map(d => d.name).join(',')}</div>;
      }
    },
    {
      title: '检查日期',
      dataIndex: 'inspectedAt',
      valueType: 'date',
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      valueType: 'date',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <a onClick={() => history.push(`/double-random/normalHistory/${record._id}`)}>查看详情</a>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<ListItem>
        headerTitle="查询结果"
        rowKey="_id"
        actionRef={actionRef}
        search={false}
        request={(params) => queryDoubleRandomInspection(params, 'normal')}
        columns={columns}
        rowSelection={{ onChange: (_, selectedRows) => setSelectedRows(selectedRows) }}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1440 }}
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
            loading={exporting}
            onClick={async () => {
              setExporting(true)
              await handleExport(selectedRowsState);
              setExporting(false)
            }}
          >
            批量导出
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default Index;
