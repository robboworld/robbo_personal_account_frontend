import { all } from 'redux-saga/effects';
import { loginSaga } from './login';
import { projectPageSaga } from './projectPage';


export default function* rootSaga() {
  yield all([
    loginSaga(),
    projectPageSaga(),
  ])
}
