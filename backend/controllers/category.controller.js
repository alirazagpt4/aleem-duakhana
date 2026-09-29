import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import * as categoryService from '../services/category.service.js';

const getName = (body) => {
    const name = typeof body?.cat_name === 'string' ? body.cat_name.trim() : '';
    if (!name || name.length > 100) {
        throw new AppError('Category name is required (max 100 characters)', 400);
    }
    return name;
};

const getId = (params) => {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id < 1) {
        throw new AppError('Invalid category id', 400);
    }
    return id;
};

export const getAll = asyncHandler(async (req, res) => {
    res.json(await categoryService.getAll());
});

export const create = asyncHandler(async (req, res) => {
    const category = await categoryService.create(getName(req.body));
    res.status(201).json(category);
});

export const update = asyncHandler(async (req, res) => {
    const category = await categoryService.update(getId(req.params), getName(req.body));
    res.json(category);
});

export const remove = asyncHandler(async (req, res) => {
    await categoryService.remove(getId(req.params));
    res.json({ message: 'Category deleted' });
});