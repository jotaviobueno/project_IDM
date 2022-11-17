import {Router} from "express";

export const userRoutes = Router();

// Controller 

import UserController from "../../http/Controller/User/User.js";
import AuthLoginController from "../../http/Controller/User/AuthLogin.js";
import UpdateController from "../../http/Controller/User/Update.js";
import AuthTokenController from "../../http/Controller/User/AuthToken.js";

// Request
import UserRequest from "../../http/Request/User/User.js";
import UpdateRequest from "../../http/Request/User/Update.js";
import AuthTokenRequest from "../../http/Request/User/AuthToken.js";
import AuthLoginRequest from "../../http/Request/User/AuthLogin.js";

userRoutes.post("/sign-up", UserRequest.validateStorage, UserController.storage );
userRoutes.post("/sign-in", AuthLoginRequest.validateCreateSession, AuthLoginController.createSession );
userRoutes.get("/profile", UserRequest.validateProfile, UserController.profile );
userRoutes.get("/user/:username", UserRequest.validateOutherProfile, UserController.outherProfile );

userRoutes.patch("/update/username", UpdateRequest.validateUpdateUsername, UpdateController.updateUsername);
userRoutes.patch("/update/fullname", UpdateRequest.validateUpdateFullname, UpdateController.updateFullName);
userRoutes.patch("/update/password", UpdateRequest.validateUpdatePasswordLoggedIn, UpdateController.updatePasswordLoggedIn);
userRoutes.patch("/update/genre", UpdateRequest.validateUpdateGenre, UpdateController.updateGenre);

userRoutes.get("/friend-request", UserRequest.validateSendFriendRequest, UserController.sendFriendRequest);
userRoutes.get("/accpet/friend-request", UserRequest.validateAcceptFriendRequest, UserController.acceptFriendRequest);

userRoutes.post("/generation/token/auth", AuthTokenRequest.validateGenerationTokenToVerifyAccount, AuthTokenController.generationTokenToVerifyAccount);
userRoutes.post("/verify-account", AuthTokenRequest.validateVerifyAccount, AuthTokenController.verifyAccount);

userRoutes.post("/generation/token/change-password", AuthTokenRequest.validateGenerationTokenTochangePassword, AuthTokenController.generationTokenTochangePassword);

userRoutes.patch("/change-password", UpdateRequest.validatePasswordWithToken, UpdateController.updatePasswordWithToken);
userRoutes.post("/generation/token/change-email", AuthTokenRequest.validateGenerationTokenToChangeEmail, AuthTokenController.generationTokenToChangeEmail );

userRoutes.patch("/change-email", UpdateRequest.validateUpdateEmail, UpdateController.updateEmail);

userRoutes.post("/generation/token/delete-account", AuthTokenRequest.validateGenerationTokenToDeleteAccount, AuthTokenController.generationTokenToDeleteAccount);
userRoutes.delete("/delete-account", UpdateRequest.validateDeleteAccount, UpdateController.deleteAccount);