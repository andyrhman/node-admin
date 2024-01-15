import { Permission } from '../models/permission.models';
import { Role } from '../models/role.models';
import { mySeeder } from './db.config';

mySeeder.initialize().then(async () => {
    const permissionRepository = mySeeder.getRepository(Permission);

    const perms = ['view_users', 'edit_users', 'view_roles', 'edit_roles', 'view_products', 'edit_products', 'view_orders', 'edit_orders'];

    let permissions = [];

    for (let i = 0; i < perms.length; i++) {
        permissions.push(await permissionRepository.save({
            name: perms[i]
        }));
    }

    const roleRepository = mySeeder.getRepository(Role);

    await roleRepository.save({
        name: 'Admin',
        permissions
    });

    delete permissions[3];
    await roleRepository.save({
        name: 'Editor',
        permissions
    });

    delete permissions[1];
    delete permissions[5];
    delete permissions[7];
    await roleRepository.save({
        name: 'Viewer',
        permissions
    });

    console.log('Seeding complete!');
    process.exit(0);
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});