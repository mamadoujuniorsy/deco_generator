import prisma from '@/libs/db'
import { ProjectType, InteriorStyle } from '@/types/api'

export async function createProject(projectData: {
  name: string;
  description?: string;
  type: ProjectType;
  style: InteriorStyle;
  isActive?: boolean;
  userId: string;
}) {
  return await prisma.project.create({
    data: {
      ...projectData,
      roomCount: 0
    },
    include: {
      user: true,
      rooms: true
    }
  })
}

export async function getProjectById(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      user: true,
      rooms: {
        include: {
          designs: true,
          uploads: true
        }
      }
    }
  })
}

export async function getProjectsByUserId(userId: string, query?: { page?: number; limit?: number; type?: ProjectType; style?: InteriorStyle; isActive?: boolean; search?: string }) {
  const { page = 1, limit = 10, type, style, isActive, search } = query || {}
  const skip = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId }
  if (type) where.type = type
  if (style) where.style = style
  if (isActive !== undefined) where.isActive = isActive
  if (search) where.name = { contains: search, mode: 'insensitive' }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      include: {
        rooms: {
          include: {
            designs: true,
            uploads: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.project.count({ where })
  ])

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function updateProject(id: string, updates: Partial<{
  name?: string;
  description?: string;
  type?: ProjectType;
  style?: InteriorStyle;
  isActive?: boolean;
}>) {
  return await prisma.project.update({
    where: { id },
    data: updates,
    include: {
      user: true,
      rooms: true
    }
  })
}

export async function deleteProject(id: string) {
  return await prisma.project.delete({
    where: { id }
  })
}

export async function updateRoomCount(projectId: string) {
  const roomCount = await prisma.room.count({
    where: { projectId }
  })
  return await prisma.project.update({
    where: { id: projectId },
    data: { roomCount }
  })
}
