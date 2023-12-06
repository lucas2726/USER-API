const knex = require("../database/connection")
const bcrypt = require("bcrypt")

class User {
async new(email, password, name) {
    try {
        let hash = await bcrypt.hash(password, 10)

        await knex.insert({email, password: hash, name, role:0}).table("users")
    } catch (error) {
        console.log(error)
    }
}
async findEmail(email) { //Para validar o email
    try {
        let result = await knex.select("*").from("users").where({email: email}) 

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
}

module.exports = new User()