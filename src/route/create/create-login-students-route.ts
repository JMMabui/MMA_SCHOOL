import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { FastifyTypeInstance } from '../../type'
import { createStudent } from '../../function/students/create-login-students'
import z from 'zod'
import dayjs from 'dayjs'

export const createdStudentsLogin: FastifyPluginAsyncZod = async (
  app: FastifyTypeInstance,
  opts
) => {
  app.post(
    '/students-login',
    {
      schema: {
        description: 'Cria um novo estudante',
        tags: ['students'],
        body: z.object({
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
            password: z.string().min(8, {
              message: 'Password must be at least 8 characters long',
            }),
            contact: z
              .string()
              .min(9, { message: 'Contact must be at least 9 digits' }),
          }),
        }), // Zod schema do corpo da requisição
      },
    },
    async (request, reply) => {
      try {
        // Validando os dados da requisição usando Zod
        const {
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
        } = request.body
        // Chamando a função para criar o estudante
        const student = await createStudent({
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
        })

        console.log(student)

        // Retornando a resposta de sucesso
        reply.code(201).send(student)
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Retornando erros de validação Zod
          reply.code(400).send({
            message: 'Erro de validação',
            errors: error.errors,
          })
        } else {
          // Retornando erro genérico para outros tipos de falha
          reply.code(500).send({
            message: 'Erro ao criar o estudante',
          })
        }
      }
    }
  )
}
