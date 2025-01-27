exports.up = (knex) =>
  knex.schema.createTable("sub_tasks", (table) => {
    table.increments("id")
    table.text("description").notNullable()
    table
      .integer("task_id")
      .references("id")
      .inTable("tasks")
      .onDelete("CASCADE")
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")

    table.timestamp("created_at").default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable("sub_tasks")
