import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String, 
            required: true, 
            min: 2, 
            max: 50
        },
        lastName: {
            type: String,  
            min: 2, 
            max: 50
        },
        email: {
            type: String,
            required: true,
            unique: true
        }, 
        password: {
            type: String, 
            required: true,
            min: 8
        },
        picturePath: {
            type: String,
            default: ""
        },
        friends: {
            type: Array,
            default: []
        },
        location: String,
        occupation: String,
        profileViews: Number,
        postImpressions: Number
    }, 
    { timestamps: true } 
)

const User = mongoose.model("User", userSchema)
export default User