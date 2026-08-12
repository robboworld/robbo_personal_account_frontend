import instance from './instance'

export const previewJoin = codeOrSlug => instance.get('/api/join/preview', {
  params: { code: codeOrSlug },
})

export const previewJoinBySlug = slug => instance.get(`/api/join/${encodeURIComponent(slug)}/preview`)

export const joinClass = payload => instance.post('/api/join', payload)

export const listTeacherClasses = () => instance.get('/api/teacher/classes')

export const createTeacherClass = body => instance.post('/api/teacher/classes', body)

export const getTeacherClass = classId => instance.get(`/api/teacher/classes/${classId}`)

export const renameTeacherClass = (classId, displayName) => instance.patch(`/api/teacher/classes/${classId}`, { displayName })

export const archiveTeacherClass = classId => instance.delete(`/api/teacher/classes/${classId}`)

export const rotateInvite = classId => instance.post(`/api/teacher/classes/${classId}/rotate-invite`)

export const listMembers = classId => instance.get(`/api/teacher/classes/${classId}/members`)

export const addMembers = (classId, body) => instance.post(`/api/teacher/classes/${classId}/members`, body)

export const removeMember = (classId, username) => instance.delete(
  `/api/teacher/classes/${classId}/members/${encodeURIComponent(username)}`,
)

export const listAssignments = classId => instance.get(`/api/teacher/classes/${classId}/assignments`)

export const createAssignment = (classId, body) => instance.post(`/api/teacher/classes/${classId}/assignments`, body)

export const issueLate = (classId, assignmentId) => instance.post(
  `/api/teacher/classes/${classId}/assignments/${assignmentId}/issue-late`,
)

export const listSubmissions = (classId, assignmentId) => instance.get(
  `/api/teacher/classes/${classId}/assignments/${assignmentId}/submissions`,
)

export const liveRoster = (classId, assignmentId) => instance.get(`/api/teacher/classes/${classId}/live`, {
  params: assignmentId ? { assignmentId } : undefined,
})

export const progressMatrix = classId => instance.get(`/api/teacher/classes/${classId}/progress`)

export const reviewSubmission = (projectId, body) => instance.post(`/api/teacher/submissions/${projectId}/review`, body)

export const listStudentClasses = () => instance.get('/api/student/classes')

export const listStudentAssignments = classId => instance.get(`/api/student/classes/${classId}/assignments`)

export const submitProject = projectId => instance.post(`/api/student/projects/${projectId}/submit`)
