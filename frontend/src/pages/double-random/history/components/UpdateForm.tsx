import React from 'react';
import { Form, Button, DatePicker, Input, Modal, Select } from 'antd';

import { ResultListItem } from '../data';

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: Partial<ResultListItem>) => void;
  updateModalVisible: boolean;
  values: Partial<ResultListItem>;
}

export interface UpdateFormState {
  formVals: Partial<ResultListItem>;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({ ...values, ...fieldsValue });
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="录入检查信息"
      visible={updateModalVisible}
      footer={
        <>
          <Button onClick={() => handleUpdateModalVisible()}>取消</Button>
          <Button type="primary" onClick={() => handleSubmit()}>
            完成
          </Button>
        </>
      }
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form {...formLayout} form={form} initialValues={values}>
        <Form.Item
          name="status"
          label="检查状态"
          rules={[{ required: true, message: '请选择检查状态' }]}
        >
          <Select style={{ width: '100%' }}>
            <Select.Option value={0}>未检查</Select.Option>
            <Select.Option value={1}>责令查改</Select.Option>
            <Select.Option value={2}>正常</Select.Option>
            <Select.Option value={3}>异常</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="desc" label="检查情况">
          <Input.TextArea rows={4} placeholder="请输入检查情况" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
