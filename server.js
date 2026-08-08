const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//configuring env file
dotenv.config();

//connect to MongoDB
connectDB();

//rest object
const app = express();


//using middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/v1/category", require("./routes/categoryRoutes"));
app.use("/api/v1/food", require("./routes/foodRoutes"));

app.get('/', (req, res) => {
  return res.status(200).send("<h1>Welcome to the food app backend</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold);
});