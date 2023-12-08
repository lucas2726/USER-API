const knex = require("../database/connection")
const bcrypt = require("bcrypt")
const PasswordToken = require("./PasswordToken")



class User {

    async findAll() {
        try {
            let result = await knex.select(["id", "email", "role", "name"]).table("users")
            return result
        } catch (err) {
            console.log(err)
            return []
        }
    }

    async findById(id) {
        try {
            let result = await knex.select(["id", "email", "role", "name"]).where({ id: id }).table("users")

            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }

        } catch (err) {
            console.log(err)
            return undefined
        }
    }

    async findByEmail(email) {
        try {
            let result = await knex.select(["id", "email","password", "role", "name"]).where({email: email}).table("users")

            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }

        } catch (err) {
            console.log(err)
            return undefined
        }
    
        /*
        Este é um código JavaScript que implementa uma função assíncrona chamada `findByEmail` em um modelo de usuário. Aqui está uma explicação detalhada:

1. `async findByEmail(email) { ... }`: Esta é uma função assíncrona chamada `findByEmail` que recebe um argumento: `email`.

2. `let result = await knex.select(["id", "email","password", "role", "name"]).where({email: email}).table("users")`: Este código está usando a biblioteca `knex` para fazer uma consulta SQL no banco de dados. Ele seleciona as colunas "id", "email", "password", "role" e "name" da tabela "users" onde o email corresponde ao email fornecido. A palavra-chave `await` é usada para esperar a promessa ser resolvida.

3. `if (result.length > 0) { ... } else { ... }`: Se a consulta retornar algum resultado, a função retorna o primeiro resultado. Se não, retorna `undefined`.

4. `catch (err) { ... }`: Este bloco de código captura qualquer erro que possa ocorrer durante a execução da consulta SQL e retorna `undefined`.

Espero que isso ajude a entender o código! Se você tiver mais perguntas, fique à vontade para perguntar.
        */
    }  

    async new(email, password, name) {
        try {
            let hash = await bcrypt.hash(password, 10)

            await knex.insert({ email, password: hash, name, role: 0 }).table("users")
        } catch (error) {
            console.log(error)
        }
    }
    async findEmail(email) { //Para validar o email
        try {
            let result = await knex.select("*").from("users").where({ email: email })

            if (result.length > 0) {
                return true
            } else {
                return false
            }

        } catch (error) {
            console.log(error)
            return false
        }
    }

    async update(id, email, name, role) {

        let user = await this.findById(id)

        if (user != undefined) {

            let editUser = {}

            if (email != undefined) {
                if (email != user.email) {
                    let result = await this.findEmail(email)
                    if (result == false) {
                        editUser.email = email
                    } else {
                        return { status: false, err: "O email já está cadastrado" }
                    }
                }
            }

            if (name != undefined) {
                editUser.name = name
            }

            if (role != undefined) {
                editUser.role = role
            }

            try {
                await knex.update(editUser).where({ id: id }).table("users")
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {
            return { status: false, err: "O usuário não existe" }
        }
    }

    async delete(id){
        let user = await this.findById(id)
        if (user != undefined) {
            try {
                await knex.delete().where({ id: id }).table("users")
                return {status: true}
            } catch (err) {
                return { status: false, err: err }
            }
        }else {
            return { status: false, err: "O usuário não existe, portanto não pode ser deletado." }
        }
    }

    async changePassword(newPassword,id,token){
        let hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("users")
        await PasswordToken.setUsed(token) //Para dixer que o token foi usado
    }

}

module.exports = new User()