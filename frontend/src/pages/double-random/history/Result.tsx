import { useParams } from 'umi';
import { message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { ResultListItem } from './data';
import { queryResultList, updateResult } from './service';

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: {}) => {
  const hide = message.loading('正在录入');
  try {
    updateResult(fields);
    hide();
    message.success('录入成功');
    return true;
  } catch (error) {
    hide();
    message.error('录入失败请重试！');
    return false;
  }
};

const Result: React.FC<{}> = () => {
  const urlParams = useParams();
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
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
      <ProTable<ResultListItem>
        headerTitle="查询结果"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        request={(params, sorter, filter) =>
          queryResultList({ ...urlParams, ...params, sorter, filter })
        }
        columns={columns}
        rowSelection={false}
        pagination={{ simple: true }}
        scroll={{ x: 1300 }}
      />

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
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
        width={350}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?._id && (
          <ProDescriptions<ResultListItem>
            column={1}
            title={row?.marketParticipant}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.marketParticipant,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Result;
