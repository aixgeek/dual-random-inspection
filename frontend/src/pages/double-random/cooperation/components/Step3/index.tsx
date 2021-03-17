import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { Form, Button, Select, InputNumber, Divider } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { LEOListItem } from '@/pages/data-entry/data';
import { queryLEOList } from '@/pages/data-entry/service';
import { StateType } from '../../model';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

interface StepProps {
  stepForm?: StateType['stepForm'];
  dutyDepartments?: StateType['dutyDepartments'];
  dispatch?: Dispatch;
}

const Step3: React.FC<StepProps> = (props) => {
  const { stepForm, dispatch, dutyDepartments } = props;
  const [searchResultVisible, setSearchResultVisible] = useState<boolean>(false);
  const [selectedDutyDepartment, setSelectedDutyDepartment] = useState<[]>();
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();
  const { validateFields, getFieldsValue } = form;
  const columns: ProColumns<LEOListItem>[] = [
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
      title: '所属监管单位',
      dataIndex: 'supervisionAdministration',
      hideInTable: true,
    },
    {
      title: '所属分管部门',
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
  ];

  const onPrev = () => {
    if (dispatch) {
      const values = getFieldsValue();
      dispatch({
        type: 'double_random_start/saveStepFormData',
        payload: {
          ...stepForm,
          ...values,
        },
      });
      dispatch({
        type: 'double_random_start/saveCurrentStep',
        payload: 1,
      });
    }
  };

  const onValidateForm = async () => {
    const values = await validateFields();
    if (dispatch) {
      dispatch({
        type: 'double_random_start/saveStepFormData',
        payload: values,
      });
      dispatch({
        type: 'double_random_start/saveCurrentStep',
        payload: 3,
      });
    }
  };

  const onSearchForm = async () => {
    if (dispatch) {
      const values = await validateFields();
      setSearchResultVisible(true);
      setSelectedDutyDepartment(values.supervisionAdministration);
    }
  };

  // 组件初始化的网络请求
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'double_random_start/fetchDutyDepartments',
      });
    }
  }, []);

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        initialValues={stepForm}
      >
        <Form.Item
          label="抽选组数"
          name="groupCount"
          rules={[{ required: true, message: '请选择抽选组数' }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="每组人数"
          name="personCount"
          rules={[{ required: true, message: '请选择每组人数' }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="所属分管部门"
          name="dutyDepartment"
          rules={[{ required: true, message: '请选择分管部门' }]}
        >
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择分管部门"
            dropdownStyle={{ zIndex: 9999 }}
          >
            {dutyDepartments?.map((result: { key: string; name: string }) => {
              return (
                <Select.Option key={result.key} value={result.name}>
                  {result.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button type="default" onClick={onPrev}>
            上一步
          </Button>
          <Button type="primary" onClick={onSearchForm} style={{ marginLeft: 8 }}>
            筛选
          </Button>
          <Button
            type="primary"
            onClick={onValidateForm}
            style={{ marginLeft: 8 }}
            disabled={submitDisabled}
          >
            开始抽选
          </Button>
        </Form.Item>
      </Form>
      {searchResultVisible ? (
        <>
          <Divider style={{ margin: 'margin: 40px 0 20px' }} />
          <ProTable<LEOListItem>
            headerTitle="筛选结果"
            search={false}
            rowKey="_id"
            toolBarRender={false}
            params={{ selectedDutyDepartment }}
            request={(params, sorter, filter) => queryLEOList({ ...params, sorter, filter })}
            onLoad={(data) =>
              data?.length > 0 ? setSubmitDisabled(false) : setSubmitDisabled(true)
            }
            columns={columns}
            pagination={{ simple: true, pageSize: 10 }}
            rowSelection={false}
            scroll={{ x: 1300 }}
          />
        </>
      ) : null}
    </>
  );
};

export default connect(({ double_random_start }: { double_random_start: StateType }) => ({
  dutyDepartments: double_random_start.dutyDepartments,
  stepForm: double_random_start.stepForm,
}))(Step3);
