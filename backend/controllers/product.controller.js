import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import * as productService from '../services/product.service.js';
import { deleteUploadedFile } from '../utils/deleteFile.js';

const toInt = (value) =>
    value === undefined || value === null || value === '' ? NaN : Number(value);

const toBool = (value) => {
    if (value === true || value === 'true' || value === 1 || value === '1') return true;
    if (value === false || value === 'false' || value === 0 || value === '0') return false;
    return null;
};

const getId = (value, label = 'id') => {
    const id = toInt(value);
    if (!Number.isInteger(id) || id < 1) throw new AppError(`Invalid ${label}`, 400);
    return id;
};

// Sirf wahi fields nikaalta hai jo allowed hain (price_after_discount client se kabhi nahi lete)
const buildData = (body = {}, isCreate = false) => {
    const data = {};

    if (isCreate || body.name !== undefined) {
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        if (!name || name.length > 200) {
            throw new AppError('Name is required (max 200 characters)', 400);
        }
        data.name = name;
    }

    if (body.description !== undefined) {
        if (typeof body.description !== 'string') {
            throw new AppError('Description must be text', 400);
        }
        data.description = body.description.trim();
    }

    if (body.rating !== undefined) {
        const rating = String(body.rating);
        if (!['1', '2', '3', '4', '5'].includes(rating)) {
            throw new AppError('Rating must be 1 to 5', 400);
        }
        data.rating = rating;
    }

    if (isCreate || body.retail_price !== undefined) {
        const price = toInt(body.retail_price);
        if (!Number.isInteger(price) || price < 1) {
            throw new AppError('Retail price must be a whole number above 0', 400);
        }
        data.retail_price = price;
    }

    if (body.discount !== undefined) {
        const discount = toInt(body.discount);
        if (!Number.isInteger(discount) || discount < 0 || discount > 100) {
            throw new AppError('Discount must be a whole number from 0 to 100', 400);
        }
        data.discount = discount;
    }

    if (isCreate || body.category_id !== undefined) {
        data.category_id = getId(body.category_id, 'category id');
    }

    if (body.is_active !== undefined) {
        const active = toBool(body.is_active);
        if (active === null) throw new AppError('is_active must be true or false', 400);
        data.is_active = active;
    }

    return data;
};

// Public: sirf active products, ?category=ID se filter
export const getAll = asyncHandler(async (req, res) => {
    const categoryId = req.query.category ? getId(req.query.category, 'category id') : null;
    res.json(await productService.getAll({ categoryId, onlyActive: true }));
});

// Admin: hidden products bhi
export const getAllAdmin = asyncHandler(async (req, res) => {
    const categoryId = req.query.category ? getId(req.query.category, 'category id') : null;
    res.json(await productService.getAll({ categoryId, onlyActive: false }));
});

export const getOne = asyncHandler(async (req, res) => {
    res.json(await productService.getById(getId(req.params.id), { onlyActive: true }));
});

export const create = asyncHandler(async (req, res) => {
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
    try {
        const data = buildData(req.body, true);
        if (imagePath) data.image = imagePath;
        const product = await productService.create(data);
        res.status(201).json(product);
    } catch (error) {
        await deleteUploadedFile(imagePath);
        throw error;
    }
});

export const update = asyncHandler(async (req, res) => {
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
    try {
        const data = buildData(req.body);
        if (imagePath) data.image = imagePath;
        const product = await productService.update(getId(req.params.id), data);
        res.json(product);
    } catch (error) {
        await deleteUploadedFile(imagePath);
        throw error;
    }
});

export const remove = asyncHandler(async (req, res) => {
    await productService.remove(getId(req.params.id));
    res.json({ message: 'Product deleted' });
});