import { all } from 'redux-saga/effects'

import { loginWather } from './login'
import { myProjectsSaga } from './myProjects'
import { myCoursesSaga } from './myCourses'
import { profileSaga } from './profile'
import { teachersSaga } from './teachers'
import { clientsSaga } from './clients'
import { unitAdminsSaga } from './unitAdmins'
import { robboUnitsSaga } from './robboUnits'
import { robboGroupSaga } from './robboGroup'
import { coursePageSaga } from './coursePage'

export default function* rootSaga() {
  yield all([
    loginWather(),
    myProjectsSaga(),
    myCoursesSaga(),
    profileSaga(),
    teachersSaga(),
    clientsSaga(),
    unitAdminsSaga(),
    robboUnitsSaga(),
    robboGroupSaga(),
    coursePageSaga(),
  ])
}
