import React from 'react';
import { Modal } from 'antd';

export interface UpdateFormProps {
  onCancel: () => void;
  modalVisible: boolean;
  title: string;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { title, onCancel: handleUpdateModalVisible, modalVisible } = props;

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={modalVisible}
      footer={null}
      onCancel={() => handleUpdateModalVisible()}
    >
      {props.children}
    </Modal>
  );
};

export default UpdateForm;
