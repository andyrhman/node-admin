import { Register } from './controller/auth.controller';
import { Router } from "express";

export const routes = (router: Router) => {
    router.post('/api/register', Register);
}