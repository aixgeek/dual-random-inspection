/*
 * @Author: June Lue
 * @Date: 2020-09-23 22:41:50
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 17:30:41
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\double-random\start\model.ts
 */
import { Effect, Reducer } from 'umi';
import {
  submitDoubleRandom,
  fetchInspectedMatters,
  fetchDutyDepartments,
  fetchIndustryTypes,
  fetchSupervisionAdministrations,
} from './service';

export interface StateType {
  current?: number;
  stepForm?: {};
  inspectionMatters?: any[];
  supervisionAdministrations?: any[];
  dutyDepartments?: any[];
  industryTypes?: any[];
  success?: boolean;
  result?: string;
}

const initialState: StateType = {
  current: 0,
  stepForm: {
    // 默认每组2人
    personCount: 2,
    // 默认抽选4组
    groupCount: 4,
  },
  inspectionMatters: <any>[],
  supervisionAdministrations: <any>[],
  dutyDepartments: <any>[],
  industryTypes: <any>[],
  success: false,
  result: undefined,
};

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submitStepForm: Effect;
    fetchInspectionMatters: Effect;
    fetchSupervisionAdministrations: Effect;
    fetchDutyDepartments: Effect;
    fetchIndustryTypes: Effect;
  };
  reducers: {
    saveStepFormData: Reducer<StateType>;
    saveCurrentStep: Reducer<StateType>;
    startNewStepForm: Reducer<StateType>;
    saveStepFormResult: Reducer<StateType>;
    saveInspectionMatters: Reducer<StateType>;
    saveSupervisionAdministrations: Reducer<StateType>;
    saveDutyDepartments: Reducer<StateType>;
    saveIndustryTypes: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'double_random_start',

  state: initialState,

  effects: {
    *submitStepForm({ payload }, { call, put }) {
      const { doubleRandomInspectionId, success } = yield call(submitDoubleRandom, payload);
      if (success) {
        yield put({
          type: 'saveStepFormResult',
          payload: doubleRandomInspectionId,
        });
        yield put({
          type: 'saveCurrentStep',
          payload: 3,
        });
      }
    },
    *fetchInspectionMatters(_, { call, put }) {
      const response = yield call(fetchInspectedMatters);
      if (response.success === true) {
        yield put({
          type: 'saveInspectionMatters',
          payload: response.data,
        });
      }
    },
    *fetchSupervisionAdministrations(_, { call, put }) {
      const response = yield call(fetchSupervisionAdministrations);
      if (response.success === true) {
        yield put({
          type: 'saveSupervisionAdministrations',
          payload: response.data,
        });
      }
    },
    *fetchDutyDepartments(_, { call, put }) {
      const response = yield call(fetchDutyDepartments);
      if (response.success === true) {
        yield put({
          type: 'saveDutyDepartments',
          payload: response.data,
        });
      }
    },
    *fetchIndustryTypes(_, { call, put }) {
      const response = yield call(fetchIndustryTypes);
      if (response.success === true) {
        yield put({
          type: 'saveIndustryTypes',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    saveCurrentStep(state, { payload }) {
      return {
        ...state,
        current: payload,
      };
    },
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        stepForm: {
          ...(state as StateType).stepForm,
          ...payload,
        },
      };
    },
    saveStepFormResult(state, { payload }) {
      return {
        ...state,
        result: payload,
        success: true,
      };
    },
    startNewStepForm(state) {
      return {
        ...state,
        ...initialState,
      };
    },
    saveInspectionMatters(state, { payload }) {
      return {
        ...state,
        inspectionMatters: payload,
      };
    },
    saveSupervisionAdministrations(state, { payload }) {
      return {
        ...state,
        supervisionAdministrations: payload,
      };
    },
    saveDutyDepartments(state, { payload }) {
      return {
        ...state,
        dutyDepartments: payload,
      };
    },
    saveIndustryTypes(state, { payload }) {
      return {
        ...state,
        industryTypes: payload,
      };
    },
  },
};

export default Model;
