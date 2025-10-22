export async function pollJobStatus(
  sessionId: string,
  options: {
    interval?: number
    timeout?: number
    onProgress?: (progress: number) => void
  } = {}
): Promise<{
  status: string
  progress: number
  analysis?: string
  generatedImages?: string[]
  error?: string
}> {
  const { interval = 2000, timeout = 120000, onProgress } = options
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        if (Date.now() - startTime > timeout) {
          reject(new Error('Polling timeout exceeded'))
          return
        }

        const response = await fetch('/api/check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          throw new Error('Failed to check status')
        }

        const data = await response.json()

        if (onProgress && typeof data.progress === 'number') {
          onProgress(data.progress)
        }

        if (data.status === 'completed' || data.status === 'failed') {
          resolve(data)
          return
        }

        setTimeout(checkStatus, interval)
      } catch (error) {
        reject(error)
      }
    }

    checkStatus()
  })
}