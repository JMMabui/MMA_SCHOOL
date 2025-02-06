import { Registration } from './../../../node_modules/.prisma/client/index.d'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prismaClient } from '../../../database/script'
import z from 'zod'

export const getDisciplineRoute: FastifyPluginAsyncZod = async (app, opts) => {
  app.get('/discipline/:id', async (request, reply) => {
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

    const discipline = await prismaClient.discipline.findUnique({
      where: { codigo: id },
    })

    if (!discipline) {
      return reply.status(404).send({ message: 'Disciplina não encontrada' })
    }

    return reply
      .status(200)
      .send({ message: 'Disciplina encontrada', discipline })
  })

  app.get('/discipline-student/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().min(1, 'ID não pode ser vazio'), // Garantir que o id não é vazio
    })

    const result = paramsSchema.safeParse(request.params)

    if (!result.success) {
      return reply.status(400).send({
        message: 'ID inválido',
        errors: result.error.errors,
      })
    }

    const { id } = result.data

    try {
      const discipline = await prismaClient.discipline.findUnique({
        where: { codigo: id },
        include: {
          StudentDiscipline: {
            include: {
              student: true,
            },
          },
        },
      })

      if (!discipline) {
        return reply.status(404).send({ message: 'Disciplina não encontrada' })
      }

      return reply.status(200).send({
        message: 'Disciplina encontrada',
        students: discipline.StudentDiscipline.map(
          studentDiscipline => studentDiscipline.student
        ),
      })
    } catch (error) {
      console.error('Erro ao consultar disciplina:', error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  })

  // app.get('/discipline-teacher/:id', async (request, reply) => {
  //   const paramsSchema = z.object({
  //     id: z.string().min(1, 'ID não pode ser vazio'), // Garantir que o id não é vazio
  //   })

  //   const result = paramsSchema.safeParse(request.params)

  //   if (!result.success) {
  //     return reply.status(400).send({
  //       message: 'ID inválido',
  //       errors: result.error.errors,
  //     })
  //   }

  //   const { id } = result.data

  //   try {
  //     const discipline = await prismaClient.discipline.findUnique({
  //       where: { codigo: id },
  //       include: {
  //         TeacherDiscipline: {
  //           include: {
  //             teacher: true,
  //           },
  //         },
  //       },
  //     })

  //     if (!discipline) {
  //       return reply.status(404).send({ message: 'Disciplina não encontrada' })
  //     }

  //     return reply.status(200).send({
  //       message: 'Disciplina encontrada',
  //       teachers: discipline.TeacherDiscipline.map(
  //         teacherDiscipline => teacherDiscipline.teacher
  //       ),
  //     })
  //   } catch (error) {
  //     console.error('Erro ao consultar disciplina:', error)
  //     return reply.status(500).send({ message: 'Erro interno do servidor' })
  //   }
  // })

  // app.get('/discipline-course/:id', async (request, reply) => {
  //   const paramsSchema = z.object({
  //     id: z.string().min(1, 'ID não pode ser vazio'), // Garantir que o id não é vazio
  //   })

  //   const result = paramsSchema.safeParse(request.params)

  //   if (!result.success) {
  //     return reply.status(400).send({
  //       message: 'ID inválido',
  //       errors: result.error.errors,
  //     })
  //   }

  //   const { id } = result.data

  //   try {
  //     const discipline = await prismaClient.discipline.findUnique({
  //       where: { codigo: id },
  //       include: {
  //         Registration: {
  //           include: {
  //             course: true,
  //           },
  //         },
  //       },
  //     })

  //     if (!discipline) {
  //       return reply.status(404).send({ message: 'Disciplina não encontrada' })
  //     }

  //     return reply.status(200).send({
  //       message: 'Disciplina encontrada',
  //       courses: discipline.CourseDiscipline.map(
  //         courseDiscipline => courseDiscipline.course
  //       ),
  //     })
  //   } catch (error) {
  //     console.error('Erro ao consultar disciplina:', error)
  //     return reply.status(500).send({ message: 'Erro interno do servidor' })
  //   }
  // })
}
