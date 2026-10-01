import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define(
    'Order',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        order_number: { type: DataTypes.STRING(30), allowNull: false, unique: true },
        customer_name: { type: DataTypes.STRING(120), allowNull: false },
        customer_phone: { type: DataTypes.STRING(20), allowNull: false },
        city: { type: DataTypes.STRING(80), allowNull: false },
        address: { type: DataTypes.TEXT, allowNull: false },
        country: { type: DataTypes.STRING(60), allowNull: false, defaultValue: 'Pakistan' },
        payment_method: {
            type: DataTypes.ENUM('COD'),
            allowNull: false,
            defaultValue: 'COD',
        },
        subtotal: { type: DataTypes.INTEGER, allowNull: false },
        shipping: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        total: { type: DataTypes.INTEGER, allowNull: false },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        courier: { type: DataTypes.STRING(50) },
        tracking_number: { type: DataTypes.STRING(60) },
        notes: { type: DataTypes.TEXT },
    },
    {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

export default Order;