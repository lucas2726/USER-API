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
}

module.exports = new passwordToken()