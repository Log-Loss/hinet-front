import { getAllPosts, getPost, addPost, updatePost, deletePost, addReadList, getReadList,
  getComments, addComment, getPostsByUser, getCommentsByUser, deleteComment, getLikes, addLike, deleteLike, updateComment} from '../services/community';
import { notification } from 'antd';

export default {
  namespace: 'post',

  state: {
    list: [],
    item: {},
    loading: true,
    commentLoading: true,
    comments: [],
    likes: [],
    readList: null,
    likeLoading: true
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getAllPosts, payload);
      if (Array.isArray(response)) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      } else {
        notification.error({message: 'get posts failed!'});
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchUserList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getPostsByUser, payload);
      if (Array.isArray(response)) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      } else {
        notification.error({message: 'get posts failed!'});
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchUserComments({ payload }, { call, put }) {
      yield put({
        type: 'changeCommentLoading',
        payload: true,
      });
      const response = yield call(getCommentsByUser, payload);
      if (Array.isArray(response)) {
        yield put({
          type: 'saveComments',
          payload: response,
        });
      } else {
        notification.error({message: 'get comments failed!'});
      }
      yield put({
        type: 'changeCommentLoading',
        payload: false,
      });
    },
    *fetch ({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getPost, payload);
      if (response.postId) {
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        notification.error({message: 'get post failed!'});
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *add({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addPost, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *put({ payload }, { call, put }) {
      const {postId, params} = payload;
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(updatePost, {postId, params});
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *remove({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(deletePost, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchComments ({ payload }, { call, put }) {
      yield put({
        type: 'changeCommentLoading',
        payload: true,
      });
      const response = yield call(getComments, payload);
      if (Array.isArray(response)) {
        yield put({
          type: 'saveComments',
          payload: response,
        });
      } else {
        notification.error({message: 'get comments failed!'});
      }
      yield put({
        type: 'changeCommentLoading',
        payload: false,
      });
    },
    *fetchReadList ({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getReadList, payload);
      if (response) {
        yield put({
          type: 'saveReadList',
          payload: response,
        });
      } else {
        notification.error({message: 'get read list failed!'});
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * addComment ({ payload }, { call, put }) {
      yield put({
        type: 'changeCommentLoading',
        payload: true,
      });
      const response = yield call(addComment, payload);
      yield put({
        type: 'changeCommentLoading',
        payload: false,
      });
    },
    * addLike ({ payload }, { call, put }) {
      yield put({
        type: 'changeLikeLoading',
        payload: true,
      });
      const response = yield call(addLike, payload);
      yield put({
        type: 'changeLikeLoading',
        payload: false,
      });
    },
    * addReadList ({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addReadList, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * updateComment ({ payload }, { call, put }) {
      console.log(payload)
      yield put({
        type: 'changeCommentLoading',
        payload: true,
      });
      const response = yield call(updateComment, payload);
      yield put({
        type: 'changeCommentLoading',
        payload: false,
      });
    },
    * deleteComment ({ payload }, { call, put }) {
      yield put({
        type: 'changeCommentLoading',
        payload: true,
      });
      const response = yield call(deleteComment, payload);
      yield put({
        type: 'changeCommentLoading',
        payload: false,
      });
    },
    * deleteLike ({ payload }, { call, put }) {
      yield put({
        type: 'changeLikeLoading',
        payload: true,
      });
      const response = yield call(deleteLike, payload);
      yield put({
        type: 'changeLikeLoading',
        payload: false,
      });
    },
    *fetchLikes ({ payload }, { call, put }) {
      yield put({
        type: 'changeLikeLoading',
        payload: true,
      });
      const response = yield call(getLikes, payload);
      if (Array.isArray(response)) {
        yield put({
          type: 'saveLikes',
          payload: response,
        });
      } else {
        notification.error({message: 'get likes failed!'});
      }
      yield put({
        type: 'changeLikeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveComments(state, action) {
      return {
        ...state,
        comments: action.payload,
      };
    },
    saveLikes(state, action) {
      return {
        ...state,
        likes: action.payload,
      };
    },
    saveReadList(state, action) {
      return {
        ...state,
        readList: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        item: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeCommentLoading(state, action) {
      return {
        ...state,
        commentLoading: action.payload,
      };
    },
    changeLikeLoading(state, action) {
      return {
        ...state,
        likeLoading: action.payload,
      };
    },
  },
};
