import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Teacher from 'App/Models/Teacher'
import { validator } from '@ioc:Adonis/Core/Validator'
import CreateTeacherValidator from 'App/Validators/CreateTeacherValidator'
import { CustomMessages } from 'App/Validators/CustomMessages'
import Database from '@ioc:Adonis/Lucid/Database'
import moment from 'moment'
import UpdateTeacherValidator from 'App/Validators/UpdateTeacherValidator'

export default class TeachersController {
  public async index(ctx: HttpContextContract) {
    const { page, perPage, noPaginate } = ctx.request.qs()
    if (noPaginate) {
      return Teacher.query()
    }
    return Teacher.query().paginate(page, perPage)
  }

  public async show(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    return Teacher.findBy('id', id)
  }

  public async store(ctx: HttpContextContract) {
    const body = ctx.request.body()
    const teacherValidator = new CreateTeacherValidator(ctx)

    await validator.validate({
      schema: teacherValidator.schema,
      data: body,
      messages: new CustomMessages().messages,
    })

    const trx = await Database.transaction()
    try {
      const teacher = await Teacher.create(
        {
          ...body,
          birth_date: moment(body.birth_date, 'DD/MM/YYYY').toDate(),
        },
        { client: trx }
      )
      await teacher.useTransaction(trx).related('address').create(body.address)

      await trx.commit()
      return ctx.response.created({ message: 'Teacher created successfully' })
    } catch (error) {
      trx.rollback()
      return error
    }
  }

  public async update(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const body = ctx.request.body()

    const studentValidator = new UpdateTeacherValidator(ctx)

    await validator.validate({
      schema: studentValidator.schema,
      data: body,
      messages: new CustomMessages().messages,
    })

    const trx = await Database.transaction()
    try {
      const teacher = await Teacher.findByOrFail('id', id)
      await teacher
        .merge({ ...body, birth_date: moment(body.birth_date, 'DD/MM/YYYY').toDate() })
        .useTransaction(trx)
        .save()

      await teacher.useTransaction(trx).related('address').updateOrCreate(
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
      return ctx.response.created({ message: 'Teacher update successfully' })
    } catch (error) {
      trx.rollback()
      return error
    }
  }

  public async destroy(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const course = await Teacher.findBy('id', id)
    return course?.delete()
  }
}
