import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'

export default class CoursesController {
  public async index(ctx: HttpContextContract) {
    const { page, perPage, noPaginate } = ctx.request.qs()
    if (noPaginate) {
      return Course.query()
    }
    return Course.query().paginate(page, perPage)
  }

  public async show(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    return Course.findBy('id', id)
  }

  public async store(ctx: HttpContextContract) {
    const body = ctx.request.body()
    return Course.create(body)
  }

  public async update(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const body = ctx.request.body()
    const course = await Course.findByOrFail('id', id)

    return course.merge({ ...body }).save()
  }

  public async destroy(ctx: HttpContextContract) {
    const id = ctx.request.param('id')
    const course = await Course.findBy('id', id)
    return course?.delete()
  }
}
