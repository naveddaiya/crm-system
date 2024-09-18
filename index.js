const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/config');
const { protect } = require('./Middleware/authMiddleware');

// Initialize dotenv to use environment variables
dotenv.config();

// Create an instance of express app
const app = express();

// Define the port from the environment variables or fallback to 8000
const PORT = process.env.PORT || 8000;

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());
app.use(cookieParser())

//connect DB
connectDB(process.env.MONGO_URL).then(()=>{console.log(`MongoDB Connected: ${PORT}`)})

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js App!');
});

app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/tasks', require('./Routes/tasksRoute'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
