const mongoose = require('mongoose')

const userModel = mongoose.Schema({

    name :{
        type :String , 
        require : true
    },
    email :{
        
        type :String ,
        require : true
    },
    password : {

        type :String , 
        require : true
    },

    pic :{

        type :String,
        require: true,
        default : 'https://cdn.pixabay.com/photo/2016/09/10/01/24/urban-1658436_960_720.jpg ' 
        
    }



}, {
    timestamp :true
})

const User = mongoose.model('User' , userModel)

module.exports = User