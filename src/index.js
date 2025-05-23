const express= require("express")
const app = express();
const db= require("./config/mongo")
const cors = require("cors");
const path = require("path");
const formUser= require("./routes/userRoute")
const profileUser= require("./routes/profileRoute")
const authRoutes= require("./routes/authRoute")
const patnerRoutes= require("./routes/patnerRoute")
const deleteroutes= require("./routes/DeleteprofileRoute")
const paymentRoutes = require("./routes/PaymentRoute")
const clickButton= require("./routes/clickButtonRoute")

app.use(cors({
    origin: ['http://localhost:5173', 'https://shaadi-ruby.vercel.app','https://www.shaadisanskar.com'], // Add allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


//api
app.use("/user",formUser)
app.use("/api", profileUser)
app.use('/api/auth', authRoutes);
app.use("/api/patner", patnerRoutes);
app.use("/delete", deleteroutes);
app.use("/api/payment", paymentRoutes);
app.use("/click", clickButton);

db();
app.listen(3000, ()=>
{
    console.log("server is running");
    
})