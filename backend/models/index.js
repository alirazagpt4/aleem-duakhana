import sequelize from '../config/database.js';
import Admin from './admin.model.js';
import Category from './category,model.js';
import Product from './product.model.js';
import Order from './order.model.js';
import OrderItem from './orderItem.model.js';

Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });


export { sequelize, Admin, Category, Product, Order, OrderItem };