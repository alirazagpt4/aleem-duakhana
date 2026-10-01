import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import * as orderService from '../services/order.service.js';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const toInt = (value) =>
    value === undefined || value === null || value === '' ? NaN : Number(value);

const getId = (value) => {
    const id = toInt(value);
    if (!Number.isInteger(id) || id < 1) throw new AppError('Invalid id', 400);
    return id;
};

const text = (value, label, min, max) => {
    const str = typeof value === 'string' ? value.trim() : '';
    if (str.length < min || str.length > max) {
        throw new AppError(`${label} is required (${min}-${max} characters)`, 400);
    }
    return str;
};

// 0300-1234567, +92 300 1234567, 923001234567 sab 03001234567 ban jate hain
const normalizePhone = (value) => {
    let phone = String(value ?? '').replace(/[\s-]/g, '');
    if (phone.startsWith('+92')) phone = '0' + phone.slice(3);
    else if (phone.startsWith('92') && phone.length === 12) phone = '0' + phone.slice(2);

    if (!/^03\d{9}$/.test(phone)) {
        throw new AppError('Enter a valid mobile number like 03001234567', 400);
    }
    return phone;
};

const buildOrder = (body = {}) => {
    const customer = {
        customer_name: text(body.customer_name, 'Name', 2, 120),
        customer_phone: normalizePhone(body.customer_phone),
        city: text(body.city, 'City', 2, 80),
        address: text(body.address, 'Address', 5, 500),
    };

    const { items } = body;
    if (!Array.isArray(items) || items.length < 1 || items.length > 20) {
        throw new AppError('Cart must have 1 to 20 items', 400);
    }

    const cleanItems = items.map((item) => {
        const product_id = toInt(item?.product_id);
        const quantity = toInt(item?.quantity);
        if (!Number.isInteger(product_id) || product_id < 1) {
            throw new AppError('Invalid product in cart', 400);
        }
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
            throw new AppError('Quantity must be between 1 and 20', 400);
        }
        return { product_id, quantity };
    });

    return { customer, items: cleanItems };
};

// Admin sirf ye fields badal sakta hai
const buildUpdate = (body = {}) => {
    const data = {};

    if (body.status !== undefined) {
        if (!STATUSES.includes(body.status)) throw new AppError('Invalid status', 400);
        data.status = body.status;
    }

    if (body.shipping !== undefined) {
        const shipping = toInt(body.shipping);
        if (!Number.isInteger(shipping) || shipping < 0 || shipping > 100000) {
            throw new AppError('Shipping must be a whole number from 0 to 100000', 400);
        }
        data.shipping = shipping;
    }

    const optionalText = { courier: 50, tracking_number: 60, notes: 1000 };
    for (const [field, max] of Object.entries(optionalText)) {
        if (body[field] !== undefined) {
            const value = typeof body[field] === 'string' ? body[field].trim() : null;
            if (value === null || value.length > max) {
                throw new AppError(`${field} must be text up to ${max} characters`, 400);
            }
            data[field] = value || null;
        }
    }

    if (Object.keys(data).length === 0) {
        throw new AppError('Nothing to update', 400);
    }
    return data;
};

// Public: customer order dalta hai
export const create = asyncHandler(async (req, res) => {
    const order = await orderService.create(buildOrder(req.body));
    res.status(201).json(order);
});

// Admin
export const getAll = asyncHandler(async (req, res) => {
    const { status } = req.query;
    if (status && !STATUSES.includes(status)) throw new AppError('Invalid status', 400);

    const page = req.query.page ? getId(req.query.page) : 1;
    const limit = 20;
    res.json(await orderService.getAll({ status, page, limit }));
});

export const getOne = asyncHandler(async (req, res) => {
    res.json(await orderService.getById(getId(req.params.id)));
});

export const update = asyncHandler(async (req, res) => {
    res.json(await orderService.update(getId(req.params.id), buildUpdate(req.body)));
});