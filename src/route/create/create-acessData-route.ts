import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createLogin } from '../../function/students/acess data/create-login-data'
import bcrypt from 'bcrypt'
import { prismaClient } from '../../../database/script'
import jwt from 'jsonwebtoken'

// Função para encontrar o usuário por email
async function findUserByEmail(email: string) {
  return prismaClient.loginData.findUnique({
    where: { email },
  })
}

// Função para gerar o JWT token
function generateToken(userId: string) {
  const payload = { userId }
  const secretKey = process.env.JWT_SECRET || 'your-secret-key' // Use a chave secreta do ambiente
  const options = { expiresIn: 3600 } // Token expira em 1 hora (3600 segundos)
  return jwt.sign(payload, secretKey, options)
}

export const creatingAcessData: FastifyPluginAsyncZod = async (app, opts) => {
  // Rota de criação de dados de acesso
  app.post('/login', async (request, reply) => {
    const createAcessDataRequest = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      contact: z.string().min(9),
    })

    try {
      const { email, password, contact } = createAcessDataRequest.parse(
        request.body
      )

      const existingUser = await findUserByEmail(email)

      if (existingUser) {
        return reply.status(400).send({
          message: 'Já existe um usuário com este email.',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await createLogin({
        email,
        contact,
        password: hashedPassword,
      })

      reply.code(201).send({ message: 'Acess data created successfully' })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Erro de validação',
          errors: error.errors,
        })
      }
      reply.code(500).send({ message: 'Internal server error' })
    }
  })

  // Rota para autenticação/login
  app.post('/auth/login', async (request, reply) => {
    const loginRequest = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    try {
      const { email, password } = loginRequest.parse(request.body)

      const user = await findUserByEmail(email)

      if (!user) {
        return reply.status(400).send({
          message: 'Email ou senha inválidos.',
        })
      }

      // Comparar a senha fornecida com a armazenada
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return reply.status(400).send({
          message: 'Email ou senha inválidos.',
        })
      }

      // Gerar o token JWT
      const token = generateToken(user.id)

      reply.code(200).send({
        message: 'Login realizado com sucesso.',
        token,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Erro de validação',
          errors: error.errors,
        })
      }
      reply.code(500).send({ message: 'Internal server error' })
    }
  })

  // Rota para buscar todos os dados de login
  app.get('/login', async (request, reply) => {
    const login = await prismaClient.loginData.findMany()
    return login
  })
}
