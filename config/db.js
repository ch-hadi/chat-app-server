const mongoose = require('mongoose')

const connectDB = async()=>{

    try {
        
        const conn =await mongoose.connect(process.env.MONGO_URI , {

            useNewUrlParser : true,
            useUnifiedTopology : true ,
            // useFindAndModify : true
        
        })

        console.log(`Mongo DB connected to ${conn.connection.host}`.bgMagenta)

    } catch (error) {

        console.log('Error in Connection..', error.message)
        process.exit()
        
    }

}

module.exports = connectDB