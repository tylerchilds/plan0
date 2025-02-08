import express from "npm:express";
import cors from "npm:cors";

const app = express();
const port = 8080;

// Middleware to parse JSON
app.use(express.json());

app.use(cors());

app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
