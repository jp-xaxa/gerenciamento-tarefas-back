const knex = require("../database/knex")
const AppError = require("../utils/AppError.js")
const dayjs = require("dayjs")
require("dayjs/locale/pt-br")
const relativeTime = require("dayjs/plugin/relativeTime")
const localizedFormat = require("dayjs/plugin/localizedFormat")

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.locale("pt-br")

class TasksController {
  async create(request, response) {
    const { title, date, description, listSubTask } = request.body
    const user_id = request.user.id

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const taskDate = new Date(`${date}T00:00:00`)

    if (taskDate < currentDate) {
      throw new AppError("A data informada é inválida, essa data já passou.")
    }

    const [task_id] = await knex("tasks").insert({
      title,
      date,
      description,
      user_id,
    })

    if (listSubTask.length > 0) {
      const listSubTaskInsert = listSubTask.map((task) => {
        return {
          task_id,
          user_id,
          description: task,
        }
      })

      await knex("sub_tasks").insert(listSubTaskInsert)
    }

    return response.status(200).json({ message: "Tarefa criada com sucesso" })
  }

  async update(request, response) {
    const user_id = request.user.id
    const { id } = request.params
    const { title, date, description, listSubTask } = request.body

    await knex("tasks").where({ id }).update({
      title: title,
      description: description,
      date: date,
      user_id,
      updated_at: knex.fn.now(),
    })

    if (listSubTask && listSubTask.length > 0) {
      await knex("sub_tasks").where({ task_id: id }).delete()

      const subTasksToInsert = listSubTask.map((subTask) => {
        return {
          task_id: id,
          user_id,
          description: subTask.trim(),
        }
      })

      await knex("sub_tasks").insert(subTasksToInsert)
    }

    return response.status(200).json({
      status: 200,
      message: "A tarefa foi atualizada com sucesso.",
    })
  }

  async show(request, response) {
    const { id } = request.params

    const task = await knex("tasks").where({ id }).first()
    const subTasks = await knex("sub_tasks").where({ task_id: id })

    return response.json({ ...task, subTasks })
  }

  async index(request, response) {
    const { title } = request.query
    const user_id = request.user.id

    try {
      let tasks = await knex("tasks")
        .where("user_id", user_id)
        .where("finished", 0)
        .whereLike("title", `%${title}%`)
        .orderBy("date")

      const subTasks = await knex("sub_tasks").where({ user_id })

      const taskWithSubTasks = tasks.map((task) => {
        const filterTask = subTasks.filter((item) => item.task_id === task.id)
        return {
          ...task,
          subTasks: filterTask,
        }
      })

      const thirtyOneDaysFromNow = dayjs()
        .add(31, "day")
        .startOf("day")
        .format("YYYY-MM-DD")

      const groupedTasksByDate = taskWithSubTasks.reduce((acc, task) => {
        const taskDate = task.date
        const isAfter31Days = dayjs(taskDate).isAfter(
          thirtyOneDaysFromNow,
          "day"
        )

        const groupDate = isAfter31Days ? thirtyOneDaysFromNow : taskDate

        const existingDateGroup = acc.find((group) => group.date === groupDate)

        if (existingDateGroup) {
          existingDateGroup.tasks.push(task)
        } else {
          acc.push({
            date: groupDate,
            tasks: [task],
          })
        }

        return acc
      }, [])

      return response.status(200).json(groupedTasksByDate)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: "Internal server error" })
    }
  }

  async delete(request, response) {
    const { id } = request.params

    const task = await knex("tasks").where("id", id).first()

    if (!task) {
      throw new AppError("Tarefa não encontrada.")
    }

    await knex("tasks").where({ id }).delete()

    return response.status(200).json()
  }
}

module.exports = TasksController
