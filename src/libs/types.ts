
export interface DesignJob {
  _id?: string
  sessionId: string
  userId?: string
  originalImageUrl: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  analysis?: string
  generatedImages?: string[]
  error?: string
  createdAt: Date
  updatedAt: Date
}