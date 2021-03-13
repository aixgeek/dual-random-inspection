import React, { useState } from 'react';
import { Link } from 'umi';
import { Drawer } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import Footer from '@/components/Footer';
import { queryResultListInOpen } from './service';
import { ResultListItem } from './data';
import styles from './style.less';

const Open: React.FC<{}> = () => {
  const [row, setRow] = useState<ResultListItem>();
  const columns: ProColumns<ResultListItem>[] = [
    {
      title: '市场主体名称',
      dataIndex: 'marketParticipant',
      fieldProps: {
        rules: [
          {
            required: true,
            message: '市场主体名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '主管单位',
      dataIndex: 'supervisionAdministration',
      search: true,
    },
    {
      title: '执法检查人员',
      dataIndex: 'lawEnforcementOfficial',
      search: true,
    },
    {
      title: '抽查事项',
      tip: '详情见随机抽查事项清单',
      dataIndex: 'inspectionMatter',
      width: 350,
      search: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      sorter: true,
      hideInForm: true,
      search: true,
      valueType: 'date',
    },
    {
      title: '检查日期',
      dataIndex: 'inspectedAt',
      sorter: true,
      valueType: 'date',
      hideInForm: true,
      search: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      search: true,
      valueEnum: {
        0: { text: '未检查', status: 'Default' },
        1: { text: '责令整改', status: 'Processing' },
        2: { text: '正常', status: 'Success' },
        3: { text: '异常', status: 'Error' },
      },
    },
    {
      title: '备注',
      dataIndex: 'desc',
      valueType: 'textarea',
      search: true,
      hideInForm: true,
      hideInTable: true,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <span className={styles.title}>万宁市双随机一公开公示平台</span>
            </Link>
          </div>
          <div className={styles.desc}>
            “双随机、一公开”，即在监管过程中随机抽取检查对象，随机选派执法检查人员，抽查情况及查处结果及时向社会公开
          </div>
        </div>
      </div>
      <ProTable<ResultListItem>
        rowKey="_id"
        search={false}
        options={false}
        request={(params, sorter, filter) => queryResultListInOpen({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={false}
        pagination={{ simple: true }}
        scroll={{ x: 1400 }}
      />
      <Drawer
        width={350}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.inspectionMatter && (
          <ProDescriptions<ResultListItem>
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
      <Footer />
    </div>
  );
};

export default Open;
