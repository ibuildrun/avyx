import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Database } from '../db/database.js';
import type { BotHandler } from '../bot/handler.js';
import { createAuthMiddleware } from '../auth/middleware.js';

export function createApiRouter(db: Database, bot: BotHandler): Router {
  const router = Router();
  const auth = createAuthMiddleware(db);

  // ==================== Users ====================

  // Get current user
  router.get('/users/me', auth.requireAuth, (req, res) => {
    res.json(req.user);
  });

  // Update current user
  router.put('/users/me', auth.requireAuth, (req, res) => {
    const { type, first_name, last_name } = req.body;
    const updates: Record<string, unknown> = {};

    if (type && ['designer', 'entrepreneur', 'company'].includes(type)) {
      updates.type = type;
    }
    if (first_name) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;

    const user = db.updateUser(req.user!.id, updates);
    res.json(user);
  });

  // Get user by ID (public info)
  router.get('/users/:id', auth.optionalAuth, (req, res) => {
    const user = db.getUserById(parseInt(req.params.id));
    if (!user) {
      res.status(404).json({ error: 'NotFound', message: 'User not found' });
      return;
    }

    // Return public info only
    res.json({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      type: user.type,
      level: user.level
    });
  });

  // ==================== Tasks ====================

  // List tasks
  router.get('/tasks', auth.optionalAuth, (req, res) => {
    const { category, status, limit = '20', offset = '0' } = req.query;
    
    const tasks = db.getTasks(
      {
        category: category as string,
        status: status as string
      },
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.json({ tasks, count: tasks.length });
  });

  // Get task by ID
  router.get('/tasks/:id', auth.optionalAuth, (req, res) => {
    const task = db.getTaskById(req.params.id);
    if (!task || task.status === 'deleted') {
      res.status(404).json({ error: 'NotFound', message: 'Task not found' });
      return;
    }

    // Don't show hidden tasks to non-owners
    if (task.status === 'hidden' && (!req.user || req.user.id !== task.creator_id)) {
      res.status(404).json({ error: 'NotFound', message: 'Task not found' });
      return;
    }

    res.json(task);
  });

  // Create task
  router.post('/tasks', auth.requireAuth, (req, res) => {
    const { title, description, category, budget_min, budget_max, deadline } = req.body;

    if (!title) {
      res.status(400).json({ error: 'BadRequest', message: 'Title is required' });
      return;
    }

    const task = db.createTask({
      id: uuidv4(),
      creator_id: req.user!.id,
      title,
      description: description || null,
      category: category || null,
      budget_min: budget_min || null,
      budget_max: budget_max || null,
      deadline: deadline || null,
      status: 'active'
    });

    res.status(201).json(task);
  });

  // Update task
  router.put('/tasks/:id', auth.requireAuth, (req, res) => {
    const task = db.getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'NotFound', message: 'Task not found' });
      return;
    }

    if (task.creator_id !== req.user!.id && !req.user!.is_admin) {
      res.status(403).json({ error: 'Forbidden', message: 'Not your task' });
      return;
    }

    const { title, description, category, budget_min, budget_max, deadline, status } = req.body;
    const updates: Record<string, unknown> = {};

    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (budget_min !== undefined) updates.budget_min = budget_min;
    if (budget_max !== undefined) updates.budget_max = budget_max;
    if (deadline !== undefined) updates.deadline = deadline;
    if (status && ['active', 'completed'].includes(status)) updates.status = status;

    const updated = db.updateTask(req.params.id, updates);
    res.json(updated);
  });

  // Delete task
  router.delete('/tasks/:id', auth.requireAuth, (req, res) => {
    const task = db.getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'NotFound', message: 'Task not found' });
      return;
    }

    if (task.creator_id !== req.user!.id && !req.user!.is_admin) {
      res.status(403).json({ error: 'Forbidden', message: 'Not your task' });
      return;
    }

    db.deleteTask(req.params.id);
    res.status(204).send();
  });

  // ==================== Reports ====================

  // Submit report
  router.post('/reports', auth.requireAuth, (req, res) => {
    const { content_type, content_id, reason, description } = req.body;

    if (!content_type || !content_id || !reason) {
      res.status(400).json({ error: 'BadRequest', message: 'content_type, content_id, and reason are required' });
      return;
    }

    if (!['task', 'comment', 'user', 'work'].includes(content_type)) {
      res.status(400).json({ error: 'BadRequest', message: 'Invalid content_type' });
      return;
    }

    if (!['spam', 'inappropriate', 'fraud', 'other'].includes(reason)) {
      res.status(400).json({ error: 'BadRequest', message: 'Invalid reason' });
      return;
    }

    const report = db.createReport({
      id: uuidv4(),
      reporter_id: req.user!.id,
      content_type,
      content_id,
      reason,
      description: description || null
    });

    if (!report) {
      res.status(409).json({ error: 'Conflict', message: 'Report already exists' });
      return;
    }

    // Notify admins
    bot.notifyAdmins(`🚨 <b>Новая жалоба</b>\n\nТип: ${content_type}\nID: ${content_id}\nПричина: ${reason}\n\nОт: ${req.user!.first_name} (@${req.user!.username || 'unknown'})`);

    res.status(201).json(report);
  });

  // Get my reports
  router.get('/reports/my', auth.requireAuth, (req, res) => {
    const reports = db.getUserReports(req.user!.id);
    res.json({ reports });
  });

  // ==================== Payments ====================

  // Create invoice
  router.post('/payments/invoice', auth.requireAuth, (req, res) => {
    const { amount, description } = req.body;

    if (!amount || amount < 1) {
      res.status(400).json({ error: 'BadRequest', message: 'Amount must be at least 1' });
      return;
    }

    // Create pending payment
    const payment = db.createPayment({
      id: uuidv4(),
      user_id: req.user!.id,
      amount,
      currency: 'XTR',
      status: 'pending',
      telegram_payment_id: null,
      description: description || 'AVYX Stars'
    });

    res.json({
      payment_id: payment.id,
      amount,
      currency: 'XTR',
      // Frontend will use Telegram WebApp.openInvoice()
      invoice_payload: payment.id
    });
  });

  // Get payment history
  router.get('/payments/history', auth.requireAuth, (req, res) => {
    const payments = db.getUserPayments(req.user!.id);
    res.json({ payments });
  });

  return router;
}
