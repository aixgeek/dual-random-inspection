import React, { useState, useRef } from 'react';
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { queryAllSupervisionAdministration, queryAllDutyDepartment } from '@/services/dual-random-inspection/system';
import { addLEO, updateLEO, queryLEOList, removeLEOList as remove } from '@/services/dual-random-inspection/dataEntry';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.LawEnforcementOfficial[]) => {
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
const handleAdd = async (fields: API.LawEnforcementOfficial) => {
  const hide = message.loading('正在添加');
  try {
    await addLEO(fields);
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
const handleUpdate = async (fields: API.LawEnforcementOfficial) => {
  const hide = message.loading('正在修改');
  try {
    await updateLEO(fields._id, fields);
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
  const [assignModalVisible, handleAssignModalVisible] = useState<boolean>(false);
  const [assignFormValues, setAssignFormValues] = useState({});
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [selectedRows, setSelectedRows] = useState<API.LawEnforcementOfficial[]>([]);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.LawEnforcementOfficial>[] = [
    {
      title: '执法人员名称',
      dataIndex: 'name',
    },
    {
      title: '身份证号',
      dataIndex: 'idNumber',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      hideInTable: true,
    },
    {
      title: '执法证信息',
      dataIndex: 'certificateInfo',
    },
    {
      title: '执法证编号',
      dataIndex: 'certificateId',
      hideInTable: true,
    },
    {
      title: '编制信息',
      dataIndex: 'budgetedPost',
    },
    {
      title: '监管单位',
      dataIndex: 'supervisionAdministration',
    },
    {
      title: '所属部门',
      valueType: 'checkbox',
      dataIndex: 'dutyDepartments',
    },
    {
      title: '备注',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
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
            await handleRemove(([] as API.LawEnforcementOfficial[]).concat(record));
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <a href="#">删除</a>
        </Popconfirm>
      ]
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.LawEnforcementOfficial>
        headerTitle="查询结果"
        search={false}
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={queryLEOList}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowSelection={{
          onChange: (_, values) => setSelectedRows(values),
        }}
        scroll={{ x: 1300 }}
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
        title="新增执法人员"
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProForm
          layout='horizontal'
          onFinish={async (fieldsValue) => {
            const success = await handleAdd(fieldsValue as API.LawEnforcementOfficial);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <ProFormText
            name="name"
            label="人员名称"
            rules={[{ required: true, message: '请输入执法人员名称！' }]}
          />
          <ProFormText
            name="idNumber"
            label="身份证号"
            rules={[{ required: true, message: '请输入身份证号！' }]}
          />
          <ProFormText
            name="certificateInfo"
            label="执法证信息"
            rules={[{ required: true, message: '请输入执法证信息！' }]}
          />
          <ProFormText
            name="certificateId"
            label="执法证编号"
            rules={[{ required: true, message: '请输入执法证编号！' }]}
          />
        </ProForm>
      </CreateForm>

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          modalVisible={updateModalVisible}
          title="修改执法人员信息"
        >
          <ProForm
            layout='horizontal'
            initialValues={updateFormValues}
            onFinish={async (fieldsValue) => {
              const success = await handleUpdate({ ...updateFormValues, ...fieldsValue } as API.LawEnforcementOfficial);
              if (success) {
                handleUpdateModalVisible(false);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
          >
            <ProFormText
              name="name"
              label="执法人员名称"
              rules={[{ required: true, message: '请输入执法人员名称！' }]}
            />
            <ProFormSelect
              name="sex"
              label="性别"
              valueEnum={{
                0: '男',
                1: '女',
              }}
              rules={[{ required: true, message: '请选择性别！' }]}
            />
            <ProFormText
              name="idNumber"
              label="身份证号"
              rules={[{ required: true, message: '请输入身份证号！' }]}
            />

            <ProFormText
              name="certificateInfo"
              label="执法证信息"
              rules={[{ required: true, message: '请输入执法证信息！' }]}
            />
            <ProFormText
              name="certificateId"
              label="执法证编号"
              rules={[{ required: true, message: '请输入执法证编号！' }]}
            />
            <ProFormText
              name="budgetedPost"
              label="编制信息"
              rules={[{ required: true, message: '请输入编制信息！' }]}
            />
            <ProFormSelect
              name="supervisionAdministration"
              label="监管单位"
              request={async () => {
                const { data } = await queryAllSupervisionAdministration('normal')
                const select = data.map((result: { name: string, _id: string }) => {
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
            <ProFormSelect
              required
              name="dutyDepartment"
              label="分管部门"
              request={async () => {
                const { data } = await queryAllDutyDepartment('normal')
                const select = data.map((result: { name: string; _id: string; }) => {
                  return {
                    key: result._id,
                    label: result.name,
                    value: result.name,
                  }
                })
                return select
              }}
              placeholder="请选择执法人员分管部门"
              rules={[{ required: true, message: '请选择执法人员分管部门' }]}
            />
            <ProFormTextArea name="desc" label="备注" />
          </ProForm>
        </UpdateForm>
      ) : null}
    </PageContainer>
  );
};

export default Index;
