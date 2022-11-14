import {Router} from "express";

export const userRoutes = Router();

import UserController from "../../http/Controller/User/User.js";
import AuthLoginController from "../../http/Controller/User/AuthLogin.js";
import UpdateController from "../../http/Controller/User/Update.js";
import AuthTokenController from "../../http/Controller/User/AuthToken.js";

userRoutes.post("/sign-up", UserController.storage );
userRoutes.post("/sign-in", AuthLoginController.createSession );
userRoutes.get("/profile", UserController.profile );
userRoutes.get("/user/:username", UserController.outherProfile );

userRoutes.patch("/update/username", UpdateController.updateUsername);
userRoutes.patch("/update/fullname", UpdateController.updateFullName);
userRoutes.patch("/update/password", UpdateController.updatePasswordLoggedIn);
userRoutes.patch("/update/genre", UpdateController.updateGenre);

userRoutes.get("/friend-request", UserController.sendFriendRequest);
userRoutes.get("/accpet/friend-request", UserController.acceptFriendRequest);

userRoutes.post("/generation/token/auth", AuthTokenController.createTokenToVerifyAccount);
userRoutes.post("/verify-account", AuthTokenController.verifyAccount);

userRoutes.post("/generation/token/change-password", AuthTokenController.generationTokenTochangePassword);
