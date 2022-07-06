import { all } from 'redux-saga/effects'
import { loginSaga } from './login'
import { myProjectsSaga } from './myProjects'
import { myCoursesSaga } from './myCourses'


export default function* rootSaga() {
  yield all([
    loginSaga(),
    myProjectsSaga(),
    myCoursesSaga(),
  ])
}
