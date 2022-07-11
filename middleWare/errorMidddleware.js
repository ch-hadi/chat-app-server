const { model } = require("mongoose")


const notFound = async( req , res , next)=>{

    res.send({Error:`URL Not Found .. ${req.originalUrl}`})
    next()

}

const errorHandler = (err , req , res , next) => {

    res.send({Error : `Url not found -- ${res.status}`})

}

module.exports ={

    notFound , 
    // errorHandler
}