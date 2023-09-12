const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.error("Error connecting to the database");
  }
})();

app.use(cookieParser());
app.use(express.json());
app.use("/api/user/", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000!");
});
