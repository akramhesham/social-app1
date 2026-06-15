import mongoose from "mongoose"
import { DB_URL } from "../config"

export const connectDB=()=>{
   mongoose.connect(DB_URL).then(()=>{
    console.log('DB connected successfully');
   }).catch((error)=>{
    console.log(`fail to connect to db because ${error}`);
   }) 
}