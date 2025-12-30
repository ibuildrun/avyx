import type { Request, Response, NextFunction } from 'express';
import { validateInitData } from './initData.js';
import type { Database } from '../db/database.js';
import type { User } from '../types.js';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: User;
      telegramUser?: { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string };
    }
  }
}

export function createAuthMiddleware(db: Database) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';

  return {
    /**
     * Require valid Telegram initData
     */
    requireAuth: (req: Request, res: Response, next: NextFunction) => {
      const initData = req.headers['x-telegram-init-data'] as string || req.query.initData as string;

      if (!initData) {
        res.status(401).json({ error: 'Unauthorized', message: 'Missing authentication' });
        return;
      }

      const telegramUser = validateInitData(initData, botToken);
      if (!telegramUser) {
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid authentication' });
        return;
      }

      // Get or create user
      const user = db.getOrCreateUser({
        id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        photo_url: telegramUser.photo_url
      });

      // Check if banned
      if (user.status === 'banned') {
        res.status(403).json({ error: 'Forbidden', message: 'Account suspended' });
        return;
      }

      req.user = user;
      req.telegramUser = telegramUser;
      next();
    },

    /**
     * Require admin access
     */
    requireAdmin: (req: Request, res: Response, next: NextFunction) => {
      const initData = req.headers['x-telegram-init-data'] as string || req.query.initData as string;

      if (!initData) {
        res.status(401).json({ error: 'Unauthorized', message: 'Missing authentication' });
        return;
      }

      const telegramUser = validateInitData(initData, botToken);
      if (!telegramUser) {
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid authentication' });
        return;
      }

      const user = db.getOrCreateUser({
        id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        photo_url: telegramUser.photo_url
      });

      if (!user.is_admin) {
        res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
        return;
      }

      req.user = user;
      req.telegramUser = telegramUser;
      next();
    },

    /**
     * Optional auth - doesn't fail if no initData
     */
    optionalAuth: (req: Request, _res: Response, next: NextFunction) => {
      const initData = req.headers['x-telegram-init-data'] as string || req.query.initData as string;

      if (initData) {
        const telegramUser = validateInitData(initData, botToken);
        if (telegramUser) {
          const user = db.getOrCreateUser({
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
            photo_url: telegramUser.photo_url
          });
          
          if (user.status !== 'banned') {
            req.user = user;
            req.telegramUser = telegramUser;
          }
        }
      }

      next();
    }
  };
}
