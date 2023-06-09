import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Student from './Student'
import Teacher from './Teacher'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public 'id': number

  @column()
  public 'name': string

  @hasMany(() => Student, { foreignKey: 'student_id' })
  public 'student': HasMany<typeof Student>

  @hasMany(() => Teacher, { foreignKey: 'teacher_id' })
  public 'teacher': HasMany<typeof Teacher>

  @column.dateTime({ autoCreate: true })
  public 'createdAt': DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public 'updatedAt': DateTime
}
