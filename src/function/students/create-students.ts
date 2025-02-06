import type {
  Gender,
  MaritalStatus,
  ProvincyAddress,
  Type,
} from '@prisma/client'
import { prismaClient } from '../../../database/script'

interface createUserRequest {
  // Gerado através de uma função que gera um id único de acordo com os requisitos
  id: string
  surname: string
  name: string
  dataOfBirth: Date
  placeOfBirth: string
  gender: Gender
  maritalStatus: MaritalStatus
  provincyAddress: ProvincyAddress
  address: string
  fatherName: string
  motherName: string
  documentType: Type
  documentNumber: string
  documentIssuedAt: Date
  documentExpiredAt: Date
  nuit: number
  // login_id: string
}

export async function createStudents({
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
  // login_id,
}: createUserRequest) {
  console.log('bd Inicializado')

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
      // login_id,
    },
  })

  return student
  // Primeiro cria o estudante
  // const student = await prismaClient.student.create({
  //   data: {
  //     id,
  //     surname,
  //     name,
  //     dataOfBirth,
  //     placeOfBirth,
  //     gender,
  //     maritalStatus,
  //     provincyAddress,
  //     address,
  //     fatherName,
  //     motherName,
  //     documentType,
  //     documentNumber,
  //     documentIssuedAt,
  //     documentExpiredAt,
  //     nuit,
  //   },
  // })
  // return student
}
