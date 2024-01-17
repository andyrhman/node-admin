import { Permission } from '../models/permission.models';
import { Role } from '../models/role.models';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/node_admin').then(async () => {
    const perms = ['view_users', 'edit_users', 'view_roles', 'edit_roles', 'view_products', 'edit_products', 'view_orders', 'edit_orders'];

    let permissions = await Promise.all(perms.map(async (perm) => {
        return Permission.create({ name: perm });
    }));

    await Role.create({
        name: 'Admin',
        permissions: permissions.map(perm => perm._id)
    });

    const editorPermissions = permissions.filter((perm, index) => {
        return index !== 3; // exclude 'edit_roles'
    }).map(perm => perm._id);

    await Role.create({
        name: 'Editor',
        permissions: editorPermissions
    });

    const viewerPermissions = permissions.filter((perm, index) => {
        return ![1, 3, 5, 7].includes(index); // exclude 'edit_users', 'edit_products', 'edit_orders'
    }).map(perm => perm._id);

    await Role.create({
        name: 'Viewer',
        permissions: viewerPermissions
    });

    console.log('🌱 Seeding complete!');
    process.exit(0);
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
