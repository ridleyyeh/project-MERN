const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { auth } = require("./routes");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

//連結mongodb

mongoose
    .connect("mongodb://localhost:27017/mernDB")
    .then( ()=> {
        console.log("Connecting to mongodb...");
    })
    .catch( (e) => {
        console.log(e);
    });


 //middlewares
 app.use(express.json()); // 解析 JSON 資料的內建中介軟體
 app.use(express.urlencoded({ extended: true}));   // 解析表單資料的內建中介軟體
 app.use(cors({
    origin: 'http://localhost:3000' // 允許3000訪問
  }));
 app.use("/api/user" , authRoute);

 //course route應該被jwt保護
 //如果request header內部沒有jwt,則request就會被視為unauthorized
 app.use("/api/courses", passport.authenticate("jwt", {session: false}), courseRoute);

//只有登入系統的用戶，才能夠去新增課程或註冊課程


 app.listen(8080,() =>{
    console.log("後端伺服器聆聽port 8080...");
 });