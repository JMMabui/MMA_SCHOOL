import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prismaClient } from '../../../database/script'
import { z } from 'zod'
import { createCourse } from '../../function/course/create-course'
import type { FastifyTypeInstance } from '../../type'

export const createCourses: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/courses',
    {
      schema: {
        tags: ['course'],
        description: 'create course',
        body: z.object({
          courseName: z.string(),
          courseDuration: z.number(),
          courseDescription: z.string(),
          levelCourse: z.enum([
            'CURTA_DURACAO',
            'TECNICO_MEDIO',
            'LICENCIATURA',
            'MESTRADO',
            'RELIGIOSO',
          ]),
          period: z.enum(['LABORAL', 'POS_LABORAL']),
          totalVacancies: z.number(),
          availableVacancies: z.number(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const {
          availableVacancies,
          courseDescription,
          courseDuration,
          courseName,
          levelCourse,
          period,
          totalVacancies,
        } = request.body
        await createCourse({
          courseName,
          courseDuration,
          courseDescription,
          levelCourse,
          period,
          totalVacancies,
          availableVacancies,
        })

        return reply.code(201).send({ message: 'Course created successfully' })
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
    '/course',
    {
      schema: {
        tags: ['course'],
        description: 'list all course',
      },
    },
    async (request, reply) => {
      const course = await prismaClient.course.findMany()
      return { course }
    }
  )
}
