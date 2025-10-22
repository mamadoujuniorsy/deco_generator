import { NextResponse } from 'next/server'
import { getDesignById, updateDesign, deleteDesign } from '@/libs/models/Design'

interface Params {
  id: string
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params

    const design = await getDesignById(id)

    if (!design) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: design
    })
  } catch (error) {
    console.error('Get design error:', error)
    return NextResponse.json(
      { error: 'Failed to get design' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params
    const body = await request.json()

    const design = await updateDesign(id, body)

    return NextResponse.json({
      success: true,
      data: design
    })
  } catch (error) {
    console.error('Update design error:', error)
    return NextResponse.json(
      { error: 'Failed to update design' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params

    await deleteDesign(id)

    return NextResponse.json({
      success: true,
      message: 'Design deleted successfully'
    })
  } catch (error) {
    console.error('Delete design error:', error)
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    )
  }
}
