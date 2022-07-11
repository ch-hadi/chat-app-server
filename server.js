const express = require('express')

const Chats = require('./data/data')

require('dotenv').config()

require('colors')

const request = require('request')

const cors = require('cors');

const connectDB = require('./config/db');

const userRoutes = require('./routs/userRoutes')

const chatRoutes = require('./routs/chatRouts')

const {notFound} = require('./middleWare/errorMidddleware')

const PORT = process.env.PORT || 7000

const app = express()

app.use(express.json())

connectDB()

app.use(cors())

app.use('/api/user' , userRoutes)
app.use('/api/chat' , chatRoutes)

app.use(notFound)

app.listen(PORT , ()=>{

    console.log(`server Listining on port ${PORT}`.bgRed)
})

// Third Party API

        // request({
        //     method : 'GET' , 
        //     uri : 'https://api.publicapis.org/entries?category=animals&https=true',

        // } , (error,body, res)=>{

        //     if (error){
        //         console.log('Error Not getting Data ...')
        //         return
            
        //     }

        //     const data = JSON.parse(res);
            
        //     // const apiData = (data)

        //     // console.log('Received Data --- >' , data)

        //     data.entries.map((entries)=>{

        //         if ((entries.Cors == 'yes') && (entries.HTTPS == 'true'))

        //         console.log('Entries --->',entries)

        //         return

        //     })

        //     if (res){
        //         console.log('success...')
        //         return
        //     }
        //     else{

        //         console.log('error with API...')
        //     }


        // })


