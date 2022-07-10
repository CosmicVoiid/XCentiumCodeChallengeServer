import { Request, Response } from "express";

exports.user_GET = (req: Request, res: Response) => {
	res.json({ user: req.user });
};
