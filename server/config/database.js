const mongoose=require("mongoose")
require('dotenv').config();

const url= process.env.MONGO_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(url).then((value)=>{
            console.log("Connect")
            // return mongoose.connection.useDb('Ecommerce database');
        })
        .catch((err)=>console.log(err));
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports={connectDb}