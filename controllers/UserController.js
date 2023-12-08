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
        /*
        Este código adiciona um método `recoverPassword` que é usado para iniciar o processo de recuperação de senha. Aqui está o que cada parte do código faz:

1. O método `recoverPassword` recebe uma solicitação (`req`) e uma resposta (`res`) como parâmetros. Estes são comumente usados em rotas de servidor web em Node.js.
2. Ele extrai o e-mail da solicitação usando `req.body.email`.
3. Em seguida, ele tenta criar um token de senha para esse e-mail usando `PasswordToken.create(email)`.
4. Se a criação do token for bem-sucedida (`result.status` é verdadeiro), ele envia uma resposta com status 200 e o token.
5. Se a criação do token falhar, ele envia uma resposta com status 406 e a mensagem de erro.

Este método pode ser usado em uma rota de servidor web para lidar com solicitações de recuperação de senha. Quando um usuário solicita a recuperação de senha, ele envia seu e-mail para o servidor. O servidor então chama este método, que cria um token de senha e o envia de volta ao usuário. O usuário pode então usar este token para redefinir sua senha. Se algo der errado durante este processo, o servidor envia uma mensagem de erro ao usuário.
        */
    }
    
    async changePassword(req, res){
        let token = req.body.token
        let password = req.body.password
        let isTokenValid = await PasswordToken.validate(token)
        if(isTokenValid.status){
            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada")
        }else{
            res.status(406)
            res.send("Token inválido!")
        }
    }
/*
Este código adiciona um método `changePassword` que é usado para alterar a senha de um usuário. Aqui está o que cada parte do código faz:

1. O método `changePassword` recebe uma solicitação (`req`) e uma resposta (`res`) como parâmetros. Estes são comumente usados em rotas de servidor web em Node.js.
2. Ele extrai o token e a nova senha da solicitação usando `req.body.token` e `req.body.password`.
3. Em seguida, ele verifica se o token é válido usando `PasswordToken.validate(token)`.
4. Se o token for válido (`isTokenValid.status` é verdadeiro), ele chama `User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token)` para alterar a senha do usuário. Em seguida, envia uma resposta com status 200 e a mensagem "Senha alterada".
5. Se o token não for válido, ele envia uma resposta com status 406 e a mensagem "Token inválido!".

Este método pode ser usado em uma rota de servidor web para lidar com solicitações de alteração de senha. Quando um usuário solicita a alteração de sua senha, ele envia seu token e nova senha para o servidor. O servidor então chama este método, que verifica o token e, se for válido, altera a senha do usuário. Se o token não for válido, o servidor envia uma mensagem de erro ao usuário. Isso ajuda a manter a segurança do sistema, garantindo que apenas o usuário que solicitou a alteração de senha possa realmente alterá-la.
*/
}

module.exports = new UserController()