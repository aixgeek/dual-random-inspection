/*
 * @Author: June Lue
 * @Date: 2020-09-23 15:48:20
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 18:17:59
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\double-random\start\components\Step1\index.tsx
 */
import React, { useEffect } from 'react';
import { Form, Button, Select, DatePicker } from 'antd';
import { connect, Dispatch } from 'umi';
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
  inspectionMatters?: StateType['inspectionMatters'];
  supervisionAdministrations?: StateType['supervisionAdministrations'];
  dispatch?: Dispatch;
}

const Step1: React.FC<StepProps> = (props) => {
  const { dispatch, stepForm, inspectionMatters, supervisionAdministrations } = props;

  const [form] = Form.useForm();
  const { validateFields } = form;
  const onValidateForm = async () => {
    const values = await validateFields();
    if (dispatch) {
      dispatch({
        type: 'double_random_cooperation/saveStepFormData',
        payload: values,
      });
      dispatch({
        type: 'double_random_cooperation/saveCurrentStep',
        payload: 1,
      });
    }
  };

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'double_random_cooperation/fetchSupervisionAdministrations',
      });
    }
  }, []);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'double_random_cooperation/fetchInspectionMatters',
      });
    }
  }, []);

  return (
    <Form
      {...formItemLayout}
      form={form}
      layout="horizontal"
      className={styles.stepForm}
      initialValues={stepForm}
    >
      <Form.Item
        label="创建日期"
        name="createdAt"
        rules={[{ required: true, message: '请选择创建日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="检查日期"
        name="inspectedAt"
        rules={[{ required: true, message: '请选择检查日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="抽查单位"
        name="supervisionAdministrations"
        rules={[{ required: true, message: '请选择联合抽查单位' }]}
      >
        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="请选择联合抽查单位">
          {supervisionAdministrations?.map((result: { _id: string; name: string }) => {
            return (
              <Select.Option key={result._id} value={result.name}>
                {result.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        label="抽查事项"
        name="inspectionMatter"
        rules={[{ required: true, message: '请选择联合抽查事项' }]}
      >
        <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="请选择联合抽查事项">
          {inspectionMatters?.map((result: { _id: string; name: string }) => {
            return (
              <Select.Option key={result._id} value={result.name}>
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
        <Button type="primary" onClick={onValidateForm}>
          下一步
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ double_random_cooperation }: { double_random_cooperation: StateType }) => ({
  inspectionMatters: double_random_cooperation.inspectionMatters,
  supervisionAdministrations: double_random_cooperation.supervisionAdministrations,
  stepForm: double_random_cooperation.stepForm,
}))(Step1);
