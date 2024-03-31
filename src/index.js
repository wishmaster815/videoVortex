// a better approach ( professional approach is that making seperate files for connection wtih database and express and importing here and simply calling them... this makes it a bit cleaner)
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js"

dotenv.config({
    path: "./env"
})

const port = process.env.PORT || 8000

connectDB()
.then(() => {
    app.listen(port , () => {
        console.log(`App is listening in port ${port}`);
    })
})
    .catch((err) => {
        console.log("MongoDB connection failed !!! ", err);
    })








/*
// this is one of the way to setup connection withh database but this makes it a bit messy 
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express();
// IIFEs IN JAVASCRIPT
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        //  using express as well in this try catch block 
        app.on("Error", (error) => {
            console.log("Error", error)
            throw error
        })
        
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR: ", error)
        throw error
    }
})()

*/
