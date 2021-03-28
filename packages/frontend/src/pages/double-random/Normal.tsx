import { useState } from 'react';
import { history } from 'umi';
import { Card, Result, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormDatePicker, ProFormSlider, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import {
    queryAllSupervisionAdministration,
    queryAllDutyDepartment,
    queryAllIndustryType,
} from '@/services/dual-random-inspection/system';
import { queryAllIM } from '@/services/dual-random-inspection/dataEntry';
import { submitDoubleRandomInspection } from '@/services/dual-random-inspection/doubleRadomInspection';

export default () => {
    const [doubleRandomInspectionId, setDoubleRandomInspectionId] = useState<string>();
    const [submit, setSubmit] = useState<'presubmit' | 'submit' | 'success'>('presubmit')

    return (
        <PageContainer>
            <Card bordered={false}>
                {submit === 'submit' && <Result
                    title="正在抽选，请耐心等待"
                    extra={[<Button key="new" onClick={() => { setSubmit('presubmit') }}>返回上一步</Button>,
                    ]}
                />}
                {submit === 'presubmit' && <ProForm
                    name="dualRandomInspectionForm"
                    submitter={{
                        searchConfig: {
                            resetText: '重置',
                            submitText: '开始抽选',
                        }
                    }}
                    onFinish={async (values) => {
                        values.inspectionMatters = [].concat(values.inspectionMatters).map((v: any) => v.item)
                        values.dutyDepartments = [].concat(values.dutyDepartments).map((v: any) => v.item)
                        values.industryTypes = [].concat(values.industryTypes).map((v: any) => v.item)
                        values.supervisionAdministrations = [].concat(values.supervisionAdministrations).map((v: any) => v.item)
                        setSubmit('submit')
                        const { doubleRandomInspectionId } = await submitDoubleRandomInspection(values as API.DoubleRandomInspection)
                        setSubmit('success')
                        setDoubleRandomInspectionId(doubleRandomInspectionId)
                    }}
                    initialValues={{}}
                >
                    <ProForm.Group title='创建抽查任务'>
                        <ProFormSelect
                            required
                            width='md'
                            name="inspectionMatters"
                            label="抽查事项"
                            request={async () => {
                                const { data } = await queryAllIM('normal', { supervisionAdministrations: [] })
                                const select = data.map((result: { name: string; _id: string; }) => {
                                    return {
                                        label: result.name,
                                        value: result._id,
                                        item: { _id: result._id, name: result.name }
                                    }
                                })
                                return select
                            }}
                            fieldProps={{
                                mode: 'multiple',
                                optionFilterProp: 'label',
                                labelInValue: true,
                            }}
                            placeholder="请选择抽查事项"
                            rules={[{ required: true, message: '请选择抽查事项', type: 'array' }]}
                        />
                        <ProFormDatePicker
                            required
                            width='md'
                            name="createdAt"
                            label="创建时间"
                            rules={[{ required: true, message: '请选择创建时间', type: 'date' }]}
                        />
                        <ProFormDatePicker
                            required
                            width='md'
                            name="inspectedAt"
                            label="检查时间"
                            rules={[{ required: true, message: '请选择抽查时间', type: 'date' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group title='抽选市场主体'>
                        <ProFormSelect
                            width='md'
                            name="supervisionAdministrations"
                            label="监管单位"
                            request={async () => {
                                const { data } = await queryAllSupervisionAdministration('normal')
                                const select = data.map((result: { name: string; _id: string; }) => {
                                    return {
                                        label: result.name,
                                        value: result._id,
                                        item: { _id: result._id, name: result.name }
                                    }
                                })
                                return select
                            }}
                            fieldProps={{
                                labelInValue: true,
                            }}
                            placeholder="请选择监管单位"
                            rules={[{ required: true, message: '请选择监管单位' }]}
                        />
                        <ProFormSelect
                            required
                            width='md'
                            name="industryTypes"
                            label="行业类型"
                            request={async () => {
                                const { data } = await queryAllIndustryType('normal')
                                const select = data.map((result: { name: string; _id: string; }) => {
                                    return {
                                        label: result.name,
                                        value: result._id,
                                        item: { _id: result._id, name: result.name }
                                    }
                                })
                                return select
                            }}
                            fieldProps={{
                                mode: 'multiple',
                                optionFilterProp: 'label',
                                labelInValue: true
                            }}
                            placeholder="请选择行业类型"
                            rules={[{ required: true, message: '请选择行业类型', type: 'array' }]}
                        />
                        <ProFormSlider
                            required
                            name="inspectedRate"
                            width="xl"
                            label="抽选覆盖率"
                            marks={{
                                0: '0%',
                                20: '20%',
                                40: '40%',
                                60: '60%',
                                80: '80%',
                                100: '100%',
                            }}
                            rules={[{ required: true, message: '请选择抽选覆盖率', type: 'number' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group title='抽选执法人员'>
                        <ProFormSelect
                            required
                            width='md'
                            name="dutyDepartments"
                            label="分管部门"
                            request={async () => {
                                const { data } = await queryAllDutyDepartment('normal')
                                const select = data.map((result: { name: string; _id: string; }) => {
                                    return {
                                        label: result.name,
                                        value: result._id,
                                        item: { _id: result._id, name: result.name }
                                    }
                                })
                                return select
                            }}
                            fieldProps={{
                                mode: 'multiple',
                                optionFilterProp: 'label',
                                labelInValue: true
                            }}
                            placeholder="请选择执法人员分管部门"
                            rules={[{ required: true, message: '请选择执法人员分管部门', type: 'array' }]}
                        />
                        <ProFormDigit
                            required
                            width='md'
                            name="groupCount"
                            label="小组数量"
                            min={1} max={10}
                            rules={[{ required: true, message: '请选择抽查小组数量', type: 'number' }]}
                        />
                        <ProFormDigit
                            required
                            width='md'
                            name="personCount"
                            label="每组人数"
                            min={1} max={10}
                            rules={[{ required: true, message: '请选择每组人数', type: 'number' }]}
                        />
                    </ProForm.Group>
                </ProForm>
                }
                {submit === 'success' && <Result
                    status="success"
                    title="完成抽选"
                    extra={[<Button type="primary" key="history" onClick={() => history.push(`/double-random/normalHistory/${doubleRandomInspectionId}`)}>查看记录</Button>]}
                />}
            </Card>
        </PageContainer>
    );
};