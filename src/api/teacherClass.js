import instance from './instance'

import { fetchWithAuthRetry, saveResponseBlob } from '@/api/projectPage'
import { apiBase } from '@/api/authRefresh'
import { fetchErrorWithBody } from '@/api/userFiles'

export const previewJoin = codeOrSlug =>
  instance.get('/api/join/preview', {
    params: { code: codeOrSlug },
  })

export const previewJoinBySlug = slug =>
  instance.get(`/api/join/${encodeURIComponent(slug)}/preview`)

export const joinClass = payload => instance.post('/api/join', payload)

export const listTeacherClasses = () => instance.get('/api/teacher/classes')

export const createTeacherClass = body => instance.post('/api/teacher/classes', body)

export const getTeacherClass = classId => instance.get(`/api/teacher/classes/${classId}`)

export const renameTeacherClass = (classId, displayName) =>
  instance.patch(`/api/teacher/classes/${classId}`, { displayName })

export const archiveTeacherClass = classId => instance.delete(`/api/teacher/classes/${classId}`)

export const rotateInvite = classId =>
  instance.post(`/api/teacher/classes/${classId}/rotate-invite`)

export const listMembers = classId => instance.get(`/api/teacher/classes/${classId}/members`)

export const addMembers = (classId, body) =>
  instance.post(`/api/teacher/classes/${classId}/members`, body)

export const removeMember = (classId, username) =>
  instance.delete(`/api/teacher/classes/${classId}/members/${encodeURIComponent(username)}`)

export const listAssignments = classId =>
  instance.get(`/api/teacher/classes/${classId}/assignments`)

export const createAssignment = (classId, body) =>
  instance.post(`/api/teacher/classes/${classId}/assignments`, body)

export const issueLate = (classId, assignmentId) =>
  instance.post(`/api/teacher/classes/${classId}/assignments/${assignmentId}/issue-late`)

export const closeAssignment = (classId, assignmentId) =>
  instance.post(`/api/teacher/classes/${classId}/assignments/${assignmentId}/close`)

export const reopenAssignment = (classId, assignmentId) =>
  instance.post(`/api/teacher/classes/${classId}/assignments/${assignmentId}/reopen`)

export const listSubmissions = (classId, assignmentId) =>
  instance.get(`/api/teacher/classes/${classId}/assignments/${assignmentId}/submissions`)

export const progressMatrix = classId => instance.get(`/api/teacher/classes/${classId}/progress`)

export const reviewSubmission = (projectId, body) =>
  instance.post(`/api/teacher/submissions/${projectId}/review`, body)

export const listStudentClasses = () => instance.get('/api/student/classes')

export const leaveClass = classId => instance.post(`/api/student/classes/${classId}/leave`)

export const listStudentAssignments = classId =>
  instance.get(`/api/student/classes/${classId}/assignments`)

export const submitProject = (projectId, note) =>
  instance.post(`/api/student/projects/${projectId}/submit`, { note })
export const updateProjectNote = (projectId, note) =>
  instance.put(`/api/student/projects/${projectId}/note`, { note })

export const listTeacherCourses = () => instance.get('/api/teacher/courses')

// File assignments: the student attaches files from "Мои файлы" and hands them in.
export const attachAssignmentFile = (assignmentId, fileId) =>
  instance.post(`/api/student/assignments/${assignmentId}/files`, { fileId })

export const detachAssignmentFile = (assignmentId, fileId) =>
  instance.delete(`/api/student/assignments/${assignmentId}/files/${encodeURIComponent(fileId)}`)

export const submitAssignmentFiles = (assignmentId, note) =>
  instance.post(`/api/student/assignments/${assignmentId}/submit`, { note })
export const updateFileNote = (assignmentId, note) =>
  instance.put(`/api/student/assignments/${assignmentId}/note`, { note })

export const reviewFileSubmission = (submissionId, body) =>
  instance.post(`/api/teacher/file-submissions/${submissionId}/review`, body)

async function download(path, fallbackName) {
  const res = await fetchWithAuthRetry(`${apiBase()}${path}`, { method: 'GET' })
  if (!res.ok) {
    throw await fetchErrorWithBody(res)
  }
  await saveResponseBlob(res, fallbackName || 'file')
}

/** The teacher's starter file of a file assignment (class members and the teacher). */
export const downloadStarterFile = (assignmentId, fallbackName) =>
  download(`/api/student/assignments/${assignmentId}/starter`, fallbackName)

/** A file of handed-in work, for the teacher. */
export const downloadSubmissionFile = (submissionId, fileId, fallbackName) =>
  download(
    `/api/teacher/file-submissions/${submissionId}/files/${encodeURIComponent(fileId)}/download`,
    fallbackName,
  )
