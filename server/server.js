import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import authRoutes from './router/authRoutes.js'
import userRouter from './router/userRoutes.js'

const app = express()
const port = process.env.PORT || 4000
connectDB()
const allowedOrigins = ['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

// API endPoints
app.get('/', (req, res) => res.send("Welcome"))
app.use('/api/auth', authRoutes)
app.use('/api/user', userRouter)

app.listen(port, () => { console.log(`Server is running on port http://localhost:${port}/`) })