import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createdPreInstituto } from '../../function/preInstitute/create-preInstituto'
import type { FastifyTypeInstance } from '../../type'
import { prismaClient } from '../../../database/script'

export const createdPreInstitutos: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/pre-instituto',
    {
      schema: {
        tags: ['pre-school'],
        description: 'create a pre school information',
        body: z.object({
          schoolLevel: z.enum(['CLASSE_10', 'CLASSE_12', 'LICENCIATURA']),
          schoolName: z.string(),
          schoolProvincy: z.enum([
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
          student_id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { schoolLevel, schoolName, schoolProvincy, student_id } =
          request.body
        const preinstituto = await createdPreInstituto({
          schoolLevel,
          schoolName,
          schoolProvincy,
          student_id,
        })

        reply
          .code(201)
          .send({ message: 'pre-instituto created successfully', preinstituto })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.errors,
          })
        }
        reply.code(500).send({ message: 'Internal server error' })
      }
    }
  )

  app.get(
    '/pre-instituto',
    {
      schema: {
        tags: ['pre-school'],
        description: 'list all pre-isntitutional',
      },
    },
    async (request, reply) => {
      const preInstituto = await prismaClient.preSchool.findMany()
      return preInstituto
    }
  )
}
