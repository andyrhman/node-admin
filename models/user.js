import { DataTypes, Model } from 'sequelize';
import db from './index.js';
import Role from './role.js';

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize: db.sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeCreate: (user) => {
      user.email = user.email.toLowerCase();
      user.username = user.username.toLowerCase();
    },
    beforeUpdate: (user) => {
      user.email = user.email.toLowerCase();
      user.username = user.username.toLowerCase();
    },
  },
});

User.belongsTo(Role, { foreignKey: 'role_id' });

export default User;
