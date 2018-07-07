import { register } from '../services/api';

export default {
  namespace: 'register',

  state: {
    code: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(register, payload);
      console.log(response);
      if (response.id) {
        localStorage.setItem('id', response.userId);
        localStorage.setItem('email', response.email);
      }
      yield put({
        type: 'registerHandle',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        code: payload.userId?200:400,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
