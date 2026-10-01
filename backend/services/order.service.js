import { sequelize, Order, OrderItem, Product } from '../models/index.js';
import AppError from '../utils/AppError.js';
import generateOrderNumber from '../utils/orderNumber.js';

const withItems = [{ model: OrderItem, as: 'items' }];

// Status sirf aage ki taraf badal sakta hai
const NEXT_STATUS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
};

const findOrFail = async (id) => {
    const order = await Order.findByPk(id, { include: withItems });
    if (!order) throw new AppError('Order not found', 404);
    return order;
};

export const create = async ({ customer, items }) => {
    // Ek hi product do baar aaye to quantity jod do
    const quantities = new Map();
    for (const item of items) {
        quantities.set(item.product_id, (quantities.get(item.product_id) || 0) + item.quantity);
    }
    const ids = [...quantities.keys()];

    // Price database se aati hai, client se kabhi nahi
    const products = await Product.findAll({ where: { id: ids, is_active: true } });
    if (products.length !== ids.length) {
        throw new AppError('One or more products are not available', 400);
    }

    let subtotal = 0;
    const orderItems = products.map((product) => {
        const quantity = quantities.get(product.id);
        subtotal += product.price_after_discount * quantity;
        return {
            product_id: product.id,
            product_name: product.name,
            quantity,
            unit_price: product.price_after_discount,
        };
    });

    const shipping = 0; // admin baad mein khud likhega
    const total = subtotal + shipping;

    // Ya to order aur uske saare items save honge, ya kuch bhi nahi
    const orderId = await sequelize.transaction(async (t) => {
        const order = await Order.create(
            { order_number: generateOrderNumber(), ...customer, subtotal, shipping, total },
            { transaction: t }
        );
        await OrderItem.bulkCreate(
            orderItems.map((item) => ({ ...item, order_id: order.id })),
            { transaction: t }
        );
        return order.id;
    });

    return findOrFail(orderId);
};

export const getAll = async ({ status, page, limit }) => {
    const where = status ? { status } : {};
    const { rows, count } = await Order.findAndCountAll({
        where,
        order: [['created_at', 'DESC'], ['id', 'DESC']],
        limit,
        offset: (page - 1) * limit,
    });
    return { orders: rows, total: count, page, pages: Math.ceil(count / limit) };
};

export const getById = (id) => findOrFail(id);

export const update = async (id, data) => {
    const order = await findOrFail(id);

    if (order.status === 'delivered' || order.status === 'cancelled') {
        throw new AppError('This order is closed and cannot be changed', 409);
    }

    if (data.status && data.status !== order.status) {
        if (!NEXT_STATUS[order.status].includes(data.status)) {
            throw new AppError(`Cannot change status from ${order.status} to ${data.status}`, 400);
        }
    }

    // Shipping badle to total khud dobara banta hai
    const shipping = data.shipping ?? order.shipping;
    await order.update({ ...data, total: order.subtotal + shipping });

    return findOrFail(id);
};