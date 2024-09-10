const knex = require("../database/knex")
const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError.js")
const crypto = require("crypto")
const { request } = require("http")

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const checkUserExists = await knex("users").where({ email })

    if (checkUserExists.length > 0) {
      throw new AppError("Este e-mail já está em uso.")
    }

    const hashedPassword = await hash(password, 8)

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    })

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id

    const user = await knex("users").where("id", user_id).first()

    if (!user) {
      throw new AppError("Usuário não encontrado.")
    }

    const userWithUpdatedEmail = await knex("users")
      .where("email", email)
      .whereNot("id", user_id)
      .first()

    if (userWithUpdatedEmail) {
      throw new AppError("Este e-mail já está em uso.")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (old_password) {
      if (password && !old_password) {
        throw new AppError(
          "Você deve informar a senha antiga para definir a nova senha"
        )
      }

      if (password && old_password) {
        const checkOldPassword = await compare(old_password, user.password)

        if (!checkOldPassword) {
          throw new AppError("A senha antiga não confere")
        }

        user.password = await hash(password, 8)
      }

      if (password === old_password) {
        throw new AppError("A nova senha é igual à anterior!")
      }
    }

    await knex("users").where("id", user_id).update(user)

    return response.status(200).json()
  }

  async delete(request, response) {
    const user_id = request.user.id

    await knex("users").where({ id: user_id }).delete()

    return response.json()
  }
}

module.exports = UsersController
