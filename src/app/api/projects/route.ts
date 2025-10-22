import { NextResponse } from 'next/server'
import { createProject, getProjectsByUserId } from '@/libs/models/Project'
import { CreateProjectDto, ProjectQuery, ProjectType, InteriorStyle } from '@/types/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const query: ProjectQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      type: searchParams.get('type') as ProjectType,
      style: searchParams.get('style') as InteriorStyle,
      isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined
    }

    const result = await getProjectsByUserId(userId, query)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateProjectDto & { userId: string } = await request.json()
    const { userId, ...projectData } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const project = await createProject({
      ...projectData,
      userId
    })

    return NextResponse.json({
      success: true,
      data: project
    }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
