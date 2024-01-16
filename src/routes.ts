// import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
// import express, { Router } from "express";
import { AuthMiddleware } from "./middleware/auth.middleware";
// import { CreateUser, DeleteUser, GetUser, UpdateUser, Users } from "./controllers/user.controller";
// import { Permissions } from "./controllers/permission.controller";
// import { CreateRole, DeleteRole, GetRole, Roles, UpdateRole } from "./controllers/role.controller";
// import { CreateProduct, DeleteProduct, GetProduct, Products, UpdateProduct } from "./controllers/product.controller";
// import { Upload } from "./controllers/image.controller";
// import { Chart, Export, Orders } from "./controllers/order.controller";
// import { PermissionMiddleware } from "./middleware/permission.middleware";

import { Register, Login, AuthenticatedUser, Logout, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { Roles, CreateRole, UpdateRole, GetRole, DeleteRole } from "./controllers/role.controller";
import express, { Router } from "express";

export const routes = (router: Router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);

    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
    router.put('/api/user/info', AuthMiddleware, UpdateInfo);
    router.put('/api/user/password', AuthMiddleware, UpdatePassword);

    // router.get('/api/users', AuthMiddleware, PermissionMiddleware('users'), Users);
    // router.post('/api/users', AuthMiddleware, PermissionMiddleware('users'), CreateUser);
    // router.get('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), GetUser);
    // router.put('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), UpdateUser);
    // router.delete('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), DeleteUser);

    // router.get('/api/permissions', AuthMiddleware, Permissions);

    router.get('/api/roles', AuthMiddleware, Roles);
    router.post('/api/roles', AuthMiddleware, CreateRole);
    router.get('/api/roles/:id', AuthMiddleware, GetRole);
    router.put('/api/roles/:id', AuthMiddleware, UpdateRole);
    router.delete('/api/roles/:id', AuthMiddleware, DeleteRole);

    // router.get('/api/products', AuthMiddleware, PermissionMiddleware('products'), Products);
    // router.post('/api/products', AuthMiddleware, PermissionMiddleware('products'), CreateProduct);
    // router.get('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), GetProduct);
    // router.put('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), UpdateProduct);
    // router.delete('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), DeleteProduct);

    // router.post('/api/upload', AuthMiddleware, Upload);
    // router.use('/api/uploads', express.static('./uploads'));

    // router.get('/api/orders', AuthMiddleware, PermissionMiddleware('orders'), Orders);
    // router.post('/api/export', AuthMiddleware, PermissionMiddleware('orders'), Export);
    // router.get('/api/chart', AuthMiddleware, PermissionMiddleware('orders'), Chart);
}