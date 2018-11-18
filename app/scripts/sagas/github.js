/**
 * @module Sagas/GitHub
 * @desc GitHub
 */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { request } from 'modules/client';

import { ActionTypes } from 'constants/index';

/**
 * Get Repos
 *
 * @param {Object} action
 *
 */
export function* getRepos({ payload }) {
  try {
    console.log(`https://api.github.com/users/${payload.username}/events`);
    const response = yield call(request, `https://api.github.com/users/${payload.username}/events`);
    yield put({
      type: ActionTypes.GITHUB_GET_REPOS_SUCCESS,
      payload: { data: response },
    });
  }
  catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.GITHUB_GET_REPOS_FAILURE,
      payload: err,
    });
  }
}

/**
 * GitHub Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.GITHUB_GET_REPOS, getRepos),
  ]);
}
