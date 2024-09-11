import { DataTypes, Model } from 'sequelize';
import db from './index.js';

class Permission extends Model { }

Permission.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: db.sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
});

export default Permission;
