import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Student from 'App/Models/Student'
import CreadStudentValidator from 'App/Validators/CreateStudentValidator'
import { validator } from '@ioc:Adonis/Core/Validator'
import { CustomMessages } from 'App/Validators/CustomMessages'
import UpdateStudentValidator from 'App/Validators/UpdateStudentValidator'
import moment from 'moment'

export default class StudentsController {
  public async index(ctx: HttpContextContract) {
    const { page, perPage, noPaginate } = ctx.request.qs()
    if (noPaginate) {
      return Student.query()
    }
    return Student.query().paginate(page, perPage)
  }

  public async show(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    return Student.findBy('id', id)
  }

  public async store(ctx: HttpContextContract) {
    const body = ctx.request.body()

    const studentValidator = new CreadStudentValidator(ctx)

    await validator.validate({
      schema: studentValidator.schema,
      data: body,
      messages: new CustomMessages().messages,
    })

    return Student.create({ ...body, birth_date: moment(body.birth_date, 'DD/MM/YYYY').toDate() })
  }

  public async update(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const body = ctx.request.body()

    const studentValidator = new UpdateStudentValidator(ctx)

    await validator.validate({
      schema: studentValidator.schema,
      data: body,
      messages: new CustomMessages().messages,
    })

    const students = await Student.findByOrFail('id', id)

    return students
      .merge({ ...body, birth_date: moment(body.birth_date, 'DD/MM/YYYY').toDate() })
      .save()
  }

  public async destroy(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const students = await Student.findBy('id', id)

    return students?.delete()
  }
}
