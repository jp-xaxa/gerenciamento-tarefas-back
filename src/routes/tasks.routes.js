const { Router } = require("express")

const TasksController = require("../controllers/TasksController")
const TaskFinishedController = require("../controllers/TaskFinishedController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const tasksRoutes = Router()

const tasksController = new TasksController()
const taskFinishedController = new TaskFinishedController()

tasksRoutes.use(ensureAuthenticated)

tasksRoutes.post("/", tasksController.create)
tasksRoutes.put("/:id", tasksController.update)
tasksRoutes.patch("/finished/:id", taskFinishedController.update)
tasksRoutes.get("/", tasksController.index)
tasksRoutes.get("/:id", tasksController.show)
tasksRoutes.delete("/:id", tasksController.delete)

module.exports = tasksRoutes
