import { NextResponse } from 'next/server'
import { getUploadById, updateUpload, deleteUpload } from '@/libs/models/Upload'

interface Params {
  id: string
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params

    const upload = await getUploadById(id)

    if (!upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: upload
    })
  } catch (error) {
    console.error('Get upload error:', error)
    return NextResponse.json(
      { error: 'Failed to get upload' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params
    const body = await request.json()

    const upload = await updateUpload(id, body)

    return NextResponse.json({
      success: true,
      data: upload
    })
  } catch (error) {
    console.error('Update upload error:', error)
    return NextResponse.json(
      { error: 'Failed to update upload' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params

    await deleteUpload(id)

    return NextResponse.json({
      success: true,
      message: 'Upload deleted successfully'
    })
  } catch (error) {
    console.error('Delete upload error:', error)
    return NextResponse.json(
      { error: 'Failed to delete upload' },
      { status: 500 }
    )
  }
}
