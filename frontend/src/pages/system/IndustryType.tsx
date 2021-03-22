import React, { useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { IndustryTypeListItem as T } from './data';
import { queryIndustryType } from './service';

const IndustryTypeList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<T>[] = [
    {
      title: '行业类型名称',
      dataIndex: 'name',
    },
    {
      title: '市场主体数量',
      dataIndex: 'count',
      hideInForm: true,
    },
    {
      title: '主体监管单位',
      dataIndex: 'supervisionAdministration',
      hideInForm: true,
    },
    {
      title: '分管执法部门',
      dataIndex: 'dutyDepartment',
    },
    {
      title: '备注',
      dataIndex: 'desc',
    },
  ];

  return (
    <PageContainer>
      <ProTable<T>
        headerTitle="查询结果"
        search={false}
        actionRef={actionRef}
        rowKey="key"
        // TODO
        options={false}
        request={() => queryIndustryType()}
        columns={columns}
        pagination={false}
        rowSelection={false}
      />
    </PageContainer>
  );
};

export default IndustryTypeList;
