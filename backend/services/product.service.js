import { Product, Category } from '../models/index.js';
import AppError from '../utils/AppError.js';

const withCategory = {
    model: Category,
    as: 'category',
    attributes: ['id', 'cat_name'],
};

// Discount percent mein hai. Price kabhi client se nahi aati, hamesha yahan banti hai
const calcPrice = (retailPrice, discount) =>
    Math.round(retailPrice - (retailPrice * discount) / 100);

const assertCategoryExists = async (categoryId) => {
    const category = await Category.findByPk(categoryId);
    if (!category) throw new AppError('Category does not exist', 400);
};

const findOrFail = async (id) => {
    const product = await Product.findByPk(id, { include: withCategory });
    if (!product) throw new AppError('Product not found', 404);
    return product;
};

export const getAll = ({ categoryId, onlyActive }) => {
    const where = {};
    if (onlyActive) where.is_active = true;
    if (categoryId) where.category_id = categoryId;

    return Product.findAll({
        where,
        include: withCategory,
        order: [['created_at', 'DESC']],
    });
};

// Public ke liye hidden product "nahi mila" hi dikhna chahiye
export const getById = async (id, { onlyActive }) => {
    const product = await findOrFail(id);
    if (onlyActive && !product.is_active) {
        throw new AppError('Product not found', 404);
    }
    return product;
};

export const create = async (data) => {
    await assertCategoryExists(data.category_id);
    const price_after_discount = calcPrice(data.retail_price, data.discount ?? 0);
    return Product.create({ ...data, price_after_discount });
};

export const update = async (id, data) => {
    const product = await findOrFail(id);
    const oldImage = product.image;

    if (data.category_id !== undefined) {
        await assertCategoryExists(data.category_id);
    }

    const retail = data.retail_price ?? product.retail_price;
    const discount = data.discount ?? product.discount;

    await product.update({
        ...data,
        price_after_discount: calcPrice(retail, discount),
    });

    if (data.image && oldImage) await deleteUploadedFile(oldImage);
    return product;
};

export const remove = async (id) => {
    const product = await findOrFail(id);
    await product.destroy();
    await deleteUploadedFile(product.image);
};