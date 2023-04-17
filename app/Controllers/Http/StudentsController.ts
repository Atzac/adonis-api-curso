import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Student from 'App/Models/Student'
import CreadStudentValidator from 'App/Validators/CreateStudentValidator'
import { validator } from '@ioc:Adonis/Core/Validator'
import { CustomMessages } from 'App/Validators/CustomMessages'
import UpdateStudentValidator from 'App/Validators/UpdateStudentValidator'
import moment from 'moment'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StudentsController {
  public async index(ctx: HttpContextContract) {
    const { page, perPage, noPaginate } = ctx.request.qs()
    if (noPaginate) {
      return Student.query()
    }
    return Student.query().preload('course').paginate(page, perPage)
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

    const trx = await Database.transaction()
    try {
      const student = await Student.create(
        { ...body, birth_date: moment(body.birth_date, 'DD/MM/YYYY').toDate() },
        { client: trx }
      )
      await student.useTransaction(trx).related('address').create(body.address)

      await trx.commit()
      return ctx.response.created({ message: 'Student created successfully' })
    } catch (error) {
      trx.rollback()
      return error
    }
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

    const trx = await Database.transaction()
    try {
      const students = await Student.findByOrFail('id', id)
      await students
        .merge({ ...body, birth_date: moment(body.birth_date, 'DD/MM/YYYY').toDate() })
        .useTransaction(trx)
        .save()

      await students.useTransaction(trx).related('address').updateOrCreate(
        {},
        {
          street: body.address.street,
          number: body.address.number,
          neighborhood: body.address.neighborhood,
          city: body.address.city,
          country: body.address.country,
        }
      )
      await trx.commit()
      return ctx.response.created({ message: 'Student update successfully' })
    } catch (error) {
      trx.rollback()
      return error
    }
  }

  public async destroy(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const students = await Student.findBy('id', id)

    return students?.delete()
  }
}
