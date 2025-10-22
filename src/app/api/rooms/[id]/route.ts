import { NextResponse } from 'next/server'
import { getRoomById, updateRoom, deleteRoom } from '@/libs/models/Room'
import { UpdateRoomDto } from '@/types/api'

interface Params {
  id: string
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params

    const room = await getRoomById(id)

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: room
    })
  } catch (error) {
    console.error('Get room error:', error)
    return NextResponse.json(
      { error: 'Failed to get room' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params
    const body: UpdateRoomDto = await request.json()

    const room = await updateRoom(id, body)

    return NextResponse.json({
      success: true,
      data: room
    })
  } catch (error) {
    console.error('Update room error:', error)
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params

    await deleteRoom(id)

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully'
    })
  } catch (error) {
    console.error('Delete room error:', error)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    )
  }
}
