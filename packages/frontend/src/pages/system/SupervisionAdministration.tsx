import React, { useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { queryAllSupervisionAdministration } from '@/services/dual-random-inspection/system';

const Index: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.SupervisionAdministration>[] = [
    {
      title: '主体监管单位',
      dataIndex: 'name',
    },
    {
      title: '登陆账号',
      dataIndex: 'username',
    },
    {
      title: '登陆密码',
      dataIndex: 'password',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
    },
    {
      title: '备注',
      dataIndex: 'desc',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.SupervisionAdministration>
        headerTitle="查询结果"
        search={false}
        actionRef={actionRef}
        rowKey="_id"
        options={false}
        request={() => queryAllSupervisionAdministration('mine')}
        columns={columns}
        pagination={false}
        rowSelection={false}
      />
    </PageContainer>
  );
};

export default Index;
