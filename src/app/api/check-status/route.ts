// app/api/check-status/route.ts
import { NextResponse } from 'next/server'
import { getJobBySessionId } from '@/libs/models/DesignJob'
import { redis } from '@/libs/redis'

export const runtime = 'nodejs' // Changed from 'edge' to 'nodejs'

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Check cache first
    const cachedStatus = await redis.get(`job-status:${sessionId}`)
    if (typeof cachedStatus === 'string') {
      return NextResponse.json(JSON.parse(cachedStatus))
    }

    // Get from MongoDB
    const job = await getJobBySessionId(sessionId)

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Prepare response
    const responseData = {
      status: job.status,
      progress: job.progress,
      ...(job.status === 'completed' && {
        analysis: job.analysis,
        generatedImages: job.generatedImages,
      }),
      ...(job.status === 'failed' && { error: job.error }),
    }

    // Cache the result for 5 seconds
    await redis.setex(
      `job-status:${sessionId}`,
      5,
      JSON.stringify(responseData)
    )

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error checking status:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}