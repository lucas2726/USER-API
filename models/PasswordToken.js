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
        /*
        Este código é uma classe chamada `passwordToken` em JavaScript que tem um método chamado `create`. Este método é usado para criar um token de senha para um usuário específico. Aqui está o que cada parte do código faz:

1. O método `create` recebe um e-mail como parâmetro.
2. Ele tenta encontrar um usuário com esse e-mail na base de dados usando `User.findByEmail(email)`.
3. Se o usuário existir (`user != undefined`), ele cria um token usando a hora atual (`Date.now()`).
4. Em seguida, tenta inserir um novo registro na tabela `passwordtokens` do banco de dados com o `id` do usuário, o token e um valor `used` de 0 (indicando que o token ainda não foi usado).
5. Se a inserção for bem-sucedida, ele retorna um objeto com `status: true` e o `token`.
6. Se ocorrer um erro durante a inserção, ele registra o erro e retorna um objeto com `status: false` e o `err`.
7. Se o usuário não existir, ele retorna um objeto com `status: false` e uma mensagem de erro.

Este tipo de funcionalidade é comumente usado em sistemas que precisam de recuperação de senha. Quando um usuário esquece sua senha, ele pode solicitar um token de redefinição de senha. Este token é então enviado para o e-mail do usuário para verificar sua identidade. Quando o usuário clica no link enviado para seu e-mail, o token é usado para verificar a solicitação e permitir que o usuário redefina sua senha.
        */
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
    } 
    /*
    Este código adiciona dois métodos à classe `passwordToken`:

1. `validate(token)`: Este método verifica se um token de senha fornecido é válido. Ele faz isso procurando o token na tabela `passwordtokens` do banco de dados. Se o token existir e não tiver sido usado (`used` é 0), ele retorna um objeto com `status: true` e o token. Se o token não existir ou já tiver sido usado, ele retorna um objeto com `status: false`.

2. `setUsed(token)`: Este método marca um token de senha como usado na tabela `passwordtokens` do banco de dados. Ele faz isso atualizando o campo `used` do token para 1.

Esses métodos são úteis em um sistema de recuperação de senha. O método `validate` pode ser usado quando o usuário clica no link de redefinição de senha enviado para seu e-mail. Se o token for válido, o usuário pode prosseguir para redefinir sua senha. Depois que a senha é redefinida, o método `setUsed` pode ser chamado para marcar o token como usado, para que não possa ser usado novamente. Isso ajuda a manter a segurança do sistema.
    */

}

module.exports = new passwordToken()