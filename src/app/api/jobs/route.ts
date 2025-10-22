//app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createJob } from '@/libs/models/DesignJob'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, originalImageUrl, status, progress, analysis } = body

    const job = await createJob({
      sessionId,
      originalImageUrl,
      status,
      progress,
      analysis
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}