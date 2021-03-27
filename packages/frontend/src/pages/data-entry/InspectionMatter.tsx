import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { queryAllSupervisionAdministration, queryAllDutyDepartment } from '@/services/dual-random-inspection/system';
import { addIM as add, updateIM as update, queryIMList, removeIMList as remove } from '@/services/dual-random-inspection/dataEntry';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.InspectionMatter[]) => {
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
const handleAdd = async (fields: API.InspectionMatter) => {
  const hide = message.loading('正在添加');
  try {
    await add(fields);
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
const handleUpdate = async (fields: API.InspectionMatter) => {
  const hide = message.loading('正在修改');
  try {
    await update(fields._id, fields);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const IMList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [selectedRows, setSelectedRows] = useState<API.InspectionMatter[]>([]);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.InspectionMatter>[] = [
    {
      title: '抽查事项',
      dataIndex: 'name',
    },
    {
      title: '抽查内容',
      dataIndex: 'content',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '抽查依据',
      dataIndex: 'legalBasis',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '抽查主体',
      dataIndex: 'supervisionAdministration',
      hideInTable: true,
    },
    {
      title: '抽查对象',
      dataIndex: 'object',
      ellipsis: true
    },
    {
      title: '抽查方式',
      dataIndex: 'method',
    },
    {
      title: '抽查比例',
      dataIndex: 'proportion',
    },
    {
      title: '抽查频次',
      dataIndex: 'frequency',
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
      width: 80,
      render: (_, record) => (
        <a
          onClick={() => {
            handleUpdateModalVisible(true);
            setUpdateFormValues(record);
          }}
        >
          修改
        </a>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.InspectionMatter>
        headerTitle="查询结果"
        search={false}
        actionRef={actionRef}
        rowKey="_id"
        options={false}
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params) => queryIMList('normal', params)}
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
        title="新增抽查事项"
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProForm
          onFinish={async (fieldsValue) => {
            const success = await handleAdd(fieldsValue as API.InspectionMatter);
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
            label="抽查事项名称"
            rules={[{ required: true, message: '请输入抽查事项名称！' }]}
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
          title="修改抽查事项信息"
        >
          <ProForm
            initialValues={updateFormValues}
            onFinish={async (fieldsValue) => {
              const success = await handleUpdate({ ...updateFormValues, ...fieldsValue } as API.InspectionMatter);
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
              name="inspectedMatter"
              label="抽查事项名称"
              rules={[{ required: true, message: '请输入抽查事项名称！' }]}
            />
            <ProFormTextArea name="desc" label="备注" />
          </ProForm>
        </UpdateForm>
      ) : null}
    </PageContainer>
  );
};

export default IMList;
