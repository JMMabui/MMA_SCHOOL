import z from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createRegistration } from '../../function/registration/create-registration'
import { prismaClient } from '../../../database/script'
import type { FastifyTypeInstance } from '../../type'

export const createRegistrations: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/registration',
    {
      schema: {
        tags: ['registration'],
        description:
          'create relation between student and course, and see status if is subscrib or not',
        body: z.object({
          course_id: z.string(),
          student_id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { course_id, student_id } = request.body

        await createRegistration({
          course_id,
          student_id,
        })

        reply.code(201).send({ message: 'enrollment created successfully' })
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

  app.put(
    '/registration-status/:id',
    {
      schema: {
        tags: ['registration'],
        description:
          'update var registration status after validate registration',
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          registrationStatus: z.enum([
            'PENDENTE',
            'CONFIRMADO',
            'CANCELADO',
            'TRANCADO',
            'INSCRITO',
            'NAO_INSCRITO',
          ]),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { registrationStatus } = request.body

        // Verificar se o registro existe
        const registration = await prismaClient.registration.findUnique({
          where: { id }, // ou { id: id }, dependendo do seu banco
        })

        if (!registration) {
          return reply.status(404).send({ message: 'Registro não encontrado' })
        }

        // Atualizar o status de registro
        await prismaClient.registration.update({
          where: { id }, // ou { id: id }, dependendo do seu banco
          data: { registrationStatus },
        })

        return reply.code(200).send({
          message: `Status de registro atualizado para ${registrationStatus} com sucesso`,
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.errors,
          })
        }

        return reply.status(500).send({ message: 'Erro interno no servidor' })
      }
    }
  )
}
