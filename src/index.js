const express= require("express")
const app = express();
const db= require("./config/mongo")
const cors = require("cors");
const path = require("path");
const formUser= require("./routes/userRoute")
const profileUser= require("./routes/profileRoute")
const authRoutes= require("./routes/authRoute")



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//api
app.use("/user",formUser)
app.use("/api", profileUser)
app.use('/api/auth', authRoutes);

db();
app.listen(3000, ()=>
{
    console.log("server is running");
    
})