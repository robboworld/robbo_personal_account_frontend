import React, { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { useIntl } from 'react-intl'

import MyFiles from './MyFiles'
import { precheckUpload, uploadProblemMessage } from './fileChecks'

import { deleteFile, downloadFile, isUploadCanceled, listFiles, uploadFile } from '@/api/userFiles'
import { getEntitlements } from '@/api/licensing'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'

const MyFilesContainer = () => {
  const intl = useIntl()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  // The backend answers 404 on every /api/files route while the feature flag is off.
  const [unavailable, setUnavailable] = useState(false)
  const [entitlements, setEntitlements] = useState(null)
  const [upload, setUpload] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const loadUsage = useCallback(async () => {
    try {
      setEntitlements(await getEntitlements())
    } catch (_) {
      // Non-fatal: the meter stays hidden and the backend still enforces the limits.
    }
  }, [])

  const loadFiles = useCallback(async () => {
    setLoading(true)
    try {
      setFiles(await listFiles())
      setUnavailable(false)
    } catch (e) {
      if (e?.response?.status === 404) {
        setUnavailable(true)
      } else {
        message.error(apiErrorMessage(e, intl))
      }
    } finally {
      setLoading(false)
    }
  }, [intl])

  useEffect(() => {
    loadFiles()
    loadUsage()
  }, [loadFiles, loadUsage])

  const beforeUpload = useCallback(
    file => {
      const problem = precheckUpload(file, entitlements)
      if (!problem) return true
      message.error(uploadProblemMessage(intl, file, problem))
      return false
    },
    [entitlements, intl],
  )

  const startUpload = useCallback(
    async file => {
      const controller = new AbortController()
      const show = percent =>
        setUpload({ name: file.name, percent, cancel: () => controller.abort() })
      show(0)
      try {
        const created = await uploadFile(file, show, controller.signal)
        if (created) {
          setFiles(prev => [created, ...prev.filter(f => f.id !== created.id)])
        } else {
          await loadFiles()
        }
        message.success(intl.formatMessage({ id: 'my_files.uploaded' }, { name: file.name }))
        if (created?.hasScripts) {
          message.warning({
            content: intl.formatMessage({ id: 'my_files.scripts_uploaded' }, { name: file.name }),
            duration: 8,
          })
        }
      } catch (e) {
        if (isUploadCanceled(e)) {
          message.info(intl.formatMessage({ id: 'my_files.upload_canceled' }, { name: file.name }))
        } else {
          message.error(apiErrorMessage(e, intl))
        }
      } finally {
        setUpload(null)
        loadUsage()
      }
    },
    [intl, loadFiles, loadUsage],
  )

  const onDownload = useCallback(
    async file => {
      setBusyId(file.id)
      try {
        await downloadFile(file.id, file.name)
      } catch (e) {
        message.error(apiErrorMessage(e, intl))
      } finally {
        setBusyId(null)
      }
    },
    [intl],
  )

  const onDelete = useCallback(
    async file => {
      setBusyId(file.id)
      try {
        await deleteFile(file.id)
        setFiles(prev => prev.filter(f => f.id !== file.id))
        message.success(intl.formatMessage({ id: 'my_files.deleted' }))
        loadUsage()
      } catch (e) {
        message.error(apiErrorMessage(e, intl))
        if (e?.response?.status === 404) {
          loadFiles()
        }
      } finally {
        setBusyId(null)
      }
    },
    [intl, loadFiles, loadUsage],
  )

  return (
    <MyFiles
      files={files}
      loading={loading}
      unavailable={unavailable}
      entitlements={entitlements}
      upload={upload}
      busyId={busyId}
      beforeUpload={beforeUpload}
      onUpload={startUpload}
      onDownload={onDownload}
      onDelete={onDelete}
    />
  )
}

export default MyFilesContainer
