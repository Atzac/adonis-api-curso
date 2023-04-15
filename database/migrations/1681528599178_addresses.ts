import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('street').notNullable()
      table.integer('number').notNullable()
      table.string('neighborhood').notNullable()
      table.string('city').notNullable()
      table.string('country').notNullable()
      table.integer('student_id').unsigned().references('id').inTable('students').notNullable()
      table.datetime('created_at', { useTz: true })
      table.datetime('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
