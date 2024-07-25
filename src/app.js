// connecting express code 

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credentials: true
}))

// 3 major middleware configurations
// app.use() -- > for using middlewares syntax

// app.use(express.json({ limits: "16kb" })) // express.json is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. 

//  taking url is a bit tricky task beacause url is itself encodes for some special characters toh hume express ko batana padega ki aise log bhi aenge toh samajhna 
// app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// ek aur configuration kari hai jo koi bhi agar file folder pdfs and all store karna hoto
// app.use(express.static("public"))

// app.use(cookieParser())


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes import 
import userRouter from "./routes/user.routes.js";
// here now we dont use app.get() and all...
// since we now have seperate folders for easy access we will use a middleware that will take control to that url(route)
app.use("/api/v1/users", userRouter) 
// which route will be used???  /api/v1/users or /register???
// here the request first goes to /api/v1/users and then the controll is given to userController as it is passed as middleware then /register will followup
// the url becomes: http://localhost:4000/api/v1/users/register



export default app