import React, { useRef } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { queryIndustryType } from '@/services/dual-random-inspection/system';

type ListItem = { name: string, count: number, desc: string }

const Index: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ListItem>[] = [
    {
      title: '行业类型名称',
      dataIndex: 'name',
    },
    {
      title: '市场主体数量',
      dataIndex: 'count',
    },
    {
      title: '备注',
      dataIndex: 'desc',
    }
  ];

  return (
    <PageContainer>
      <ProTable<ListItem>
        headerTitle="查询结果"
        search={false}
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={() => { }}>
            <DownloadOutlined /> 自动同步
          </Button>,
        ]}
        request={queryIndustryType}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowSelection={false}
      />
    </PageContainer>
  );
};

export default Index;
