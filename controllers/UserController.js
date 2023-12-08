const User = require("../models/User")
const passwordToken = require("../models/PasswordToken")
const PasswordToken = require("../models/PasswordToken")

class UserController {
    async index(req, res) {
        let users = await User.findAll()
        res.json(users)
    }

    async findUser(req, res) {
        let id = req.params.id
        let user = await User.findById(id)
        if (user == undefined) {
            res.status(404)
            res.json(user)
        } else {
            res.status(200)
            res.json(user)
        }
    }

    async create(req, res) {
        let { email, name, password } = req.body

        if (email == undefined) {
            res.status(400)
            res.json({ err: "O e-mail é inválido" })
            return //Sempre usar o return quando for trabalhar com controller. Pq dai já encerra na hora o programa quando der erro
        }
        //verificação de email para confirmar a existencia
        let emailExists = await User.findEmail(email)

        if (emailExists) {
            res.status(406)
            res.json({ err: "O email já está cadastrado!" })
            return
        }

        await User.new(email, password, name) //Para cadastrar o email

        res.status(200)
        res.send("Tudo ok!")
    }

    async edit(req, res) {
        let { id, name, role, email } = req.body
        let result = await User.update(id, email, name, role)
        if (result != undefined) {
            if (result.status) {
                res.status(200)
                res.send("Tudo OK!")
            } else {
                res.status(406)
                res.send(result.err)
            }
        } else {
            res.status(406)
            res.send("Ocorreu um erro no servidor!")
        }
    }

    async remove(req, res) {
        let id = req.params.id

        let result = await User.delete(id)

        if (result.status) {
            res.status(200)
            res.send("Tudo OK!")
        } else {
            res.status(406)
            res.send(result.err)
        }
    }

    async recoverPassword(req, res) {
        let email = req.body.email
        let result = await PasswordToken.create(email)
        if (result.status) {
            res.status(200)
            res.send("" + result.token)
        } else {
            res.status(406)
            res.send(result.err)
        }
    }
    
    async changePassword(req, res){
        let token = req.body.token;
        let password = req.body.password;
        let isTokenValid = await PasswordToken.validate(token);
        if(isTokenValid.status){
            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
        }else{
            res.status(406);
            res.send("Token inválido!");
        }
    }

}

module.exports = new UserController()