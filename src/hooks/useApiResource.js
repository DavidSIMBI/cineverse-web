import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../services/api.js'

export default function useApiResource(key, load) {
  const [attempt, setAttempt] = useState(0)
  const [response, setResponse] = useState({ key: '', data: null, error: '' })
  const requestKey = `${key}:${attempt}`

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
      .then((data) => setResponse({ key: requestKey, data, error: '' }))
      .catch((error) => {
        if (!controller.signal.aborted) setResponse({ key: requestKey, data: null, error: getApiErrorMessage(error) })
      })
    return () => controller.abort()
  }, [load, requestKey])

  const current = response.key === requestKey
  return {
    data: current ? response.data : null,
    error: current ? response.error : '',
    loading: !current,
    retry: () => setAttempt((value) => value + 1),
  }
}
