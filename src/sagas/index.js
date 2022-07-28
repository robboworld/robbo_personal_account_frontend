import { all } from 'redux-saga/effects'

import { loginSaga } from './login'
import { myProjectsSaga } from './myProjects'
import { myCoursesSaga } from './myCourses'
import { profileSaga } from './profile'
import { teachersSaga } from './teachers'
import { clientsSaga } from './clients'

export default function* rootSaga() {
  yield all([
    loginSaga(),
    myProjectsSaga(),
    myCoursesSaga(),
    profileSaga(),
    teachersSaga(),
    clientsSaga(),
  ])
}
