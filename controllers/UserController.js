const User = require("../models/User")

class UserController {
    async index(req, res) {}

    async create(req, res) {
        let {email, name, password} = req.body

        if(email == undefined) {
            res.status(400)
            res.json({err: "O e-mail é inválido"})
            return //Sempre usar o return quando for trabalhar com controller. Pq dai já encerra na hora o programa quando der erro
        }
//verificação de email para confirmar a existencia
        let emailExists = await User.findEmail(email)

        if(emailExists) {
            res.status(406)
            res.json({err: "O email já está cadastrado!"})
            return
        }

        await User.new(email,password,name) //Para cadastrar o email
 
        res.status(200)
        res.send("Tudo ok!")
    }
}

module.exports = new UserController()