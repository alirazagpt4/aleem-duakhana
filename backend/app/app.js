import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import sequelize from '../config/database.js';
import { notFound, errorHandler } from '../middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Logs: development mein short aur rang wala, production mein poori detail
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            status: 'ok',
            database: 'up',
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            database: 'down',
            timestamp: new Date().toISOString(),
        });
    }
});

app.use(notFound);
app.use(errorHandler);

export default app;