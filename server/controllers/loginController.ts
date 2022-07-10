import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.login_GET = (req: Request, res: Response) => {
	res.json({ message: "Send username and password to login" });
};

exports.login_POST = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		"local",
		{ session: false },
		(err: any, user: any, info: any) => {
			if (err || !user) {
				return res
					.status(400)
					.json({ message: "Error authenticating", info: info.message });
			} else {
				const token = jwt.sign(
					{ id: user.Id },
					process.env.JWT_SECRET || process.env.JWT_SECRET_DEV
				);

				return res.status(200).cookie("jwt", token, { httpOnly: true }).end();
			}
		}
	)(req, res, next);
};
