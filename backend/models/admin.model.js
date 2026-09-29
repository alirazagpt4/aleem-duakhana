import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Admin = sequelize.define(
    'Admin',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        tableName: 'admins',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

export default Admin;