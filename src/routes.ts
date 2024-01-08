import { AuthenticatedUser, Login, Logout, Register } from "./controllers/auth.controller";
import { Router } from "express";
import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
}