import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARy_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCludinary = async (localPath)=>{ //  ye localPath mera server ak temp folder mein se lega
    try {
        if(!localPath) return null
        //  uploading file on cloudinary
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type:"auto"
        })
        // file uploaded successfully
        console.log("File uploaded successfully", response.url)
        return response

    } catch (error) {
       fs.unlinkSync(localPath) //  this will unlink the path of that file as it now uploadied in cloudinary
    }
}