require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
//routes
const userRoute = require("./routes/auth");
const refreshRoute = require("./routes/refresh_route");
const employeeRoute = require("./routes/employeesRoute");
//middleware
const authMiddleWare = require("./middleware/authMiddleware")

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}))
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/refresh_token", refreshRoute);
app.use(authMiddleWare); //auth middleware
app.use("/api/employees", employeeRoute);

module.exports = {app, port};