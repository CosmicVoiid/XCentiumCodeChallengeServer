import passport from "passport";
import fs from "fs";
import csvParser from "csv-parser";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;

type Account = {
	Id: string;
	Username: string;
	Password: string;
	Name: string;
};

// local strategy
passport.use(
	new LocalStrategy(
		{ usernameField: "username", passwordField: "password" },
		function verify(username: string, password: string, done: any) {
			const result: Account[] = [];
			let found: boolean = false;

			fs.createReadStream("./logindata.csv")
				.pipe(csvParser())
				.on("data", (data) => {
					result.push(data);
				})
				.on("end", () => {
					result.map((account) => {
						if (
							username === account.Username &&
							password === account.Password
						) {
							found = true;
							return done(null, account);
						}
					});
					if (!found) {
						return done(null, false, {
							message: "Incorrect username or password",
						});
					}
				});
		}
	)
);

// cookie extractor
const cookieExtractor = (req: any) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies["jwt"];
	}
	return token;
};

// jwt strategy
passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: cookieExtractor,
			secretOrKey: process.env.JWT_SECRET || process.env.JWT_SECRET_DEV,
		},
		function (jwtPayload: any, done: any) {
			const result: Account[] = [];
			let found: boolean = false;
			fs.createReadStream("./logindata.csv")
				.pipe(csvParser())
				.on("data", (data) => {
					result.push(data);
				})
				.on("end", () => {
					result.map((account) => {
						if (jwtPayload.id === account.Id) {
							found = true;
							return done(null, account.Name);
						}
					});
					if (!found) {
						return done(null, false);
					}
				});
		}
	)
);

module.exports = passport;
