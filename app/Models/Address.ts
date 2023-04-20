import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Student from './Student'
import Teacher from './Teacher'

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

  @column()
  public 'teacher_id': number

  @hasOne(() => Student, { foreignKey: 'student_id' })
  public 'student': HasOne<typeof Student>

  @hasOne(() => Teacher, { foreignKey: 'teacher_id' })
  public 'teacher': HasOne<typeof Teacher>

  @column.dateTime({ autoCreate: true })
  public 'createdAt': DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public 'updatedAt': DateTime
}
