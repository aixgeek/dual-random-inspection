import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert } from 'antd';

export default (): React.ReactNode => (
  <PageContainer>
    <Alert
      message="欢迎使用万宁市双随机一公开抽查系统"
      type="success"
      showIcon
      banner
      style={{
        margin: -12,
        marginBottom: 24,
      }}
    />
  </PageContainer>
);
