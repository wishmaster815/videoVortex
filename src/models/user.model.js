import mongoose, { Schema } from "mongoose";

// password encryption authentication packages
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // we'll use cloudinary
            required: true
        },
        coverImage: {
            type: String, // we'll use cloudinary
            required: true
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
                required: [true, "Password is required"]
            }
        ],
        refreshToken: {
            type: String
        }
    }, { timestamps: true }
)

// password encryption process
//  we use pre hook ofmongoose to perform any action just before giving a request of data by user 

userSchema.pre("save", async function (next) {  // async because this converting process may take time and thats why for safety
    if (!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next()
})

// password decryption and comparing process
userSchema.methods.isPasswordCorrect = async function(password){ // password----->cryptographiv password
    return await bcrypt.compare(password, this.password) //  written type of compare is boolean
    
}

//  use of jwt and creating refresh and access tokens
userSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id: this._id,
        email:this.email,
        username: this.username,
        fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_SECRET_EXPIRY

    }

)
}

userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id: this._id,
       
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_SECRET_EXPIRY

    }

)
}


export const User = mongoose.model("User", userSchema)
