import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, message } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { LEOListItem } from './data';
import { queryLEOList } from './service';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: LEOListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    console.log(selectedRows);
    //   await removeList({
    //     key: selectedRows.map((row) => row.key),
    //   });
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
const handleAdd = async (fields: LEOListItem) => {
  const hide = message.loading('正在添加');
  try {
    console.log(fields);
    //   await addRule({ ...fields });
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
const handleUpdate = async (fields: {}) => {
  const hide = message.loading('正在修改');
  try {
    console.log(fields);
    // await updateRule({ ...fields });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const LEOList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [selectedRows, setSelectedRows] = useState<LEOListItem[]>([]);
  const [row, setRow] = useState<LEOListItem>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<LEOListItem>[] = [
    {
      title: '执法人员名称',
      dataIndex: 'name',
      render: (dom, record) => {
        return <a onClick={() => setRow(record)}>{dom}</a>;
      },
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
      title: '监管单位',
      dataIndex: 'supervisionAdministration',
    },
    {
      title: '所属部门',
      dataIndex: 'dutyDepartment',
    },
    {
      title: '编制信息',
      dataIndex: 'budgetedPost',
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
      <ProTable<LEOListItem>
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
        request={(params, sorter, filter) => queryLEOList({ ...params, sorter, filter })}
        columns={columns}
        pagination={{ simple: true }}
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
          onFinish={async (fieldsValue) => {
            const success = await handleAdd(fieldsValue);
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
            label="执法人员名称"
            rules={[{ required: true, message: '请输入执法人员名称！' }]}
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
            initialValues={updateFormValues}
            onFinish={async (fieldsValue) => {
              const success = await handleUpdate({ ...updateFormValues, ...fieldsValue });
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
            <ProFormText
              name="usci"
              label="统一信用代码"
              rules={[{ required: true, message: '请输入统一信用代码！' }]}
            />
            <ProFormText
              name="legalRepresentative"
              label="法人代表"
              rules={[{ required: true, message: '请输入法人代表！' }]}
            />
            <ProFormSelect
              name="flag"
              label="检查状态"
              valueEnum={{
                0: '正常',
                1: '异常',
              }}
              rules={[{ required: true, message: '请选择检查状态！' }]}
            />
            <ProFormTextArea name="desc" label="备注" />
          </ProForm>
        </UpdateForm>
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
          <ProDescriptions<LEOListItem>
            column={1}
            title={row?.name}
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
    </PageContainer>
  );
};

export default LEOList;
