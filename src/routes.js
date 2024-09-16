const express = require('express');
const { Register, Login, AuthenticatedUser, Logout, UpdateInfo, UpdatePassword } = require('./controllers/auth.controller.js');
const { Roles, CreateRole, GetRole, UpdateRole, DeleteRole } = require('./controllers/role.controller.js');
const { Permissions, AddRolePermissions, RemoveRolePermissions } = require('./controllers/permission.controller.js');
const { Users, CreateUser, GetUser, UpdateUser, DeleteUser } = require('./controllers/user.controller.js');
const { CreateProduct, Products, GetProduct, UpdateProduct, DeleteProduct } = require('./controllers/product.controller.js');
const { Orders, Export, Chart } = require('./controllers/order.controller.js');
const { AuthMiddleware } = require('./middleware/auth.middleware.js');
const { PermissionMiddleware } = require('./middleware/permission.middleware.js');

const routes = (router) => {
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
    router.put('/api/user/info', AuthMiddleware, UpdateInfo);
    router.put('/api/user/password', AuthMiddleware, UpdatePassword);

    router.get('/api/users', AuthMiddleware, PermissionMiddleware('users'), Users);
    router.post('/api/users', AuthMiddleware, PermissionMiddleware('users'), CreateUser);
    router.get('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), GetUser);
    router.put('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), UpdateUser);
    router.delete('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), DeleteUser);

    router.get('/api/permissions', AuthMiddleware, Permissions);
    router.put('/api/permissions/new', AuthMiddleware, AddRolePermissions);
    router.put('/api/permissions/remove', AuthMiddleware, RemoveRolePermissions);

    router.get('/api/roles', AuthMiddleware, PermissionMiddleware('roles'), Roles);
    router.post('/api/roles', AuthMiddleware, PermissionMiddleware('roles'), CreateRole);
    router.get('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), GetRole);
    router.put('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), UpdateRole);
    router.delete('/api/roles/:id', AuthMiddleware, PermissionMiddleware('roles'), DeleteRole);

    router.get('/api/products', AuthMiddleware, PermissionMiddleware('products'), Products);
    router.post('/api/products', AuthMiddleware, PermissionMiddleware('products'), CreateProduct);
    router.get('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), GetProduct);
    router.put('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), UpdateProduct);
    router.delete('/api/products/:id', AuthMiddleware, PermissionMiddleware('products'), DeleteProduct);

    // router.post('/api/upload', AuthMiddleware, Upload);
    // router.use('/api/uploads', express.static('./uploads'));

    router.get('/api/orders', AuthMiddleware, PermissionMiddleware('orders'), Orders);
    router.post('/api/export', AuthMiddleware, PermissionMiddleware('orders'), Export);
    router.get('/api/chart', AuthMiddleware, PermissionMiddleware('orders'), Chart);
}

module.exports = { routes };