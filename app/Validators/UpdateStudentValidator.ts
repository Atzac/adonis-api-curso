import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateStudentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    birth_date: schema.date({ format: 'dd/mm/yyyy' }),
    cpf: schema.string({}, [
      rules.unique({
        table: 'students',
        column: 'cpf',
        whereNot: { id: this.ctx.params.id },
      }),
    ]),
    course_id: schema.number([rules.exists({ table: 'courses', column: 'id' })]),
  })

  public messages: CustomMessages = {}
}
