import sequelize from '../config/database.js';
import Admin from './admin.model.js';
import Category from './category,model.js';
import Product from './product.model.js';

Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

export { sequelize, Admin, Category, Product };