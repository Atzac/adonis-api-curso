import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Teacher from 'App/Models/Teacher'

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
    return Teacher.create(body)
  }

  public async update(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const body = ctx.request.body()
    const course = await Teacher.findByOrFail('id', id)

    return course.merge({ ...body }).save()
  }

  public async destroy(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const course = await Teacher.findBy('id', id)
    return course?.delete()
  }
}
