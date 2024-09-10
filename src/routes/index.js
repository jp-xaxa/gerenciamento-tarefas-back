const { Router } = require("express")

const usersRoutes = require("./users.routes")
const sessionsRouter = require("./sessions.routes")
const tasksRouter = require("./tasks.routes")

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRouter)
routes.use("/tasks", tasksRouter)

module.exports = routes
