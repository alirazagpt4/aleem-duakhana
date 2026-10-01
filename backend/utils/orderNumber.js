import crypto from 'crypto';

// 0, O, 1, I jaise mil-julte harf nikaal diye, taake phone par bolne mein ghalti na ho
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const generateOrderNumber = () => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    let random = '';
    for (let i = 0; i < 6; i++) {
        random += ALPHABET[crypto.randomInt(ALPHABET.length)];
    }
    return `AD-${yy}${mm}${dd}-${random}`;
};

export default generateOrderNumber;