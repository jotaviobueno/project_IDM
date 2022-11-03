import {Router} from "express";

export const userRoutes = Router();

import UserController from "../../http/Controller/User/User.js";
import AuthLoginController from "../../http/Controller/User/AuthLogin.js";

userRoutes.post("/sign-up", UserController.storage );
userRoutes.post("/sign-in", AuthLoginController.createSession );
userRoutes.get("/profile", UserController.profile );
userRoutes.get("/user/:username", UserController.outherProfile );