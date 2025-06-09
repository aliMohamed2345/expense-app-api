//packages
import env from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path'
import { fileURLToPath } from "url";
//Routes
import authRoutes from '../Routes/auth.route.js';
import expenseRoutes from '../Routes/expense.route.js';
import adminRoutes from '../Routes/admin.route.js'
//db
import connectToDB from '../db.js'
env.config()

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//Middlewares
app.use(helmet())
app.use(express.json()) // parsing the json data
app.use(cookieParser())//parsing the cookies 
app.use("/exports", express.static(path.join(__dirname, "public", "exports")));
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
app.use('/api/v1/expenses', expenseRoutes)
app.use('/api/v1/admin', adminRoutes)

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })

export default app; // Export the app for testing purposes , This allows us to import the app in our test files without starting the server
