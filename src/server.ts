import { fastify } from 'fastify'
import { getStudentId, getStudents } from './route/list/get-students-route'
import { creatingAcessData } from './route/create/create-acessData-route'
import { deleteAcessData } from './route/delete/delete-acessData-route'
import { updateAcessData } from './route/update/update-acesseData-route'
import { createdStudents } from './route/create/create-student-route'
import { createdPreSchool } from './route/create/create-preschool-route'
import {
  getCourse,
  getCourseId,
  getCourseInStudent,
  getStudentInCourse,
} from './route/list/get-course-route'
import { getAcessData } from './route/list/get-accessData-route'
import { createCourses } from './route/create/create-course-route'
import { createEnrollments } from './route/create/create-enrollment-route'
import {
  getEnrollmentInCourse,
  getEnrollments,
} from './route/list/get-enrollments-route'

const app = fastify()

app.register(getStudents)
app.register(getCourse)
app.register(getCourseId)
app.register(getAcessData)
app.register(getStudentId)
app.register(getEnrollments)
app.register(getEnrollmentInCourse)
app.register(getStudentInCourse)
app.register(getCourseInStudent)

app.register(creatingAcessData)
app.register(createdStudents)
app.register(createCourses)
app.register(createEnrollments)

app.register(createdPreSchool)

app.register(updateAcessData)

app.register(deleteAcessData)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('http server running')
  })
