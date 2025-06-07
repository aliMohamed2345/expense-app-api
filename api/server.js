import env from 'dotenv';
import express from 'express';

env.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()) // parsing the json data
app.use(express.urlencoded({ extended: true })) // parsing the urlencoded data

app.get("/", (req, res) => {
    try {
        res.status(200).send({ success: true, message: `hello world` });
    } catch (error) {
        res.status(500).send({ success: false, message: `internal server error` });
    }
});


app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })

export default app; // Export the app for testing purposes , This allows us to import the app in our test files without starting the server
