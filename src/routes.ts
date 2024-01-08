import { Register } from "./controllers/auth.controller";
import { Router } from "express";

export const routes = (router: Router) => {
    router.post('/api/register', Register);
}