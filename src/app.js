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

app.use(express.json({ limits: "16kb" })) // express.json is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. 

//  taking url is a bit tricky task beacause url is itself encodes for some special characters toh hume express ko batana padega ki aise log bhi aenge toh samajhna 
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// ek aur configuration kari hai jo koi bhi agar file folder pdfs and all store karna hoto
app.use(express.static("public"))

app.use(cookieParser())


export default app