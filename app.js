import express from "express"
import { config } from "dotenv"
import cors from "./config/cors.js"
import HttpStatus from "./utils/statusCodes.js"

//routes
import notificationRouter from "./routes/notification.js"
import mailRouter from "./routes/mail.js"

config()
const app = express()
app.use(express.json())
app.use(cors)


app.use('/notification', notificationRouter);
app.use('/mail', mailRouter);

app.use((err,req,res)=>{
    res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: err.message,
        details: err
    });
})

app.listen(process.env.PORT, () => {
    console.log(`server running on ${process.env.PORT} `)
})