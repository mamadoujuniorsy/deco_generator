import prisma from '@/libs/db'
import { User } from '@/types/api'

export async function createUser(userData: {
  email: string;
  name: string;
  userType: string;
  organization?: string;
  password: string;
}) {
  return await prisma.user.create({
    data: {
      ...userData,
      isVerified: false
    }
  })
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) {
  return await prisma.user.update({
    where: { id },
    data: updates
  })
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id }
  })
}
