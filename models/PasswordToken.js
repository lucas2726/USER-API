const knex = require("../database/connection")
const User = require("./User")

class passwordToken {
    async create(email) {
        let user = await User.findByEmail(email)
        if (user != undefined) {
            let token = Date.now()
            try {
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordtokens")
                return { status: true, token: token }
            } catch (err) {
                console.log(err)
                return { status: false, err: err }
            }
        } else {
            return { status: false, err: "O e-mail passado não existe no banco de dados" }
        }
    }

    async validate(token) {
        try {
            let result = await knex.select().where({ token: token }).table("passwordtokens")
            if (result.length > 0) {
                let tk = result[0]
                if (tk.used) {
                    return { status: false }
                } else {
                    return { status: true, token: tk }
                }
            } else {
                return { status: false }
            }
        } catch (err) {
            console.log(err)
            return { status: false }
        }
    }

    async setUsed(token) {
        await knex.update({ used: 1 }).where({ token: token }).table("passwordtokens")
    }//Para dizer que o token já foi usado 

}

module.exports = new passwordToken()