import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderItem = sequelize.define(
    'OrderItem',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        order_id: { type: DataTypes.INTEGER, allowNull: false },
        product_id: { type: DataTypes.INTEGER, allowNull: true },
        product_name: { type: DataTypes.STRING(200), allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        unit_price: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        tableName: 'order_items',
        timestamps: false,
    }
);

export default OrderItem;