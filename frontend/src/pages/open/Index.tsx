import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Drawer } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { Card, Alert, Typography, Descriptions, Input, Row, Col, Badge } from 'antd';
import Footer from '@/components/Footer';
import { ResultListItem } from './data';
import { queryDoubleRandomResultByOpen } from './service';
import { findMarketParticipantWithDRR } from '@/services/swagger/open';
import styles from './index.less';

const columns: ProColumns<API.RuleListItem>[] = [
  {
    title: '市场主体名称',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '法人代表',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '抽查事项',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '监管单位',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '执法人员',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '检查时间',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '检查记录',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '市场主体状态',
    dataIndex: 'status',
    hideInForm: true,
    valueEnum: {
      0: {
        text: '关闭',
        status: 'Default',
      },
      1: {
        text: '运行中',
        status: 'Processing',
      },
      2: {
        text: '已上线',
        status: 'Success',
      },
      3: {
        text: '异常',
        status: 'Error',
      },
    },
  }
];

export default (): React.ReactNode => {
  const [row, setRow] = useState<ResultListItem>();
  const [search, setSearch] = useState<string>();
  const [marketParticipant, setMarketParticipant] = useState<API.MarketParticipant>()

  useEffect(() => {
    const fetchSearch = async (search: string) => {
      const { data } = await findMarketParticipantWithDRR({ info: search })
      setMarketParticipant(data)
    }
    search && fetchSearch(search)
  }, [search])

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
    },
    {
      title: '执法检查人员',
      dataIndex: 'lawEnforcementOfficial',
    },
    {
      title: '抽查事项',
      tip: '详情见随机抽查事项清单',
      dataIndex: 'inspectionMatter',
      width: 350,
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      sorter: true,
      hideInForm: true,
      valueType: 'date',
    },
    {
      title: '检查日期',
      dataIndex: 'inspectedAt',
      sorter: true,
      valueType: 'date',
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
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
      hideInForm: true,
      hideInTable: true,
    },
  ];

  return (
    <div className={styles.container}>
      <Card
        title='万宁市双随机一公开抽查公示平台'
        headStyle={{ display: 'flex', justifyContent: 'center', fontWeight: 'bolder', fontSize: 30 }}
        style={{ height: '100vh' }}
      >
        <Row>
          <Col span={12} offset={6}>
            <Input.Search
              placeholder="请输入企业名称、统一社会信用代码或注册号"
              allowClear
              enterButton="查 询"
              size="large"
              onSearch={(value) => { setSearch(value) }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {
              search && marketParticipant && (
                <Descriptions title="市场主体信息" bordered>
                  <Descriptions.Item label="名称" span={3}>{marketParticipant.name}</Descriptions.Item>
                  <Descriptions.Item label="法人代表">{marketParticipant.legalRepresentative}</Descriptions.Item>
                  <Descriptions.Item label="联系方式" span={2}>{marketParticipant.contact}</Descriptions.Item>
                  <Descriptions.Item label="联系地址" span={3}>{marketParticipant.address}</Descriptions.Item>
                  <Descriptions.Item label="双随机抽查状态" span={3}>
                    <Badge status="error" text="异常" />
                  </Descriptions.Item>
                  <Descriptions.Item label="抽查记录" span={3}>某某原因无法联系到企业负责人</Descriptions.Item>
                </Descriptions>
              )
            }
            {
              !search && (
                <ProTable<ResultListItem>
                  headerTitle='双随机抽查记录'
                  search={false}
                  rowKey="_id"
                  toolBarRender={() => []}
                  request={queryDoubleRandomResultByOpen}
                  columns={columns}
                  rowSelection={false}
                  pagination={{ position: ['bottomCenter'], pageSize: 8 }}
                />)
            }
          </Col>
        </Row>
      </Card>
      <Footer />
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
    </div>
  );
};
