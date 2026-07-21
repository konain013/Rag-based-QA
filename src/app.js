require("dotenv").config();

const express = require("express");
const connectDB = require('./config/db');

const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middleware/error.middleware");
const fileRoutes = require("./routes/file.routes");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes)

// Global Error Handler (Always last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});