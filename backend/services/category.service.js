import { Category } from '../models/index.js';
import AppError from '../utils/AppError.js';

const findOrFail = async (id) => {
    const category = await Category.findByPk(id);
    if (!category) throw new AppError('Category not found', 404);
    return category;
};

export const getAll = () => Category.findAll({ order: [['cat_name', 'ASC']] });

export const create = async (cat_name) => {
    try {
        return await Category.create({ cat_name });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError('Category already exists', 409);
        }
        throw error;
    }
};

export const update = async (id, cat_name) => {
    const category = await findOrFail(id);
    try {
        return await category.update({ cat_name });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError('Category already exists', 409);
        }
        throw error;
    }
};

export const remove = async (id) => {
    const category = await findOrFail(id);
    try {
        await category.destroy();
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new AppError('Cannot delete: this category has products', 409);
        }
        throw error;
    }
};