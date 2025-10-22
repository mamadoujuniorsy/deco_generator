import prisma from '@/libs/db'

export async function createUpload(uploadData: {
  roomId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  cloudinaryId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}) {
  return await prisma.upload.create({
    data: uploadData,
    include: {
      room: true
    }
  })
}

export async function getUploadById(id: string) {
  return await prisma.upload.findUnique({
    where: { id },
    include: {
      room: true
    }
  })
}

export async function getUploadsByRoomId(roomId: string, query?: { page?: number; limit?: number }) {
  const { page = 1, limit = 10 } = query || {}
  const skip = (page - 1) * limit

  const [uploads, total] = await Promise.all([
    prisma.upload.findMany({
      where: { roomId },
      skip,
      take: limit,
      include: {
        room: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.upload.count({ where: { roomId } })
  ])

  return {
    uploads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export async function updateUpload(id: string, updates: Partial<{
  filename?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  cloudinaryId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}>) {
  return await prisma.upload.update({
    where: { id },
    data: updates,
    include: {
      room: true
    }
  })
}

export async function deleteUpload(id: string) {
  return await prisma.upload.delete({
    where: { id }
  })
}
