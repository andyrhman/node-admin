'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Permissions data
      const perms = [
        { name: 'view_users' },
        { name: 'edit_users' },
        { name: 'view_roles' },
        { name: 'edit_roles' },
        { name: 'view_products' },
        { name: 'edit_products' },
        { name: 'view_orders' },
        { name: 'edit_orders' }
      ];

      // Insert permissions
      await queryInterface.bulkInsert('permissions', perms);

      // Roles data
      const roles = [
        { name: 'Admin' },
        { name: 'Editor' },
        { name: 'Viewer' }
      ];

      // Insert roles
      await queryInterface.bulkInsert('roles', roles);

      // Fetch the inserted roles and permissions
      const [insertedRoles] = await queryInterface.sequelize.query(
        `SELECT id, name FROM roles WHERE name IN ('Admin', 'Editor', 'Viewer')`
      );
      
      const [insertedPermissions] = await queryInterface.sequelize.query(
        `SELECT id, name FROM permissions`
      );

      const rolePermissions = [];

      // Assign all permissions to Admin
      const adminRole = insertedRoles.find(role => role.name === 'Admin');
      if (!adminRole) {
        throw new Error('Admin role not found!');
      }
      
      insertedPermissions.forEach(permission => {
        rolePermissions.push({
          role_id: adminRole.id,
          permission_id: permission.id
        });
      });

      // Assign specific permissions to Editor
      const editorRole = insertedRoles.find(role => role.name === 'Editor');
      if (!editorRole) {
        throw new Error('Editor role not found!');
      }

      const editorPerms = insertedPermissions.filter(p => !['edit_orders', 'edit_products'].includes(p.name));
      editorPerms.forEach(permission => {
        rolePermissions.push({
          role_id: editorRole.id,
          permission_id: permission.id
        });
      });

      // Assign only view permissions to Viewer
      const viewerRole = insertedRoles.find(role => role.name === 'Viewer');
      if (!viewerRole) {
        throw new Error('Viewer role not found!');
      }

      const viewerPerms = insertedPermissions.filter(p => p.name.startsWith('view'));
      viewerPerms.forEach(permission => {
        rolePermissions.push({
          role_id: viewerRole.id,
          permission_id: permission.id
        });
      });

      // Insert into role_permissions table
      await queryInterface.bulkInsert('role_permissions', rolePermissions);
      
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('role_permissions', null, {
        truncate: true,
        restartIdentity: true,
      });

      await queryInterface.bulkDelete('roles', null, {
        truncate: true,
        restartIdentity: true,
      });

      await queryInterface.bulkDelete('permissions', null, {
        truncate: true,
        restartIdentity: true,
      });
    } catch (error) {
      console.error('Error reverting seed:', error);
      throw error;
    }
  }
};
