import { all } from 'redux-saga/effects'
import { loginSaga } from './login'
import { myProjectsSaga } from './myProjects'


export default function* rootSaga() {
  yield all([
    loginSaga(),
    myProjectsSaga(),
  ])
}
