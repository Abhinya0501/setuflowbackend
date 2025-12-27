import mongoose from "mongoose";

export const connection = () => {
    const URI : string = process.env.DB_CONNECTION_URL || ""
    mongoose.connect(URI,{
        dbName:"SETUFLOW"
    }).then(()=>{
        console.log("Connected to Database.");
    }).catch((err)=>{
        console.log(`Some error occured while connecting to db : ${err}`);
    });
} 