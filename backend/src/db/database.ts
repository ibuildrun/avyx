import BetterSqlite3 from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { User, Task, Report, Payment, ModerationLog, TelegramUser } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Database {
  private db: BetterSqlite3.Database;

  constructor(dbPath: string = 'avyx.db') {
    this.db = new BetterSqlite3(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.init();
  }

  private init() {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    this.db.exec(schema);
  }

  // User methods
  getOrCreateUser(telegramUser: TelegramUser): User {
    const existing = this.db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramUser.id) as User | undefined;
    
    if (existing) {
      // Update user info
      this.db.prepare(`
        UPDATE users SET 
          username = ?, first_name = ?, last_name = ?, photo_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE telegram_id = ?
      `).run(
        telegramUser.username || null,
        telegramUser.first_name,
        telegramUser.last_name || null,
        telegramUser.photo_url || null,
        telegramUser.id
      );
      return this.db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramUser.id) as User;
    }

    // Check if admin
    const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim())).filter(Boolean);
    const isAdmin = adminIds.includes(telegramUser.id) ? 1 : 0;

    this.db.prepare(`
      INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, is_admin)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      telegramUser.id,
      telegramUser.username || null,
      telegramUser.first_name,
      telegramUser.last_name || null,
      telegramUser.photo_url || null,
      isAdmin
    );

    return this.db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramUser.id) as User;
  }

  getUserById(id: number): User | undefined {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  }

  getUserByTelegramId(telegramId: number): User | undefined {
    return this.db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId) as User | undefined;
  }

  updateUser(id: number, data: Partial<User>): User | undefined {
    const fields = Object.keys(data).filter(k => k !== 'id' && k !== 'telegram_id');
    if (fields.length === 0) return this.getUserById(id);

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => data[f as keyof User]);

    this.db.prepare(`UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
    return this.getUserById(id);
  }

  updateUserStatus(id: number, status: string, adminId: number, reason?: string): void {
    this.db.prepare('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    this.createModerationLog(adminId, status === 'banned' ? 'ban_user' : 'warn_user', 'user', id.toString(), reason);
  }

  getUsers(limit = 50, offset = 0): User[] {
    return this.db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset) as User[];
  }

  addStars(userId: number, amount: number): void {
    this.db.prepare('UPDATE users SET stars_balance = stars_balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(amount, userId);
  }

  // Task methods
  createTask(task: Omit<Task, 'created_at' | 'updated_at'>): Task {
    this.db.prepare(`
      INSERT INTO tasks (id, creator_id, title, description, category, budget_min, budget_max, deadline, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      task.id, task.creator_id, task.title, task.description,
      task.category, task.budget_min, task.budget_max, task.deadline, task.status || 'active'
    );
    return this.getTaskById(task.id)!;
  }

  getTaskById(id: string): Task | undefined {
    return this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
  }

  getTasks(filters: { status?: string; category?: string; creatorId?: number } = {}, limit = 20, offset = 0): Task[] {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params: (string | number)[] = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    } else {
      query += ' AND status NOT IN (?, ?)';
      params.push('hidden', 'deleted');
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.creatorId) {
      query += ' AND creator_id = ?';
      params.push(filters.creatorId);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return this.db.prepare(query).all(...params) as Task[];
  }

  updateTask(id: string, data: Partial<Task>): Task | undefined {
    const fields = Object.keys(data).filter(k => k !== 'id' && k !== 'creator_id');
    if (fields.length === 0) return this.getTaskById(id);

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => data[f as keyof Task]);

    this.db.prepare(`UPDATE tasks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
    return this.getTaskById(id);
  }

  deleteTask(id: string): void {
    this.db.prepare("UPDATE tasks SET status = 'deleted', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  }

  getUserTasks(userId: number, limit = 5): Task[] {
    return this.db.prepare(`
      SELECT * FROM tasks WHERE creator_id = ? AND status NOT IN ('deleted') 
      ORDER BY created_at DESC LIMIT ?
    `).all(userId, limit) as Task[];
  }

  // Report methods
  createReport(report: Omit<Report, 'status' | 'processed_by' | 'processed_at' | 'created_at'>): Report | null {
    try {
      this.db.prepare(`
        INSERT INTO reports (id, reporter_id, content_type, content_id, reason, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(report.id, report.reporter_id, report.content_type, report.content_id, report.reason, report.description);
      
      // Check if content should be auto-flagged
      this.checkAutoFlag(report.content_type, report.content_id);
      
      return this.getReportById(report.id)!;
    } catch (err) {
      // Duplicate report
      if ((err as Error).message.includes('UNIQUE constraint')) {
        return null;
      }
      throw err;
    }
  }

  private checkAutoFlag(contentType: string, contentId: string): void {
    const count = this.db.prepare(`
      SELECT COUNT(*) as count FROM reports WHERE content_type = ? AND content_id = ?
    `).get(contentType, contentId) as { count: number };

    if (count.count >= 3) {
      if (contentType === 'task') {
        this.db.prepare("UPDATE tasks SET status = 'flagged', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(contentId);
      }
      // Add more content types as needed
    }
  }

  getReportById(id: string): Report | undefined {
    return this.db.prepare('SELECT * FROM reports WHERE id = ?').get(id) as Report | undefined;
  }

  getPendingReports(limit = 50): Report[] {
    return this.db.prepare(`
      SELECT * FROM reports WHERE status = 'pending' ORDER BY created_at DESC LIMIT ?
    `).all(limit) as Report[];
  }

  getUserReports(userId: number): Report[] {
    return this.db.prepare('SELECT * FROM reports WHERE reporter_id = ? ORDER BY created_at DESC').all(userId) as Report[];
  }

  processReport(id: string, status: string, adminId: number): void {
    this.db.prepare(`
      UPDATE reports SET status = ?, processed_by = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, adminId, id);
  }

  getReportCount(contentType: string, contentId: string): number {
    const result = this.db.prepare(`
      SELECT COUNT(*) as count FROM reports WHERE content_type = ? AND content_id = ?
    `).get(contentType, contentId) as { count: number };
    return result.count;
  }

  // Payment methods
  createPayment(payment: Omit<Payment, 'created_at'>): Payment {
    this.db.prepare(`
      INSERT INTO payments (id, user_id, amount, currency, status, telegram_payment_id, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      payment.id, payment.user_id, payment.amount, payment.currency || 'XTR',
      payment.status || 'pending', payment.telegram_payment_id, payment.description
    );
    return this.getPaymentById(payment.id)!;
  }

  getPaymentById(id: string): Payment | undefined {
    return this.db.prepare('SELECT * FROM payments WHERE id = ?').get(id) as Payment | undefined;
  }

  updatePaymentStatus(id: string, status: string, telegramPaymentId?: string): void {
    if (telegramPaymentId) {
      this.db.prepare('UPDATE payments SET status = ?, telegram_payment_id = ? WHERE id = ?').run(status, telegramPaymentId, id);
    } else {
      this.db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(status, id);
    }
  }

  getUserPayments(userId: number): Payment[] {
    return this.db.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Payment[];
  }

  // Moderation methods
  createModerationLog(adminId: number, action: string, targetType: string, targetId: string, reason?: string): ModerationLog {
    const id = crypto.randomUUID();
    this.db.prepare(`
      INSERT INTO moderation_logs (id, admin_id, action, target_type, target_id, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, adminId, action, targetType, targetId, reason || null);
    return this.db.prepare('SELECT * FROM moderation_logs WHERE id = ?').get(id) as ModerationLog;
  }

  hideContent(contentType: string, contentId: string, adminId: number, reason?: string): void {
    if (contentType === 'task') {
      this.db.prepare("UPDATE tasks SET status = 'hidden', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(contentId);
    }
    this.createModerationLog(adminId, 'hide_content', contentType, contentId, reason);
  }

  getModerationLogs(targetType?: string, targetId?: string): ModerationLog[] {
    if (targetType && targetId) {
      return this.db.prepare(`
        SELECT * FROM moderation_logs WHERE target_type = ? AND target_id = ? ORDER BY created_at DESC
      `).all(targetType, targetId) as ModerationLog[];
    }
    return this.db.prepare('SELECT * FROM moderation_logs ORDER BY created_at DESC LIMIT 100').all() as ModerationLog[];
  }

  // Stats
  getStats(): { users: number; tasks: number; reports: number; payments: number } {
    const users = (this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
    const tasks = (this.db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status != 'deleted'").get() as { count: number }).count;
    const reports = (this.db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'").get() as { count: number }).count;
    const payments = (this.db.prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'completed'").get() as { count: number }).count;
    return { users, tasks, reports, payments };
  }

  close(): void {
    this.db.close();
  }
}
