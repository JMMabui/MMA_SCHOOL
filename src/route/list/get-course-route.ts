import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prismaClient } from '../../../database/script'
import z from 'zod'

// lista um curso específico
export const getCourseId: FastifyPluginAsyncZod = async (app, opts) => {
  app.get('/course/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const result = paramsSchema.safeParse(request.params)

    if (!result.success) {
      return reply.status(400).send({
        message: 'ID inválido',
        errors: result.error.errors,
      })
    }
    const { id } = result.data

    const course = await prismaClient.course.findUnique({
      where: { id },
    })

    if (!course) {
      return reply.status(404).send({ message: 'Curso não encontrado' })
    }

    return reply.status(200).send({ message: 'Curso encontrado', course })
  })
}

// Lista todos os estudantes inscritos em um curso
export const getStudentInCourse: FastifyPluginAsyncZod = async (app, opts) => {
  app.get('/course-student/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const result = paramsSchema.safeParse(request.params)

    if (!result.success) {
      return reply.status(400).send({
        message: 'ID inválido',
        errors: result.error.errors,
      })
    }
    const { id } = result.data

    const course = await prismaClient.course.findUnique({
      where: { id },
      select: {
        levelCourse: true,
        courseName: true,
        period: true,
        Registration: {
          include: {
            student: true,
          },
        },
      },
    })

    // Contar o número de estudantes inscritos no curso
    const countStudentRegistration = await prismaClient.registration.count({
      where: { id },
    })

    if (!course) {
      return reply.status(404).send({ message: 'Curso não encontrado' })
    }

    return reply
      .status(200)
      .send({ message: 'Curso encontrado', course, countStudentRegistration })
  })
}

// Lista todos os cursos de um estudante
export const getCourseInStudent: FastifyPluginAsyncZod = async (app, opts) => {
  app.get('/student-course/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const result = paramsSchema.safeParse(request.params)

    if (!result.success) {
      return reply.status(400).send({
        message: 'ID inválido',
        errors: result.error.errors,
      })
    }
    const { id } = result.data

    const student = await prismaClient.student.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        Registration: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!student) {
      return reply.status(404).send({ message: 'Estudante não encontrado' })
    }

    return reply.status(200).send({ message: 'Estudante encontrado', student })
  })
}

// Definir o esquema de validação para o parâmetro 'id'
