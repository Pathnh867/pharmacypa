const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(
    cors({
      origin: "https://pharmacypa.vercel.app", // Chỉ cho phép frontend gọi API
      credentials: true, // Quan trọng: Cho phép gửi cookie kèm request
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức API được phép
      allowedHeaders: "Content-Type,Authorization, token", // Cho phép headers cần thiết
    })
  );
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb' }));


routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect Db Success!')
    })
    .catch((err) => {
        console.log(err)
    })


app.listen(port, () => {
    console.log('Server is running in port:', + port)
})
