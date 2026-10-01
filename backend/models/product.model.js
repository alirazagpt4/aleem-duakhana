import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        rating: {
            type: DataTypes.ENUM('1', '2', '3', '4', '5'),
            allowNull: false,
            defaultValue: '5',
        },
        retail_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        price_after_discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

export default Product;