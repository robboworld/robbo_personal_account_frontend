import { call, takeLatest, put, select } from 'redux-saga/effects'
import { notification } from 'antd'

import {
  createTeacher,
  createTeacherFailed,
  createTeacherSuccess,
  deleteTeacher,
  deleteTeacherFailed,
  deleteTeacherSuccess,
  getTeachers,
  getTeachersFailed,
  getTeachersSuccess,
  deleteTeacherForRobboGroupFailed,
  deleteTeacherForRobboGroupRequest,
  deleteTeacherForRobboGroupSuccess,
  setTeacherForRobboGroupFailed,
  setTeacherForRobboGroupRequest,
  setTeacherForRobboGroupSuccess,
} from '@/actions'
import { formatMessageId } from '@/helpers/intl'
import { teacherMutationsGraphQL, teacherQuerysGraphQL } from '@/graphQL'
import { sagaErrorMessage } from '@/helpers/apiErrorMessage'

function* getTeachersSaga(action) {
  const language = yield select(state => state.app.language)
  try {
    const { page, pageSize } = action.payload
    const response = yield call(teacherQuerysGraphQL.GetAllTeachers, page, pageSize)

    yield put(getTeachersSuccess(response.data.GetAllTeachers.teachers))
  } catch (e) {
    yield put(getTeachersFailed(e.message))
    notification.error({
      title: formatMessageId(language, 'notification.error_message'),
      description: sagaErrorMessage(e, language),
    })
  }
}

function* deleteTeacherSaga(action) {
  const language = yield select(state => state.app.language)
  try {
    const { teacherId, teacherIndex } = action.payload
    const response = yield call(teacherMutationsGraphQL.DeleteTeacher, teacherId)

    yield put(deleteTeacherSuccess(response.data.DeleteTeacher, teacherIndex))
    notification.success({
      title: '',
      description: formatMessageId(language, 'notification.teacher_delete_success'),
    })
  } catch (e) {
    yield put(deleteTeacherFailed(e))
    notification.error({
      title: formatMessageId(language, 'notification.error_message'),
      description: sagaErrorMessage(e, language),
    })
  }
}

function* createTeacherSaga(action) {
  const language = yield select(state => state.app.language)
  try {
    const { teacher } = action.payload
    const response = yield call(teacherMutationsGraphQL.CreateTeacher, { input: teacher })

    yield put(createTeacherSuccess(response.data.CreateTeacher))
    notification.success({
      title: '',
      description: formatMessageId(language, 'notification.teacher_create_success'),
    })
  } catch (e) {
    yield put(createTeacherFailed(e))
    notification.error({
      title: formatMessageId(language, 'notification.error_message'),
      description: sagaErrorMessage(e, language),
    })
  }
}

function* setTeacherForRobboGroupSaga(action) {
  const language = yield select(state => state.app.language)
  try {
    const { teacherId, robboGroupId } = action.payload
    const response = yield call(
      teacherMutationsGraphQL.SetTeacherForRobboGroup,
      teacherId,
      robboGroupId,
    )

    yield put(setTeacherForRobboGroupSuccess(response.data.SetTeacherForRobboGroup))
    notification.success({
      title: '',
      description: formatMessageId(language, 'notification.teacher_assigned_success'),
    })
  } catch (e) {
    yield put(setTeacherForRobboGroupFailed(e))
    notification.error({
      title: formatMessageId(language, 'notification.error_message'),
      description: sagaErrorMessage(e, language),
    })
  }
}

function* deleteTeacherForRobboGroupSaga(action) {
  const language = yield select(state => state.app.language)
  try {
    const { teacherId, robboGroupId } = action.payload
    const response = yield call(
      teacherMutationsGraphQL.DeleteTeacherForRobboGroup,
      teacherId,
      robboGroupId,
    )

    yield put(deleteTeacherForRobboGroupSuccess(response.data.DeleteTeacherForRobboGroup))
    notification.success({
      title: '',
      description: formatMessageId(language, 'notification.teacher_unassigned_success'),
    })
  } catch (e) {
    yield put(deleteTeacherForRobboGroupFailed(e))
    notification.error({
      title: formatMessageId(language, 'notification.error_message'),
      description: sagaErrorMessage(e, language),
    })
  }
}

export function* teachersSaga() {
  yield takeLatest(getTeachers, getTeachersSaga)
  yield takeLatest(deleteTeacher, deleteTeacherSaga)
  yield takeLatest(createTeacher, createTeacherSaga)
  yield takeLatest(setTeacherForRobboGroupRequest, setTeacherForRobboGroupSaga)
  yield takeLatest(deleteTeacherForRobboGroupRequest, deleteTeacherForRobboGroupSaga)
}
