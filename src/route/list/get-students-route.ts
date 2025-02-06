import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prismaClient } from '../../../database/script'
import z from 'zod'
import type { FastifyTypeInstance } from '../../type'

export const getStudents: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  const paramsSchema = z.object({
    id: z.string(),
  })

  app.get('/students/:id', async (request, reply) => {
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
      },
    })

    if (!student) {
      return reply.status(404).send({ message: 'Estudante não encontrado' })
    }

    const numberStudent = student.id
    const fullName = `${student.name} ${student.surname}`

    console.log(`numero de estudante: ${numberStudent}`)
    console.log(`nome completo: ${fullName}`)

    return reply.status(200).send({ student })
  })

  app.get('/students-discipline/:id', async (request, reply) => {
    const result = paramsSchema.safeParse(request.params)
    if (!result.success) {
      return reply.status(400).send({
        message: 'ID inválido',
        errors: result.error.errors,
      })
    }

    const { id } = result.data

    try {
      const student = await prismaClient.student.findUnique({
        where: { id },
        include: {
          StudentDiscipline: {
            include: {
              discipline: true,
            },
          },
        },
      })

      if (!student) {
        return reply.status(404).send({ message: 'Estudante não encontrado' })
      }

      return reply
        .status(200)
        .send({ message: 'Estudante encontrado', student })
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar estudante' })
    }
  })

  app.get('/students-course/:id', async (request, reply) => {
    const result = paramsSchema.safeParse(request.params)
    if (!result.success) {
      return reply.status(400).send({
        message: 'ID inválido',
        errors: result.error.errors,
      })
    }

    const { id } = result.data

    try {
      const student = await prismaClient.student.findUnique({
        where: { id },
        select: {
          name: true,
          surname: true,
          id: true,

          Registration: {
            select: {
              course: {
                select: {
                  levelCourse: true,
                  courseName: true,
                  period: true,
                },
              },
            },
          },
          // StudentDiscipline: {
          //   where: { status: 'NAO_INSCRITO' },
          //   select: {
          //     discipline: {
          //       select: {
          //         codigo: true,
          //         disciplineName: true,
          //         semester: true,
          //       },
          //     },
          //   },
          // },
        },
      })

      if (!student) {
        return reply.status(404).send({ message: 'Estudante não encontrado' })
      }

      console.log(JSON.stringify(student, null, 2))

      return reply
        .status(200)
        .send({ message: 'Estudante encontrado', student })
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar estudante' })
    }
  })

  app.get('/students-course-discipline/:id', async (request, reply) => {
    const result = paramsSchema.safeParse(request.params)
    if (!result.success) {
      return reply.status(400).send({
        message: 'ID inválido',
        errors: result.error.errors,
      })
    }

    const { id } = result.data

    try {
      const student = await prismaClient.student.findUnique({
        where: { id },
        select: {
          name: true,
          surname: true,
          id: true,
          StudentDiscipline: {
            select: {
              status: true,
              discipline: {
                select: {
                  codigo: true,
                  disciplineName: true,
                  Course: {
                    select: {
                      levelCourse: true,
                      courseName: true,
                      period: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      if (!student) {
        return reply.status(404).send({ message: 'Estudante não encontrado' })
      }

      console.log(JSON.stringify(student, null, 2))

      return reply
        .status(200)
        .send({ message: 'Estudante encontrado', student })
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar estudante' })
    }
  })
}
