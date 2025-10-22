import { NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/libs/models/Project'
import { UpdateProjectDto } from '@/types/api'

interface Params {
  id: string
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params

    const project = await getProjectById(id)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Failed to get project' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params
    const body: UpdateProjectDto = await request.json()

    const project = await updateProject(id, body)

    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params

    await deleteProject(id)

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
