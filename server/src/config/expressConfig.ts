import express, { Application } from 'express'
import cors from 'cors'
import cookie_parser from 'cookie-parser'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import dotenv from 'dotenv'
dotenv.config()

const corsOptions  = {
    origin: process.env.BASE_URL ,
    methods: ['GET','PUT','PATCH','POST','DELETE'],
    credentials:true
}
// enable CORS with options


const expressConfig = (app:Application)=>{

    //MIDDLEWARES 
    app.use(morgan("dev"))
    app.use(cors(corsOptions));
    app.use(cookie_parser())
    app.use(express.urlencoded({extended:true}))
    app.use(express.static("public"))
    app.use(express.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(helmet())
    app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))

}

export default expressConfig