import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { Router } from "express";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { ValidationMiddleware } from "./middleware/validation.middleware";

export const routes = (router: Router) => {
    router.post('/api/register', ValidationMiddleware, Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
    router.put('/api/user/info', AuthMiddleware, UpdateInfo);
    router.put('/api/user/password', AuthMiddleware, UpdatePassword);
}