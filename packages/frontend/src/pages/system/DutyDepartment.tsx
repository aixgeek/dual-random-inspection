import React, { useRef } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { queryAllDutyDepartment } from '@/services/dual-random-inspection/system';

const Index: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.DutyDepartment>[] = [
    {
      title: '部门名称',
      dataIndex: 'name',
    },
    {
      title: '主体监管单位',
      dataIndex: 'supervisionAdministration',
    },
    {
      title: '部门人数',
      dataIndex: 'count',
    },
    {
      title: '备注',
      dataIndex: 'desc',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.DutyDepartment>
        headerTitle="查询结果"
        search={false}
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={() => { }}>
            <DownloadOutlined /> 自动同步
          </Button>,
        ]}
        options={false}
        request={() => queryAllDutyDepartment('mine')}
        columns={columns}
        pagination={false}
        rowSelection={false}
      />
    </PageContainer>
  );
};

export default Index;
