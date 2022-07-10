import express, { Request, Response } from "express";
const router = express.Router();
const loginController = require("../controllers/loginController");
const userController = require("../controllers/userController");
const passport = require("../passport-config");

// login routes
router.get("/account/login", loginController.login_GET);
router.post("/account/login", loginController.login_POST);

// logout
router.get("/account/logout", (req: Request, res: Response) => {
	res.clearCookie("jwt").end();
});

// user route
router.get(
	"/account/user",
	passport.authenticate("jwt", { session: false }),
	userController.user_GET
);

module.exports = router;
