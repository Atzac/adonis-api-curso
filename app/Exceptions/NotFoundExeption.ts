/* eslint-disable prettier/prettier */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'

export default class NotFoundException extends Exception {
  public async handle(error, ctx: HttpContextContract) {
    ctx.response.status(error.status).send({ error: { message: error.message } })
  }
}
