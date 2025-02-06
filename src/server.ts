import { fastify } from 'fastify'
import { getStudents } from './route/list/get-students-route'
import { creatingAcessData } from './route/create/create-acessData-route'
import { deleteAcessData } from './route/delete/delete-acessData-route'
import { updateAcessData } from './route/update/update-acesseData-route'
import { createdStudents } from './route/create/create-student-route'
import { createdPreInstitutos } from './route/create/create-preschool-route'
import {
  getCourseId,
  getCourseInStudent,
  getStudentInCourse,
} from './route/list/get-course-route'
import { getAcessData } from './route/list/get-accessData-route'
import { createCourses } from './route/create/create-course-route'
import { createRegistrations } from './route/create/create-registration-route'
import {
  getRegistrationInCourse,
  getRegistration,
} from './route/list/get-registration-route'
import { getDisciplineRoute } from './route/list/get-discipline-route'
import { createDisciplines } from './route/create/create-disciplenes-route'
import { updateCourseIdOnDisciplines } from './route/update/update-courseIdOnDisciplines-route'
import { fastifyCors } from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { createdStudentsLogin } from './route/create/create-login-students-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: '*' })

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'api',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(getStudents)
app.register(getCourseId)
app.register(getAcessData)
app.register(getRegistration)
app.register(getDisciplineRoute)
app.register(getRegistrationInCourse)
app.register(getStudentInCourse)
app.register(getCourseInStudent)

app.register(creatingAcessData)
app.register(createdStudentsLogin)
app.register(createdStudents)
app.register(createdPreInstitutos)
app.register(createCourses)
app.register(createRegistrations)
app.register(createDisciplines)

app.register(updateAcessData)
app.register(updateCourseIdOnDisciplines)

app.register(deleteAcessData)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('http server running')
  })
