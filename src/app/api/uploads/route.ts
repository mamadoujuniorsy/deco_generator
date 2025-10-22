import { NextResponse } from 'next/server'
import { createUpload, getUploadsByRoomId } from '@/libs/models/Upload'
import { UploadQuery } from '@/types/api'
import prisma from '@/libs/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (roomId) {
      const query: UploadQuery = {
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '10')
      }

      const result = await getUploadsByRoomId(roomId, query)

      return NextResponse.json({
        success: true,
        data: result
      })
    } else {
      // If no roomId, return all uploads (admin or general)
      // For now, implement basic all uploads
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const skip = (page - 1) * limit

      const [uploads, total] = await Promise.all([
        prisma.upload.findMany({
          skip,
          take: limit,
          include: {
            room: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.upload.count()
      ])

      return NextResponse.json({
        success: true,
        data: {
          uploads,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      })
    }
  } catch (error) {
    console.error('Get uploads error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get uploads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const upload = await createUpload(body)

    return NextResponse.json({
      success: true,
      data: upload
    }, { status: 201 })
  } catch (error) {
    console.error('Create upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create upload' },
      { status: 500 }
    )
  }
}
