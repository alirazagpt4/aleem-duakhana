import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.join(__dirname, '..', 'uploads');

// publicPath jaise: /uploads/products/abc.jpg
export const deleteUploadedFile = async (publicPath) => {
    if (!publicPath) return;

    const relative = publicPath.replace(/^\/uploads\//, '');
    const fullPath = path.join(UPLOADS_ROOT, relative);

    // Sirf uploads folder ke andar ki file hi delete ho sakti hai
    if (!fullPath.startsWith(UPLOADS_ROOT)) return;

    try {
        await fs.unlink(fullPath);
    } catch {
        // file pehle se nahi hai to koi masla nahi
    }
};