//packages
import env from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
//Routes
import authRoutes from '../Routes/auth.route.js';
//db
import connectToDB from '../db.js'
env.config()

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(helmet())
app.use(express.json()) // parsing the json data
app.use(cookieParser())//parsing the cookies 
app.use(express.urlencoded({ extended: true })) // parsing the urlencoded data

app.get("/", (req, res) => {
    try {
        res.status(200).send({ success: true, message: `hello world` });
    } catch (error) {
        res.status(500).send({ success: false, message: `internal server error` });
    }
});

connectToDB()

app.use('/api/v1/auth', authRoutes)


app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })

export default app; // Export the app for testing purposes , This allows us to import the app in our test files without starting the server
