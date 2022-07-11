const jwt = require('jsonwebtoken')


const genrateToken = (id) =>{

    return jwt.sign({id} , process.env.JWT_SECRATE , {
        expiresIn : '30d'
    })

}

module.exports = genrateToken