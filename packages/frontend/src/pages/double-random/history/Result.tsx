import { useParams } from 'umi';
import { message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryDoubleRandomResultByDRI, updateDoubleRandomResult } from '@/services/dual-random-inspection/doubleRandomResult'
import UpdateForm from './components/UpdateForm';
import { DoubleRandomResult as ListItem } from '../data';

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (id: string, fields: Partial<API.DualRandomResult>) => {
  const hide = message.loading('正在录入');
  try {
    hide();
    await updateDoubleRandomResult(id, fields)
    message.success('录入成功');
    return true;
  } catch (error) {
    message.error('录入失败请重试！');
    return false;
  }
};

const Index: React.FC<{}> = () => {
  const { id } = useParams() as { id: string };
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<ListItem>();
  const columns: ProColumns<ListItem>[] = [
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
      title: '执法检查人员',
      dataIndex: 'lawEnforcementOfficials',
      render: (dom) => {
        return <div>{(dom as { _id: string, name: string }[]).map(d => d.name).join(',')}</div>;
      }
    },
    {
      title: '抽查事项',
      tip: '详情见随机抽查事项清单',
      dataIndex: 'inspectionMatters',
      width: 350,
      render: (dom) => {
        return <div>{(dom as { _id: string, name: string }[]).map(d => d.name).join(',')}</div>;
      }
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
      title: '备注',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <a
          onClick={() => {
            handleUpdateModalVisible(true);
            setUpdateFormValues(record);
          }}
        >
          录入检查信息
        </a>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<ListItem>
        headerTitle="查询结果"
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        request={(params) => queryDoubleRandomResultByDRI(params, id)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1440 }}
      />

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onSubmit={async (id, value) => {
            const success = await handleUpdate(id, value);
            if (success) {
              handleUpdateModalVisible(false);
              setUpdateFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={updateFormValues}
        />
      ) : null}

      <Drawer
        width={500}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?._id && (
          <ProDescriptions<ListItem>
            column={1}
            title={row?.marketParticipant}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?._id,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Index;
