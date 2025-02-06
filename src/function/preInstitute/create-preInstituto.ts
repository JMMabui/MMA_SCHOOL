import type { PreLevel, ProvincyAddress } from '@prisma/client'
import { prismaClient } from '../../../database/script'

interface preInstitutoRequest {
  schoolLevel: PreLevel
  schoolName: string
  schoolProvincy: ProvincyAddress
  student_id: string
}

export async function createdPreInstituto({
  schoolLevel,
  schoolName,
  schoolProvincy,
  student_id,
}: preInstitutoRequest) {
  const data = await prismaClient.preSchool.create({
    data: {
      schoolLevel,
      schoolName,
      schoolProvincy,
      student_id,
    },
  })

  return data
}
