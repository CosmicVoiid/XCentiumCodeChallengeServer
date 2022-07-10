if (process.env.NODE_ENV !== "production") require("dotenv").config();
import express, { Application } from "express";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const indexRouter = require("./routes/index");
require("./passport-config");

//create server
const app: Application = express();

//set port
const port = process.env.PORT || process.env.PORT_DEV;

//middleware
app.use(helmet());
app.use(cookieParser());
app.use(passport.initialize());
app.use(
	cors({
		origin: process.env.URL,
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);
app.use(bodyParser.json());
app.use("/", indexRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
