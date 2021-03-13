import React, { useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { SupervisionAdministrationListItem } from './data';
import { querySupervisionAdministration } from './service';

const expandedRowRender = (props: SupervisionAdministrationListItem) => {
  const { dutyDepartment } = props;
  return (
    <ProTable
      columns={[
        { title: '分管部门', dataIndex: 'name', key: 'name' },
        { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson' },
        { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone' },
      ]}
      key="key"
      headerTitle={false}
      search={false}
      options={false}
      dataSource={dutyDepartment}
      pagination={false}
    />
  );
};

const SupervisionAdministrationList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<SupervisionAdministrationListItem>[] = [
    {
      title: '主体监管单位',
      dataIndex: 'name',
      hideInForm: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
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
      title: '备注',
      dataIndex: 'desc',
    },
  ];

  return (
    <PageContainer>
      <ProTable<SupervisionAdministrationListItem>
        headerTitle="查询结果"
        search={false}
        actionRef={actionRef}
        rowKey="_id"
        options={false}
        request={() => querySupervisionAdministration()}
        columns={columns}
        expandable={{
          rowExpandable: (record) => record.dutyDepartment.length > 0,
          expandedRowRender: (record) => expandedRowRender(record),
        }}
        pagination={false}
        rowSelection={false}
      />
    </PageContainer>
  );
};

export default SupervisionAdministrationList;
