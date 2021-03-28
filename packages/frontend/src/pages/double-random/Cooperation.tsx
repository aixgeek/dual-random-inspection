import { useState } from 'react';
import { history } from 'umi';
import { Spin, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormDependency, ProFormDatePicker, ProFormSlider, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import { submitCooperationDoubleRandomInspection } from '@/services/dual-random-inspection/doubleRadomInspection';
import { queryAllIM } from '@/services/dual-random-inspection/dataEntry';
import { queryAllSupervisionAdministration, queryAllIndustryType } from '@/services/dual-random-inspection/system';

export default () => {
    const [loading, setLoading] = useState(false);

    return (
        <PageContainer>
            <Card bordered={false}>
                <Spin spinning={loading} size="large" tip="正在抽选中，请耐心等待！">
                    <ProForm
                        submitter={{
                            searchConfig: {
                                resetText: '重置',
                                submitText: '开始抽选',
                            }
                        }}
                        onFinish={async (values) => {
                            values.inspectionMatters = [].concat(values.inspectionMatters).map((v: any) => v.item)
                            values.industryTypes = [].concat(values.industryTypes).map((v: any) => v.item)
                            values.supervisionAdministrations = [].concat(values.supervisionAdministrations).map((v: any) => v.item)
                            setLoading(true)
                            const { doubleRandomInspectionId } = await submitCooperationDoubleRandomInspection(values as API.DoubleRandomInspection)
                            setLoading(false)
                            history.push(`/double-random/cooperationHistory/${doubleRandomInspectionId}`);
                        }}
                        initialValues={{}}
                    >
                        <ProForm.Group title='选择抽查单位'>
                            <ProFormSelect
                                width='md'
                                name="supervisionAdministrations"
                                label="联合抽查单位"
                                request={async () => {
                                    const { data } = await queryAllSupervisionAdministration('cooperation')
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
                                placeholder="请选择联合抽查单位"
                                rules={[{ required: true, message: '请选择联合抽查单位', type: 'array' }]}
                            />
                        </ProForm.Group>
                        <ProForm.Group title='创建抽查任务'>
                            <ProFormDependency name={['supervisionAdministrations']}>
                                {({ supervisionAdministrations }) => {
                                    return (
                                        <ProFormSelect
                                            required
                                            width='md'
                                            name="inspectionMatters"
                                            label="抽查事项"
                                            params={supervisionAdministrations}
                                            request={async () => {
                                                let params: { supervisionAdministrations: string[] } = { supervisionAdministrations: [] }
                                                supervisionAdministrations.map((s: { label: string; }) => {
                                                    params.supervisionAdministrations.push(s.label)
                                                })
                                                const { data } = await queryAllIM('all', params)
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
                                            placeholder="请选择联合抽查事项"
                                            rules={[{ required: true, message: '请选择联合抽查事项', type: 'array' }]}
                                        />
                                    );
                                }}
                            </ProFormDependency>
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
                        <ProForm.Group title='市场主体'>
                            <ProFormDependency name={['supervisionAdministrations']}>
                                {({ supervisionAdministrations }) => {
                                    return (
                                        <ProFormSelect
                                            required
                                            width='md'
                                            name="industryTypes"
                                            label="行业类型"
                                            params={supervisionAdministrations}
                                            request={async () => {
                                                let params: { supervisionAdministrations: string[] } = { supervisionAdministrations: [] }
                                                supervisionAdministrations.map((s: { label: string; }) => {
                                                    params.supervisionAdministrations.push(s.label)
                                                })
                                                const { data } = await queryAllIndustryType('all', params)
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
                                    );
                                }}
                            </ProFormDependency>
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
                        <ProForm.Group title='执法人员'>
                            <ProFormDigit
                                required
                                width='md'
                                name="groupCount"
                                label="抽查小组数量"
                                min={1} max={10}
                                rules={[{ required: true, message: '请输入抽查小组数量', type: 'number' }]}
                            />
                            <ProFormDigit
                                required
                                width='md'
                                name="personCount"
                                label="每组人数"
                                min={1} max={10}
                                rules={[{ required: true, message: '请输入每组人数', type: 'number' }]}
                            />
                        </ProForm.Group>
                    </ProForm>
                </Spin>
            </Card>
        </PageContainer>
    );
};