import TelegramBot from 'node-telegram-bot-api';
import type { Database } from '../db/database.js';

export class BotHandler {
  private bot: TelegramBot;
  private db: Database;
  private webAppUrl: string;

  constructor(db: Database) {
    const token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.bot = new TelegramBot(token);
    this.db = db;
    this.webAppUrl = process.env.FRONTEND_URL || 'https://4n395k-178-208-232-210.ru.tuna.am';
  }

  async handleUpdate(update: TelegramBot.Update): Promise<void> {
    try {
      // Handle commands
      if (update.message?.text) {
        await this.handleMessage(update.message);
      }

      // Handle pre-checkout query (Telegram Stars)
      if (update.pre_checkout_query) {
        await this.handlePreCheckout(update.pre_checkout_query);
      }

      // Handle successful payment
      if (update.message?.successful_payment) {
        await this.handleSuccessfulPayment(update.message);
      }
    } catch (error) {
      console.error('Bot update error:', error);
    }
  }

  private async handleMessage(message: TelegramBot.Message): Promise<void> {
    const chatId = message.chat.id;
    const text = message.text || '';
    const user = message.from;

    if (!user) return;

    // Ensure user exists in DB
    this.db.getOrCreateUser({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username
    });

    // Handle commands
    if (text.startsWith('/start')) {
      await this.handleStart(chatId);
    } else if (text.startsWith('/help')) {
      await this.handleHelp(chatId);
    } else if (text.startsWith('/profile')) {
      await this.handleProfile(chatId, user.id);
    } else if (text.startsWith('/tasks')) {
      await this.handleTasks(chatId, user.id);
    } else if (text.startsWith('/')) {
      await this.handleUnknown(chatId);
    }
  }

  private async handleStart(chatId: number): Promise<void> {
    const welcomeText = `🎨 <b>Добро пожаловать в AVYX!</b>

Маркетплейс для дизайнеров и художников с геймификацией.

✨ Находи заказы на UI/UX, логотипы, иллюстрации
🎮 Зарабатывай XP и повышай уровень
⚡ Участвуй в ежедневных спринтах
🛡️ Безопасные сделки через эскроу

Нажми кнопку ниже, чтобы открыть приложение!`;

    await this.bot.sendMessage(chatId, welcomeText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Открыть AVYX', web_app: { url: this.webAppUrl } }
        ]]
      }
    });
  }

  private async handleHelp(chatId: number): Promise<void> {
    const helpText = `❓ <b>Помощь AVYX</b>

<b>Доступные команды:</b>
/start — Запустить приложение
/help — Показать эту справку
/profile — Мой профиль
/tasks — Мои заказы

<b>Как пользоваться:</b>
1. Откройте приложение через кнопку меню
2. Заполните профиль
3. Ищите заказы или создавайте свои
4. Выполняйте миссии и получайте награды

<b>Поддержка:</b>
Если у вас возникли проблемы, напишите нам: @avyx_support`;

    await this.bot.sendMessage(chatId, helpText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: '📱 Открыть приложение', web_app: { url: this.webAppUrl } }
        ]]
      }
    });
  }

  private async handleProfile(chatId: number, telegramId: number): Promise<void> {
    const user = this.db.getUserByTelegramId(telegramId);

    if (!user) {
      await this.bot.sendMessage(chatId, '❌ Профиль не найден. Откройте приложение для регистрации.', {
        reply_markup: {
          inline_keyboard: [[
            { text: '📱 Открыть AVYX', web_app: { url: this.webAppUrl } }
          ]]
        }
      });
      return;
    }

    const profileText = `👤 <b>Ваш профиль</b>

<b>Имя:</b> ${user.first_name}${user.last_name ? ' ' + user.last_name : ''}
<b>Username:</b> ${user.username ? '@' + user.username : 'не указан'}
<b>Тип:</b> ${this.getUserTypeLabel(user.type)}

📊 <b>Статистика:</b>
⭐ Уровень: ${user.level}
✨ XP: ${user.xp}
💫 Stars: ${user.stars_balance}

📅 Зарегистрирован: ${new Date(user.created_at).toLocaleDateString('ru-RU')}`;

    await this.bot.sendMessage(chatId, profileText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: '✏️ Редактировать', web_app: { url: `${this.webAppUrl}?screen=profile` } }
        ]]
      }
    });
  }

  private async handleTasks(chatId: number, telegramId: number): Promise<void> {
    const user = this.db.getUserByTelegramId(telegramId);

    if (!user) {
      await this.bot.sendMessage(chatId, '❌ Сначала откройте приложение для регистрации.');
      return;
    }

    const tasks = this.db.getUserTasks(user.id, 5);

    if (tasks.length === 0) {
      await this.bot.sendMessage(chatId, '📋 У вас пока нет заказов.\n\nСоздайте первый заказ в приложении!', {
        reply_markup: {
          inline_keyboard: [[
            { text: '➕ Создать заказ', web_app: { url: `${this.webAppUrl}?screen=create` } }
          ]]
        }
      });
      return;
    }

    let tasksText = '📋 <b>Ваши заказы:</b>\n\n';
    
    tasks.forEach((task, index) => {
      const statusEmoji = this.getTaskStatusEmoji(task.status);
      tasksText += `${index + 1}. ${statusEmoji} <b>${task.title}</b>\n`;
      if (task.budget_min || task.budget_max) {
        tasksText += `   💰 ${task.budget_min || '?'} - ${task.budget_max || '?'} ₽\n`;
      }
      tasksText += '\n';
    });

    await this.bot.sendMessage(chatId, tasksText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: '📱 Все заказы', web_app: { url: `${this.webAppUrl}?screen=tasks` } }
        ]]
      }
    });
  }

  private async handleUnknown(chatId: number): Promise<void> {
    await this.bot.sendMessage(chatId, '❓ Неизвестная команда.\n\nИспользуйте /help для списка доступных команд.');
  }

  private async handlePreCheckout(query: TelegramBot.PreCheckoutQuery): Promise<void> {
    // Always approve for MVP (add validation logic later)
    await this.bot.answerPreCheckoutQuery(query.id, true);
  }

  private async handleSuccessfulPayment(message: TelegramBot.Message): Promise<void> {
    const payment = message.successful_payment;
    if (!payment || !message.from) return;

    const user = this.db.getUserByTelegramId(message.from.id);
    if (!user) return;

    // Credit stars to user
    const amount = payment.total_amount; // In smallest units
    this.db.addStars(user.id, amount);

    // Create payment record
    this.db.createPayment({
      id: crypto.randomUUID(),
      user_id: user.id,
      amount: amount,
      currency: payment.currency,
      status: 'completed',
      telegram_payment_id: payment.telegram_payment_charge_id,
      description: payment.invoice_payload
    });

    await this.bot.sendMessage(message.chat.id, `✅ Оплата успешна!\n\n💫 +${amount} Stars зачислено на ваш баланс.`);
  }

  // Helper methods
  private getUserTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      designer: '🎨 Дизайнер',
      entrepreneur: '💼 Предприниматель',
      company: '🏢 Компания'
    };
    return labels[type] || type;
  }

  private getTaskStatusEmoji(status: string): string {
    const emojis: Record<string, string> = {
      active: '🟢',
      completed: '✅',
      hidden: '🔒',
      flagged: '⚠️',
      deleted: '❌'
    };
    return emojis[status] || '⚪';
  }

  // Public methods for sending messages
  async sendMessage(chatId: number, text: string, options?: TelegramBot.SendMessageOptions): Promise<void> {
    await this.bot.sendMessage(chatId, text, options);
  }

  async notifyAdmins(text: string): Promise<void> {
    const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim())).filter(Boolean);
    
    for (const adminId of adminIds) {
      try {
        await this.bot.sendMessage(adminId, text, { parse_mode: 'HTML' });
      } catch (error) {
        console.error(`Failed to notify admin ${adminId}:`, error);
      }
    }
  }

  // Create invoice for Telegram Stars
  async createInvoice(chatId: number, title: string, description: string, payload: string, amount: number): Promise<string> {
    const result = await this.bot.sendInvoice(
      chatId,
      title,
      description,
      payload,
      '', // provider_token empty for Telegram Stars
      'XTR', // Telegram Stars currency
      [{ label: title, amount }]
    );
    return result.message_id.toString();
  }
}
