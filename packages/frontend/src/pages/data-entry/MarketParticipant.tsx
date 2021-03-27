import React, { useState, useRef } from 'react';
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea, ProFormRadio } from '@ant-design/pro-form';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { addMP, updateMP, queryMPList, removeMPList as remove } from '@/services/dual-random-inspection/dataEntry';
import {
  queryAllSupervisionAdministration,
  queryAllIndustryType,
} from '@/services/dual-random-inspection/system';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const MPForm = <><ProFormText
  name="name"
  required
  label="市场主体名称"
  rules={[{ required: true, message: '请输入市场主体名称！' }]}
/>
  <ProFormText
    name="usci"
    required
    label="统一信用代码"
    rules={[{ required: true, message: '请输入统一信用代码！' }]}
  />
  <ProFormSelect
    required
    name="industryTypes"
    label="行业类型"
    request={async () => {
      const { data } = await queryAllIndustryType('normal')
      const select = data.map((result: { name: string; _id: string; }) => {
        return {
          key: result._id,
          label: result.name,
          value: result.name,
        }
      })
      return select
    }}
    fieldProps={{
      mode: 'multiple',
      optionFilterProp: 'label',
    }}
    placeholder="请选择行业类型"
    rules={[{ required: true, message: '请选择行业类型', type: 'array' }]}
  />
  <ProFormSelect
    required
    name="supervisionAdministration"
    label="监管单位"
    request={async () => {
      const { data } = await queryAllSupervisionAdministration('normal')
      const select = data.map((result: { name: string; _id: string; }) => {
        return {
          key: result._id,
          label: result.name,
          value: result.name,
        }
      })
      return select
    }}
    placeholder="请选择监管单位"
    rules={[{ required: true, message: '请选择监管单位' }]}
  />
  <ProFormText
    name="legalRepresentative"
    required
    label="法人代表"
    rules={[{ required: true, message: '请输入法人代表！' }]}
  />
  <ProFormText
    name="address"
    required
    label="经营地址"
    rules={[{ required: true, message: '请输入经营地址！' }]}
  />
  <ProFormText
    name="contact"
    required
    label="联系方式"
    rules={[{ required: true, message: '请输入联系方式！' }]}
  />
  <ProFormRadio.Group
    name="flag"
    required
    label="市场主体状态"
    radioType="button"
    options={[
      {
        label: '禁用',
        value: 0,
      },
      {
        label: '正常',
        value: 1,
      },
      {
        label: '异常',
        value: 2,
      },
    ]}
  />
  <ProFormTextArea name="desc" label="备注" /></>

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.MarketParticipant[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await remove({
      ids: selectedRows.map((row) => row._id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.MarketParticipant) => {
  const hide = message.loading('正在添加');
  try {
    await addMP(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: API.MarketParticipant) => {
  const hide = message.loading('正在修改');
  try {
    await updateMP(fields._id, fields);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const Index: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [selectedRows, setSelectedRows] = useState<API.MarketParticipant[]>([]);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.MarketParticipant>[] = [
    {
      title: '市场主体名称',
      dataIndex: 'name',
    },
    {
      title: '统一信用代码',
      dataIndex: 'usci',
      search: false
    },
    {
      title: '法人代表',
      dataIndex: 'legalRepresentative',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      search: false
    },
    {
      title: '经营地址',
      dataIndex: 'address',
    },
    {
      title: '行业类型',
      dataIndex: 'industryTypes',
      valueType: 'checkbox',
      search: false
    },
    {
      title: '监管单位',
      dataIndex: 'supervisionAdministration',
      hideInTable: true,
      search: false
    },
    {
      title: '备注',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInTable: true,
      search: false
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => [
        <a
          key='update'
          onClick={() => {
            handleUpdateModalVisible(true);
            setUpdateFormValues(record);
          }}
        >修改</a>,
        <Popconfirm
          key='delete'
          title="您确定要删除？"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            await handleRemove(([] as API.MarketParticipant[]).concat(record));
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <a href="#">删除</a>
        </Popconfirm>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.MarketParticipant>
        headerTitle="查询结果"
        rowKey="_id"
        search={{
          labelWidth: 'auto',
        }}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params) => queryMPList('normal', params)}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowSelection={{
          onChange: (_, values) => setSelectedRows(values),
        }}
        scroll={{ x: 1440 }}
      />

      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项
            </div>
          }
        >
          <Button
            type="primary"
            danger
            onClick={async () => {
              await handleRemove(selectedRows);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <CreateForm
        title="新增市场主体"
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProForm
          layout='horizontal'
          onFinish={async (fieldsValue) => {
            const success = await handleAdd(fieldsValue as API.MarketParticipant);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          initialValues={{
            flag: 1
          }}
        >
          {MPForm}
        </ProForm>
      </CreateForm>

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          modalVisible={updateModalVisible}
          title="修改市场主体信息"
        >
          <ProForm
            layout='horizontal'
            initialValues={updateFormValues}
            onFinish={async (fieldsValue) => {
              const success = await handleUpdate({ ...updateFormValues, ...fieldsValue } as API.MarketParticipant);
              if (success) {
                handleUpdateModalVisible(false);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
          >
            {MPForm}
          </ProForm>
        </UpdateForm>
      ) : null}
    </PageContainer>
  );
};

export default Index;
