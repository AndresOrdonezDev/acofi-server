import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import db from "./config/db";
import colors from 'colors'
import consecutiveRouter from "./routes/consecutivesRoutes";
import authRouter from  "./routes/authRoutes"
import { corsConfig } from "./config/cors";
dotenv.config()
const app = express()
//Cors
app.use(cors(corsConfig))
//connect to db
async function connectDB(){
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.bgMagenta('The connection to the db was successful'));
        
    } catch (error) {
        console.log(error);
        
    }
}

connectDB()

app.use(express.json())
app.use('/api/consecutive/',consecutiveRouter)
app.use('/api/auth/',authRouter)
const port = process.env.PORT || 4000

app.listen(port,() => {
    console.log(colors.cyan(`Server running in port: ${port}`));
})