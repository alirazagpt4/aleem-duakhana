import 'dotenv/config';
import sequelize from './config/database.js';
// import { Admin } from './models/index.js';
import app from './app/app.js';
// console.log('Admins count:', await Admin.count());

const PORT = process.env.PORT || 5000;

try {
    await sequelize.authenticate();
    console.log('Database connected');

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
}