import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, message } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { IMListItem } from './data';
import { queryIMList } from './service';

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: IMListItem[]) => {
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
const handleAdd = async (fields: IMListItem) => {
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

const IMList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [selectedRows, setSelectedRows] = useState<IMListItem[]>([]);
  const [row, setRow] = useState<IMListItem>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IMListItem>[] = [
    {
      title: '抽查事项',
      dataIndex: 'name',
      render: (dom, record) => {
        return <a onClick={() => setRow(record)}>{dom}</a>;
      },
      width: 200,
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
      width: 200,
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
      <ProTable<IMListItem>
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
        request={(params, sorter, filter) => queryIMList({ ...params, sorter, filter })}
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
        title="新增抽查事项"
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
              name="inspectedMatter"
              label="抽查事项名称"
              rules={[{ required: true, message: '请输入抽查事项名称！' }]}
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
        width={300}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<IMListItem>
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

export default IMList;
