import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { register } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js"
import Post from "./models/Post.js"
import { users, posts } from "./data/index.js"


// CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url)
const __dirname = fileURLToPath(import.meta.url)
dotenv.config()

const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}))
app.use(morgan("dev"))
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

// FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({ storage })//read more on when to use curly braces in js here: https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import



//ROUTES WITH FILES
app.post("/auth/register"/* we will hit this route which will have the form */, upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

//ROUTES
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)


// MONGOOSE
const port  = 3001

//local Mongodb
mongoose.connect('mongodb://127.0.0.1:27017/user-data', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(()=>{
  app.listen(port, ()=>console.log(`Social Media App active on port: ${port}`))
  // Adding dummy data
  // User.insertMany(users)
  // Post.insertMany(posts)
}).catch((err)=>{console.log(err)})


app.get('/', (req, res)=>{
  res.send("Hello World")
})