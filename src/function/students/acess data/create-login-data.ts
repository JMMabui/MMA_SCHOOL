import { string } from 'zod'
import { prismaClient } from '../../../../database/script'

interface createLoginSchema {
  email: string
  contact: string
  password: string
}

export async function createLogin({
  email,
  contact,
  password,
}: createLoginSchema) {
  const login = await prismaClient.loginData.create({
    data: {
      email,
      contact,
      password,
    },
  })

  return login
}
