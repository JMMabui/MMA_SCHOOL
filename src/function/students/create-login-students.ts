import type {
  Gender,
  MaritalStatus,
  ProvincyAddress,
  Type,
} from '@prisma/client'
import { prismaClient } from '../../../database/script'
import bcrypt from 'bcryptjs'
import dayjs from 'dayjs'
import z from 'zod'

// Definição da validação Zod para os dados
const createStudentSchema = z.object({
  id: z.string(),
  surname: z.string(),
  name: z.string(),
  dataOfBirth: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format for dataOfBirth',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  placeOfBirth: z.string(),
  gender: z.enum(['MASCULINO', 'FEMININO']),
  maritalStatus: z.enum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO']),
  provincyAddress: z.enum([
    'MAPUTO_CIDADE',
    'MAPUTO_PROVINCIA',
    'GAZA',
    'INHAMBANE',
    'MANICA',
    'SOFALA',
    'TETE',
    'ZAMBEZIA',
    'NAMPULA',
    'CABO_DELGADO',
    'NIASSA',
  ]),
  address: z.string(),
  fatherName: z.string(),
  motherName: z.string(),
  documentType: z.enum(['BI', 'PASSAPORTE']),
  documentNumber: z.string(),
  documentIssuedAt: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format for documentIssuedAt',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  documentExpiredAt: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Invalid date format for documentExpiredAt',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  nuit: z.number().refine(nuit => nuit.toString().length === 9, {
    message: 'O NUIT deve ter exatamente 9 dígitos',
  }),
  loginData: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    contact: z
      .string()
      .min(10, { message: 'Contact must be at least 10 digits' }),
  }),
})

export type CreateStudentInput = z.infer<typeof createStudentSchema>

// Função para criar o estudante
export async function createStudent({
  id,
  surname,
  name,
  dataOfBirth,
  placeOfBirth,
  gender,
  maritalStatus,
  provincyAddress,
  address,
  fatherName,
  motherName,
  documentType,
  documentNumber,
  documentIssuedAt,
  documentExpiredAt,
  nuit,
  loginData,
}: CreateStudentInput) {
  // Hash da senha
  const hashedPassword = await bcrypt.hash(loginData.password, 10)

  // Criando o loginData primeiro
  const createdLoginData = await prismaClient.loginData.create({
    data: {
      email: loginData.email,
      contact: loginData.contact,
      password: hashedPassword,
    },
  })

  // Agora criando o estudante e associando o loginData criado
  const student = await prismaClient.student.create({
    data: {
      id,
      surname,
      name,
      dataOfBirth,
      placeOfBirth,
      gender,
      maritalStatus,
      provincyAddress,
      address,
      fatherName,
      motherName,
      documentType,
      documentNumber,
      documentIssuedAt,
      documentExpiredAt,
      nuit,
      loginData: {
        connect: { id: createdLoginData.id },
      },
    },
  })

  return student
}
