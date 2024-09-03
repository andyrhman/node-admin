import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const perms = [
        'view_users', 'edit_users', 'view_roles', 'edit_roles',
        'view_products', 'edit_products', 'view_orders', 'edit_orders'
    ];

    const permissions = await Promise.all(
        perms.map(name => prisma.permission.create({ data: { name } }))
    );

    await prisma.role.create({
        data: {
            name: 'Admin',
            permissions: {
                connect: permissions.map(p => ({ id: p.id }))
            }
        }
    });

    await prisma.role.create({
        data: {
            name: 'Editor',
            permissions: {
                connect: permissions.filter((_, i) => i !== 3).map(p => ({ id: p.id }))
            }
        }
    });

    await prisma.role.create({
        data: {
            name: 'Viewer',
            permissions: {
                connect: permissions.filter((_, i) => i !== 1 && i !== 3 && i !== 5 && i !== 7).map(p => ({ id: p.id }))
            }
        }
    });

    console.log('Seeding complete!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });