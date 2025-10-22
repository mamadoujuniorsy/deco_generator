// app/api/create-job/route.ts
import { NextResponse } from 'next/server'
import { createJob } from '@/libs/models/DesignJob'

export async function POST(request: Request) {
  try {
    const { analysis } = await request.json()

    const job = await createJob({
      sessionId: `session-${Date.now()}`,
      originalImageUrl: '', // Will be updated after upload
      status: 'pending',
      progress: 0,
      analysis
    })

    return NextResponse.json({
      sessionId: job.sessionId,
      uploadUrl: `/api/upload?sessionId=${job.sessionId}`
    })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}