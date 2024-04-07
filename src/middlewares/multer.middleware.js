import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    fileName: function (req, file, cb) {
        const uniqueName = date.now()
        cb(null, file.originalname + "_" + uniqueName)
    }
})

export const upload = multer({
    storage
})