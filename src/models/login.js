import { routerRedux } from 'dva/router';
import { login } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      console.log(payload);
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response && response[0] === 'true' ? 200 : 400,
      });
      // Login successfully
      console.log(response)
      if (response && response[0] === 'true') {
        localStorage.setItem('id', response[1]);
        localStorage.setItem('email',payload.email);
        yield put(routerRedux.push('/community'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      localStorage.removeItem('id');
      localStorage.removeItem('email');
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        code: payload.code,
        submitting: false,
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
