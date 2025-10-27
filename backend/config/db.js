import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = async()=>{
       try{
          await mongoose.connect(process.env.MONGO_URL);

                console.log("DB is Connected");
                
       } catch (error){
        console.log("DB Connection error : " , error.message)
        process.exit(1);
        
       }
    };
    