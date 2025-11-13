import { NextResponse } from 'next/server'
import { createProject, getProjectsByUserId } from '@/libs/models/Project'
import { CreateProjectDto, ProjectQuery, ProjectType, InteriorStyle } from '@/types/api'

export async function GET(request: Request) {
  try {
    // Get userId from middleware header
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query: ProjectQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      type: searchParams.get('type') as ProjectType,
      style: searchParams.get('style') as InteriorStyle,
      isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined
    }

    const result = await getProjectsByUserId(userId, query)

    console.log('📊 Projects API Response:', {
      userId,
      totalProjects: result.projects.length,
      pagination: result.pagination
    })

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
    // Get userId from middleware header
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const body: CreateProjectDto = await request.json()

    const project = await createProject({
      ...body,
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
