import { Router } from "express";
import { loginUser, logoutUser, refreshtokenAccess, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

// userRouter.route("/register".post(),registerUser)
userRouter.route("/register").post(
    upload.fields([ // with this we can now send images and other files
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
userRouter.route("/login").post(loginUser)

// seccured routes
userRouter.route("/logout").post(verifyJWT ,logoutUser)
userRouter.route("/refresh-token").post(refreshtokenAccess)
export default userRouter