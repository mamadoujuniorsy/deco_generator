import { NextResponse } from 'next/server'
import { createRoom, getRoomsByProjectId } from '@/libs/models/Room'
import { CreateRoomDto, RoomQuery, RoomType } from '@/types/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const query: RoomQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      type: searchParams.get('type') as RoomType
    }

    const result = await getRoomsByProjectId(projectId, query)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Get rooms error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get rooms' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateRoomDto = await request.json()

    const room = await createRoom(body)

    return NextResponse.json({
      success: true,
      data: room
    }, { status: 201 })
  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create room' },
      { status: 500 }
    )
  }
}
