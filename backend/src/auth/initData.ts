import crypto from 'crypto';
import type { InitDataUser } from '../types.js';

interface ParsedInitData {
  user?: InitDataUser;
  auth_date: number;
  hash: string;
  query_id?: string;
  [key: string]: unknown;
}

/**
 * Validate Telegram Web App initData
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateInitData(initData: string, botToken: string): InitDataUser | null {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) return null;

    // Remove hash from params and sort
    params.delete('hash');
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return null;
    }

    // Check auth_date (not older than 24 hours)
    const authDate = parseInt(params.get('auth_date') || '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return null;
    }

    // Parse user data
    const userStr = params.get('user');
    if (!userStr) return null;

    const user = JSON.parse(userStr) as InitDataUser;
    return user;
  } catch {
    return null;
  }
}

/**
 * Parse initData without validation (for testing)
 */
export function parseInitData(initData: string): ParsedInitData | null {
  try {
    const params = new URLSearchParams(initData);
    const result: ParsedInitData = {
      auth_date: parseInt(params.get('auth_date') || '0'),
      hash: params.get('hash') || ''
    };

    const userStr = params.get('user');
    if (userStr) {
      result.user = JSON.parse(userStr);
    }

    const queryId = params.get('query_id');
    if (queryId) {
      result.query_id = queryId;
    }

    return result;
  } catch {
    return null;
  }
}

/**
 * Generate test initData (for development only)
 */
export function generateTestInitData(user: InitDataUser, botToken: string): string {
  const authDate = Math.floor(Date.now() / 1000);
  const params = new URLSearchParams();
  
  params.set('user', JSON.stringify(user));
  params.set('auth_date', authDate.toString());

  // Sort and create data check string
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Create hash
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  params.set('hash', hash);
  return params.toString();
}
