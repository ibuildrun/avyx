import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Database } from './db/database.js';
import { BotHandler } from './bot/handler.js';
import { createApiRouter } from './api/router.js';
import { createAdminRouter } from './admin/router.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Initialize database
const db = new Database();

// Initialize bot
const bot = new BotHandler(db);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Telegram webhook
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// API routes
app.use('/api/v1', createApiRouter(db, bot));

// Admin routes
app.use('/admin', createAdminRouter(db));

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'InternalError', message: 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AVYX Backend running on port ${PORT}`);
  console.log(`📡 Webhook endpoint: /webhook`);
  console.log(`🔧 Admin panel: /admin`);
});

export { app, db };
