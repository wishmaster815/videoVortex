import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return ({ accessToken, refreshToken })
    } catch (error) {
        throw new ApiError(500, error.message)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // for testing 
    // res.status(200).json({
    //     message:"sab changa"
    // })


    // --------------------ALGORITHM--------------------//

    //  steps to register a user 
    // 1. get user details from frontend ( we need not necessary have frontend we have postman through which we can send data). The data providing part depends upon the modelling schema created 

    // 2. validation process - user dwara di gayi details khali to nahi hai and so on (not empty condition)

    // 3. check whether user is already registered or not : ew can use email and username uniqueness property to do this 

    // 4. check for files (check for avatar and coverImage )

    // 5. upload those files in cloudinary - cloudinary mein files (avatar, coverImage) upload karneke baad cloudinary will give a url through which we can access the images

    // 6. create user object and create entry in DB - why object?? since we are using mongDb which is nosql db therefore we use js objects, then we will use creation calls of db (db.create()and something else)

    // 7. remove password and refresh token fields from response

    // 8. check for user creation and then send the response

    // ------------------------------ program --------------------------------------- 
    // step 1 get user details from frontend
    const { fullName, email, username, password } = req.body
    // console.log("email: ", email)

    // Step 2 validation process
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    // Step 3 check whether user is already registered or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) { throw new ApiError(409, "User already exists") }

    //  Step 4 check for files (check for avatar especially)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files.coverImage[0]?.path;
    // this generates undefined error (a javascript mistake) if we dont provide coverImage (which should not be the case) 

    // a better classical way to check for coverImage 
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    // Step 5 upload those files in cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    // Step 6 create user object and create entry in DB 
    const user = await User.create({
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    })

    // Step 7 remove password and refresh token fields from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // Step 8 check for user creation
    if (!createdUser) {
        throw new ApiError(500, " Something went wrong ")
    }

    // step 9 send the response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully!!!"

        )
    )


})

const loginUser = asyncHandler(async (req, res) => {
    // --------------------ALGORITHM--------------------//
    // req.body  -> data
    // check for (username or email)
    // check for user from database
    // check password from database 
    // give refresh and access token 
    // send cookie 
    // send response 

    // Step 1 req.body  -> data
    const { email, username, password } = req.body

    // Step 2 check for !(username or email)
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    // Step 3 find User from database
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Step 4 check for the password given by user from the database
    const passwordCheck = await user.isPasswordCorrect(password)

    if (!passwordCheck) {
        throw new ApiError(404, "Invalid user credentials")
    }

    // Step 5 generate accessToken and refreshtoke 
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // Step 6 send cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookies("accessToken", options)
        .clearCookies("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out!"))

})

export { registerUser, loginUser, logoutUser }