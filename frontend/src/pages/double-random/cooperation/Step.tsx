import React, { useState, useEffect } from 'react';
import { Card, Steps } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { StateType } from './model';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import styles from './Step.less';

const { Step } = Steps;

interface StepFormProps {
  current: StateType['current'];
}

const getCurrentStepAndComponent = (current?: number) => {
  switch (current) {
    case 0:
      return { step: 0, component: <Step1 /> };
    case 1:
      return { step: 1, component: <Step2 /> };
    case 2:
      return { step: 2, component: <Step3 /> };
    case 3:
      return { step: 3, component: <Step4 /> };
    default:
      return { step: 0, component: <Step1 /> };
  }
};

const StepForm: React.FC<StepFormProps> = ({ current }) => {
  const [stepComponent, setStepComponent] = useState<React.ReactNode>();
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent(current);
    setCurrentStep(step);
    setStepComponent(component);
  }, [current]);

  return (
    <PageContainer>
      <Card bordered={false}>
        <Steps current={currentStep} className={styles.steps}>
          <Step title="选择联合抽查单位" />
          <Step title="筛选市场主体" />
          <Step title="筛选执法人员" />
          <Step title="查看抽选结果" />
        </Steps>
        {stepComponent}
      </Card>
    </PageContainer>
  );
};

export default connect(({ double_random_start }: { double_random_start: StateType }) => ({
  current: double_random_start.current,
}))(StepForm);
