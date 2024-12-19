import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import authRoutes from './router/authRoutes.js'

const app=express()
const port = process.env.PORT ||4000
connectDB() 

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true}))

// API endPoints
app.get('/',(req,res)=>res.send("Welcome"))
app.use('/api/auth',authRoutes)

app.listen(port,()=>{console.log(`Server is running on port http://localhost:${port}/`)})