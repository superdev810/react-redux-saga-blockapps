import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { parseError } from 'modules/client';

import { ActionTypes, STATUS } from 'constants/index';

export const githubState = {
  repos: {
    data: {},
    status: STATUS.IDLE,
    message: '',
    username: '',
  },
};

export default {
  github: handleActions({
    [ActionTypes.GITHUB_GET_REPOS]: (state, { payload }) => {
      const data = state.repos.data[payload.username] ? state.repos.data[payload.username] : [];

      return immutable(state, {
        repos: {
          data: {
            [payload.username]: { $set: data },
          },
          message: { $set: '' },
          username: { $set: payload.username },
          status: { $set: STATUS.RUNNING },
        },
      });
    },
    [ActionTypes.GITHUB_GET_REPOS_SUCCESS]: (state, { payload }) => immutable(state, {
      repos: {
        data: { $set: payload.data || [] },
        status: { $set: STATUS.READY },
      },
    }),
    [ActionTypes.GITHUB_GET_REPOS_FAILURE]: (state, { payload }) => immutable(state, {
      repos: {
        message: { $set: parseError(payload.message) },
        status: { $set: STATUS.ERROR },
      },
    }),
  }, githubState),
};
