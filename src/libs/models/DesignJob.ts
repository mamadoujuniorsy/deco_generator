// lib/models/DesignJob.ts
import prisma from '@/libs/db'
import { DesignJob } from '@/libs/types'

export async function createJob(jobData: Omit<DesignJob, 'id' | 'createdAt' | 'updatedAt'>) {
  return await prisma.designJob.create({
    data: {
      ...jobData,
      generatedImages: jobData.generatedImages || [],
    }
  })
}

export async function getJobBySessionId(sessionId: string) {
  return await prisma.designJob.findUnique({
    where: { sessionId }
  })
}

export async function updateJob(
  sessionId: string,
  updates: Partial<Omit<DesignJob, 'id' | 'sessionId' | 'createdAt'>>
) {
  return await prisma.designJob.update({
    where: { sessionId },
    data: updates
  })
}

export async function deleteJob(sessionId: string) {
  return await prisma.designJob.delete({
    where: { sessionId }
  })
}