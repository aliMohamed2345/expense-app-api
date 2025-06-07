import env from 'dotenv'
import mongoose from 'mongoose';

env.config()

export default function connectToDB() {
    mongoose.connect(process.env.CONNECTION_STRING,{retryWrites:true})
        .then(() => console.log("Connected to Database Successfully"))
        .catch(error => console.log(`Error connecting to Database:${error}`))
}
