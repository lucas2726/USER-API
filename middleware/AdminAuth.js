const jwt = require(jsonwebtoken)

module.exports = function (req, res, next) {
    const authToken = req.headers['authorization']
    if (authToken != undefined) {
        const bearer = authToken.split(' ')
        let token = bearer[1]
    } else {
        res.status(403)
        res.send("Você não esta autenticado")
        return
    }
}