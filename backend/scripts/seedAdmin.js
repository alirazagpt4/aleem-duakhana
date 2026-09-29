import 'dotenv/config';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import bcrypt from 'bcryptjs';
import { Admin, sequelize } from '../models/index.js';

const rl = readline.createInterface({ input, output });

try {
    const username = (await rl.question('Admin username: ')).trim();
    const password = await rl.question('Admin password (min 8 chars): ');

    if (!username || password.length < 8) {
        console.log('Username required and password must be at least 8 characters.');
        process.exit(1);
    }

    const password_hash = await bcrypt.hash(password, 12);

    const existing = await Admin.findOne({ where: { username } });
    if (existing) {
        await existing.update({ password_hash });
        console.log(`Password updated for "${username}"`);
    } else {
        await Admin.create({ username, password_hash });
        console.log(`Admin "${username}" created`);
    }
} catch (error) {
    console.error('Failed:', error.message);
    process.exit(1);
} finally {
    rl.close();
    await sequelize.close();
}