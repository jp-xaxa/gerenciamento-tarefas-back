const knex = require("../database/knex")
const AppError = require("../utils/AppError.js")

class TaskFinishedController {
  async update(request, response) {
    const { id } = request.params
    const { finished } = request.body

    const task = await knex("tasks").where({ id }).first()

    if (!task) {
      throw new AppError("Tarefa não encontrada.")
    }

    try {
      const finishedValue = finished ? 1 : 0

      await knex("tasks").where({ id }).update({
        finished: finishedValue,
        updated_at: knex.fn.now(),
      })

      return response
        .status(200)
        .json({ message: "Status da tarefa atualizado com sucesso." })
    } catch (error) {
      return response
        .status(500)
        .json({ error: "Erro ao atualizar o status da tarefa." })
    }
  }
}

module.exports = TaskFinishedController
