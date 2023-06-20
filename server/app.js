require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const  appRoutes = require("./routes/routes")



const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', appRoutes);




mongoose.connect(process.env.DATABASE).then(()=>{
    app.listen(process.env.PORT);
})
.catch(err => console.log(err))