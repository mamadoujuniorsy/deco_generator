import { NextResponse } from 'next/server'
import { createRoom, getRoomsByProjectId } from '@/libs/models/Room'
import { RoomQuery, RoomType } from '@/types/api'
import prisma from '@/libs/db'

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
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID not found' },
        { status: 401 }
      )
    }

    // Ensure user exists
    let user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      console.log('⚠️ User does not exist, creating...')
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `user_${userId.substring(0, 8)}@temp.com`,
          name: 'Temporary User',
          userType: 'individual',
          password: 'temp_hashed_password',
          isVerified: true
        }
      })
      console.log('✅ User created:', user.id)
    }

    const formData = await request.formData()
    
    const projectId = formData.get('projectId') as string
    const projectName = formData.get('projectName') as string
    const projectDescription = formData.get('projectDescription') as string
    const lengthRaw = formData.get('length') as string | null
    const widthRaw = formData.get('width') as string | null
    const heightRaw = formData.get('height') as string | null
    const length = Number.isFinite(Number(lengthRaw)) ? parseFloat(lengthRaw as string) : 0
    const width = Number.isFinite(Number(widthRaw)) ? parseFloat(widthRaw as string) : 0
    const height = Number.isFinite(Number(heightRaw)) ? parseFloat(heightRaw as string) : 0
    const materials = formData.get('materials') as string
    const ambientColor = formData.get('ambientColor') as string
    const imageFile = formData.get('images') as File

    console.log('📝 Room creation request:', { projectId, projectName, userId })

    if (!projectName || !projectDescription || !imageFile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify if projectId exists, if not create a new project
    let finalProjectId = projectId
    if (projectId) {
      const existingProject = await prisma.project.findUnique({
        where: { id: projectId }
      })
      if (!existingProject) {
        console.log('⚠️ ProjectId provided but does not exist, creating new project...')
        finalProjectId = null as any
      }
    }
    
    if (!finalProjectId) {
      console.log('🆕 Creating new project...')
      const newProject = await prisma.project.create({
        data: {
          userId,
          name: projectName,
          description: projectDescription,
          type: 'RESIDENTIAL',
          style: 'CONTEMPORARY',
          isActive: true,
          roomCount: 0
        }
      })
      finalProjectId = newProject.id
      console.log('✅ Created new project:', finalProjectId)
    }

    // Convert image to base64 for storage (skip blob upload)
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`

    // Detect room type from prompt
    const promptLower = projectDescription.toLowerCase()
    let detectedRoomType = RoomType.LIVING_ROOM // Default
    
    if (promptLower.includes('chambre') || promptLower.includes('bedroom') || promptLower.includes('dormir')) {
      detectedRoomType = RoomType.BEDROOM
    } else if (promptLower.includes('cuisine') || promptLower.includes('kitchen')) {
      detectedRoomType = RoomType.KITCHEN
    } else if (promptLower.includes('salle de bain') || promptLower.includes('bathroom') || promptLower.includes('douche')) {
      detectedRoomType = RoomType.BATHROOM
    } else if (promptLower.includes('salle à manger') || promptLower.includes('dining')) {
      detectedRoomType = RoomType.DINING_ROOM
    }
    
    console.log('🔍 Room type détecté:', detectedRoomType)

    // Create room with base64 image. Ensure numeric dimensions are top-level fields
    const roomData = {
      projectId: finalProjectId,
      name: projectName,
      type: detectedRoomType,
      length,
      width,
      height,
      materials: materials ? materials.split(',').map((m) => m.trim()) : [],
      ambientColor: ambientColor || undefined,
      freePrompt: projectDescription, // Use projectDescription as freePrompt
      originalImageUrl: base64Image // Store as base64
    }

    const room = await createRoom(roomData as any)

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
