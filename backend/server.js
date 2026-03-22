const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true}))

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/favorites", require("./routes/favorites"));

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the Express API for Vercel's serverless functions
module.exports = app;
