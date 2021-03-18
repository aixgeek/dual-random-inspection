import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Slider, Divider } from 'antd';
import { connect, Dispatch } from 'umi';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { MPListItem } from '@/pages/data-entry/data';
import { queryMPList } from '@/pages/data-entry/service';
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
  supervisionAdministrations?: StateType['dutyDepartments'];
  industryTypes?: StateType['industryTypes'];
  dispatch?: Dispatch;
}

const Step2: React.FC<StepProps> = (props) => {
  const { stepForm, dispatch, supervisionAdministrations, industryTypes } = props;
  const [selectedIndustryType, setSelectedIndustryType] = useState<[]>();
  const [selectedSupervisionAdministration, setSelectedSupervisionAdministration] = useState<[]>();
  const [searchResultVisible, setSearchResultVisible] = useState<boolean>(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();
  const { validateFields, getFieldsValue } = form;
  const columns: ProColumns<MPListItem>[] = [
    {
      title: '市场主体名称',
      dataIndex: 'name',
    },
    {
      title: '统一信用代码',
      dataIndex: 'usci',
      hideInTable: true,
    },
    {
      title: '法人代表',
      dataIndex: 'legalRepresentative',
      width: '10%',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
    },
    {
      title: '行业类型',
      dataIndex: 'industryType',
      width: '10%',
    },
    {
      title: '监管单位',
      dataIndex: 'supervisionAdministration',
      hideInTable: true,
    },
    {
      title: '分管部门',
      dataIndex: 'dutyDepartment',
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
        type: 'double_random_cooperation/saveStepFormData',
        payload: {
          ...stepForm,
          ...values,
        },
      });
      dispatch({
        type: 'double_random_cooperation/saveCurrentStep',
        payload: 0,
      });
    }
  };

  const onValidateForm = async () => {
    const values = await validateFields();
    if (dispatch) {
      dispatch({
        type: 'double_random_cooperation/saveStepFormData',
        payload: values,
      });
      dispatch({
        type: 'double_random_cooperation/saveCurrentStep',
        payload: 2,
      });
    }
  };

  const onSearchForm = async () => {
    if (dispatch) {
      const values = await validateFields();
      setSearchResultVisible(true);
      setSelectedIndustryType(values.industryType);
      setSelectedSupervisionAdministration(values.supervisionAdministration);
    }
  };

  // 组件初始化的网络请求
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'double_random_cooperation/fetchSupervisionAdministrations',
      });
      dispatch({
        type: 'double_random_cooperation/fetchIndustryTypes',
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
          label="行业类型"
          name="industryType"
          rules={[{ required: true, message: '请选择行业类型' }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择行业类型"
            dropdownStyle={{ zIndex: 9999 }}
          >
            {industryTypes?.map((result: { key: string; name: string }) => {
              return (
                <Select.Option key={result.key} value={result.name}>
                  {result.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="抽选率"
          name="inspectedRate"
          rules={[{ required: true, message: '请选择抽选率' }]}
        >
          <Slider
            tipFormatter={(value) => {
              return `${value}%`;
            }}
            tooltipVisible
            tooltipPlacement="right"
          />
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
            下一步
          </Button>
        </Form.Item>
      </Form>
      {searchResultVisible ? (
        <>
          <Divider style={{ margin: 'margin: 40px 0 20px' }} />
          <ProTable<MPListItem>
            headerTitle="筛选结果"
            search={false}
            rowKey="_id"
            toolBarRender={false}
            params={{ selectedIndustryType, selectedSupervisionAdministration }}
            request={(params, sorter, filter) => queryMPList({ ...params, sorter, filter })}
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

export default connect(({ double_random_cooperation }: { double_random_cooperation: StateType }) => ({
  industryTypes: double_random_cooperation.industryTypes,
  supervisionAdministrations: double_random_cooperation.supervisionAdministrations,
  stepForm: double_random_cooperation.stepForm,
}))(Step2);
