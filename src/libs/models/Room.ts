import prisma from '@/libs/db'
import { RoomType } from '@/types/api'

export async function createRoom(roomData: {
  projectId: string;
  name?: string;
  type: RoomType;
  length: number;
  width: number;
  height: number;
  materials: string[];
  ambientColor?: string;
  freePrompt?: string;
}) {
  const area = roomData.length * roomData.width
  const volume = area * roomData.height
  return await prisma.room.create({
    data: {
      ...roomData,
      area,
      volume,
      designCount: 0,
      uploadCount: 0
    },
    include: {
      project: true,
      designs: true,
      uploads: true
    }
  })
}

export async function getRoomById(id: string) {
  return await prisma.room.findUnique({
    where: { id },
    include: {
      project: true,
      designs: true,
      uploads: true
    }
  })
}

export async function getRoomsByProjectId(projectId: string, query?: { page?: number; limit?: number; type?: RoomType }) {
  const { page = 1, limit = 10, type } = query || {}
  const skip = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { projectId }
  if (type) where.type = type

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      skip,
      take: limit,
      include: {
        designs: true,
        uploads: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.room.count({ where })
  ])

  return {
    rooms,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function updateRoom(id: string, updates: Partial<{
  name?: string;
  type?: RoomType;
  length?: number;
  width?: number;
  height?: number;
  materials?: string[];
  ambientColor?: string;
  freePrompt?: string;
  originalImageUrl?: string;
}>) {
  // If dimensions change, recalculate area and volume
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = { ...updates }
  if (updates.length || updates.width || updates.height) {
    const room = await getRoomById(id)
    if (room) {
      const length = updates.length ?? room.length
      const width = updates.width ?? room.width
      const height = updates.height ?? room.height
      data.area = length * width
      data.volume = data.area * height
    }
  }

  return await prisma.room.update({
    where: { id },
    data,
    include: {
      project: true,
      designs: true,
      uploads: true
    }
  })
}

export async function deleteRoom(id: string) {
  return await prisma.room.delete({
    where: { id }
  })
}

export async function updateCounts(roomId: string) {
  const [designCount, uploadCount] = await Promise.all([
    prisma.design.count({ where: { roomId } }),
    prisma.upload.count({ where: { roomId } })
  ])
  return await prisma.room.update({
    where: { id: roomId },
    data: { designCount, uploadCount }
  })
}
