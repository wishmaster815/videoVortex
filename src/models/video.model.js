import mongoose, {Schema, mongo} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose(
    {
        videoFile:{
            type: String,  // cloudinary use
            required: true
        },
        thumbnail:{
            type: String,  // cloudinary use
            required: true
        },
        title:{
            type: String,  
            required: true
        },
        description:{
            type: String,  
            required: true
        },
        duration:{
            type: Number,  // cloudinary use
            required: true
        },
        views:{
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }



    }, { timestamps: true }

)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)