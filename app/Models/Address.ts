import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Student from './Student'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public 'id': number

  @column()
  public 'street': string

  @column()
  public 'number': number

  @column()
  public 'neighborhood': string

  @column()
  public 'city': string

  @column()
  public 'country': string

  @column()
  public 'student_id': number

  @belongsTo(() => Student, { foreignKey: 'student_id' })
  public 'student': BelongsTo<typeof Student>

  @column.dateTime({ autoCreate: true })
  public 'createdAt': DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public 'updatedAt': DateTime
}
