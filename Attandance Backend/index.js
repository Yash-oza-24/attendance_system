require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/connect");
const morgan = require("morgan");
app.use(morgan("dev"));

app.use(cors());

const PORT = process.env.PORT || 5100;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  

const userRoutes = require("./routes/userRoutes");
const attendanceRoutes = require("./routes/attandanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const settingRoutes = require("./routes/settingRoutes");
const paidLeaveRoutes = require("./routes/paidleaveRoutes");

app.get("/", (req, res) => {
  res.send("Hello, server Connected");
});

app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/paidleaves", paidLeaveRoutes);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

start();
