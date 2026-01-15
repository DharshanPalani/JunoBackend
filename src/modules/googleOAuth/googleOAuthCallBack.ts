import { Request, Response, NextFunction } from "express";
import passport from "passport";

export class GoogleOAuth {
  googleCallback = (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    passport.authenticate(
      "google",
      { failureRedirect: "/error" },
      (err, user, info) => {
        if (err || !user) return response.redirect("/error");

        request.login(user, (err) => {
          if (err) return next(err);
          const frontend_url = process.env.FRONTEND_URL;
          response.redirect(frontend_url + "/");
        });
      },
    )(request, response, next);
  };
}
