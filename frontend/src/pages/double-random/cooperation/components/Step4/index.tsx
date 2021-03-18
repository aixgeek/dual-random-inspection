import React from 'react';
import { history, connect, Dispatch } from 'umi';
import { Button, Divider, Result } from 'antd';

import ProTable, { ProColumns } from '@ant-design/pro-table';
import { StateType } from '../../model';
import { queryDoubleRandomResult } from '../../service';

interface ResultListItem {
  _id: string;
  marketParticipant: string;
  lawEnforcementOfficials: number;
  inspectionMatter: string;
  status: number;
  createdAt: Date;
  inspectedAt: Date;
  desc: string;
}

interface StepProps {
  stepForm?: StateType['stepForm'];
  dispatch?: Dispatch;
  success?: boolean;
  result?: string;
}

const Step4: React.FC<StepProps> = (props) => {
  const { success, stepForm, dispatch, result } = props;
  const columns: ProColumns<ResultListItem>[] = [
    {
      title: '市场主体名称',
      dataIndex: 'marketParticipant',
      fieldProps: {
        rules: [
          {
            required: true,
            message: '市场主体名称为必填项',
          },
        ],
      },
    },
    {
      title: '执法检查人员',
      dataIndex: 'lawEnforcementOfficial',
      search: true,
    },
    {
      title: '抽查事项',
      tip: '详情见随机抽查事项清单',
      dataIndex: 'inspectionMatter',
      search: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      sorter: true,
      hideInForm: true,
      search: true,
      valueType: 'date',
    },
    {
      title: '检查日期',
      dataIndex: 'inspectedAt',
      sorter: true,
      valueType: 'date',
      hideInForm: true,
      search: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      search: true,
      valueEnum: {
        0: { text: '未检查', status: 'Default' },
        1: { text: '责令整改', status: 'Processing' },
        2: { text: '正常', status: 'Success' },
        3: { text: '异常', status: 'Error' },
      },
    },
    {
      title: '备注',
      dataIndex: 'desc',
      valueType: 'textarea',
      search: true,
      hideInForm: true,
      hideInTable: true,
    },
  ];

  const onStartNewStepForm = async () => {
    if (dispatch) {
      dispatch({
        type: 'double_random_cooperation/startNewStepForm',
      });
    }
  };

  // 如果没有本次双随机业务没有成功标识，则开始双随机业务请求
  if (!success) {
    if (dispatch) {
      dispatch({
        type: 'double_random_cooperation/submitStepForm',
        payload: {
          ...stepForm,
        },
      });
    }
  }

  return result ? (
    <>
      <Result
        status="success"
        title="完成抽选"
        extra={[
          <Button
            type="primary"
            key="history"
            onClick={() => history.push(`/double-random/history/${result}`)}
          >
            查看记录
          </Button>,
          <Button key="new" onClick={onStartNewStepForm}>
            继续抽选
          </Button>,
        ]}
      />
      <Divider />
      <ProTable<ResultListItem>
        columns={columns}
        rowKey="_id"
        toolBarRender={false}
        params={{ id: result }}
        request={(params, sorter, filter) => queryDoubleRandomResult({ ...params, sorter, filter })}
        search={false}
        rowSelection={false}
        pagination={{ simple: true }}
        scroll={{ x: 1300 }}
      />
    </>
  ) : (
    <Result
      title="正在抽选，请耐心等待"
      extra={[
        <Button key="new" onClick={onStartNewStepForm}>
          重新抽选
        </Button>,
      ]}
    />
  );
};

export default connect(({ double_random_cooperation }: { double_random_cooperation: StateType }) => ({
  result: double_random_cooperation.result,
  stepForm: double_random_cooperation.stepForm,
  success: double_random_cooperation.success,
}))(Step4);
