import prisma from '@/libs/db'
import { DesignStatus } from '@/types/api'

export async function createDesign(designData: {
  roomId: string;
  imageUrl: string;
  prompt: string;
  aiProvider: string;
  status?: DesignStatus;
  processingTime?: number;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  allImageUrls: string[];
}) {
  return await prisma.design.create({
    data: designData,
    include: {
      room: true
    }
  })
}

export async function getDesignById(id: string) {
  return await prisma.design.findUnique({
    where: { id },
    include: {
      room: true
    }
  })
}

export async function getDesignsByRoomId(roomId: string, query?: { page?: number; limit?: number; status?: DesignStatus; aiProvider?: string }) {
  const { page = 1, limit = 10, status, aiProvider } = query || {}
  const skip = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { roomId }
  if (status) where.status = status
  if (aiProvider) where.aiProvider = aiProvider

  const [designs, total] = await Promise.all([
    prisma.design.findMany({
      where,
      skip,
      take: limit,
      include: {
        room: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.design.count({ where })
  ])

  return {
    designs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function updateDesign(id: string, updates: Partial<{
  imageUrl?: string;
  prompt?: string;
  aiProvider?: string;
  status?: DesignStatus;
  processingTime?: number;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
  allImageUrls?: string[];
}>) {
  return await prisma.design.update({
    where: { id },
    data: updates,
    include: {
      room: true
    }
  })
}

export async function deleteDesign(id: string) {
  return await prisma.design.delete({
    where: { id }
  })
}

export async function updateDesignStatus(id: string, status: DesignStatus, error?: string) {
  return await prisma.design.update({
    where: { id },
    data: {
      status,
      error,
      updatedAt: new Date()
    },
    include: {
      room: true
    }
  })
}
