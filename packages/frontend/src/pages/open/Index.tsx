import React, { useEffect, useState } from 'react';
import { Card, Table, Descriptions, Input, Row, Col, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import Footer from '@/components/Footer';
import { queryDoubleRandomResultByOpen, queryMarketParticipantWithDRR } from '@/services/dual-random-inspection/doubleRandomResult';

import styles from './index.less';

const data = [
  {
    key: '无记录',
    name: '无记录',
    age: '无记录',
    address: '无记录',
  },
];

export default (): React.ReactNode => {
  const [search, setSearch] = useState<string>();
  const [marketParticipant, setMarketParticipant] = useState<API.MarketParticipant>()

  useEffect(() => {
    const fetchSearch = async (search: string) => {
      const { data } = await queryMarketParticipantWithDRR({ search })
      setMarketParticipant(data)
    }
    search && fetchSearch(search)
  }, [search])

  const columns: ProColumns<API.DualRandomResult>[] = [
    {
      title: '市场主体名称',
      dataIndex: 'marketParticipant',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '未检查', status: 'Default' },
        1: { text: '责令整改', status: 'Processing' },
        2: { text: '正常', status: 'Success' },
        3: { text: '异常', status: 'Error' },
      },
    },
    {
      title: '联系地址',
      dataIndex: 'marketParticipantAddress',
    },
    {
      title: '主管单位',
      dataIndex: 'supervisionAdministrations',
      render: (dom) => {
        return <div>{(dom as string[]).join(',')}</div>;
      }
    },
    {
      title: '抽查事项',
      tip: '详情见随机抽查事项清单',
      dataIndex: 'inspectionMatters',
      render: (dom) => {
        return <div>{(dom as { _id: string, name: string }[]).map(d => d.name).join(',')}</div>;
      }
    },
    {
      title: '执法检查人员',
      dataIndex: 'lawEnforcementOfficials',
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
      title: '检查记录',
      dataIndex: 'desc',
      valueType: 'textarea',
      renderText: (value) => { return value ? value : '' }
    }
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
                  <Descriptions.Item label="名称" span={3}>{search}</Descriptions.Item>
                  <Descriptions.Item label="状态" span={3}>
                    <Tag icon={<CheckCircleOutlined />} color="success">正常</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="双随机抽查记录" span={3}>
                    <Table bordered pagination={false} columns={[
                      {
                        title: '抽查事项',
                        dataIndex: 'age',
                        key: 'age',
                        ellipsis: true,
                      },
                      {
                        title: '抽查时间',
                        dataIndex: 'address',
                        key: 'address',
                      },
                      {
                        title: '检查结果',
                        dataIndex: 'address',
                        key: 'address',
                      },
                      {
                        title: '备注',
                        dataIndex: 'address',
                        key: 'address',
                      }
                    ]} dataSource={data} />
                  </Descriptions.Item>
                </Descriptions>
              )
            }
            {
              !search && (
                <ProTable<API.DualRandomResult>
                  headerTitle='双随机抽查记录'
                  search={false}
                  rowKey="_id"
                  request={queryDoubleRandomResultByOpen}
                  columns={columns}
                  rowSelection={false}
                  pagination={{ position: ['bottomCenter'], pageSize: 10 }}
                />)
            }
          </Col>
        </Row>
      </Card>
      <Footer />
    </div>
  );
};
