import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Course from './Course'
import Address from './Address'

export default class Teacher extends BaseModel {
  @column({ isPrimary: true })
  public 'id': number

  @column()
  public 'cpf': string

  @column()
  public 'name': string

  @column()
  public 'birth_date': Date

  @column()
  public 'course_id': number

  @belongsTo(() => Course, { foreignKey: 'course_id' })
  public 'course': BelongsTo<typeof Course>

  @hasOne(() => Address, { foreignKey: 'student_id' })
  public 'address': HasOne<typeof Address>

  @column.dateTime({ autoCreate: true })
  public 'createdAt': DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public 'updatedAt': DateTime
}
