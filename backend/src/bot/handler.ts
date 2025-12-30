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
    this.webAppUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  async setupCommands(): Promise<void> {
    try {
      await this.bot.setMyCommands([
        { command: 'start', description: 'Запустить приложение' },
        { command: 'help', description: 'Показать справку' },
        { command: 'profile', description: 'Мой профиль' },
        { command: 'tasks', description: 'Мои заказы' }
      ]);
      console.log('Bot commands set successfully');
    } catch (error) {
      console.error('Failed to set bot commands:', error);
    }
  }

  async handleUpdate(update: TelegramBot.Update): Promise<void> {
    try {
      if (update.message?.text) {
        await this.handleMessage(update.message);
      }

      if (update.pre_checkout_query) {
        await this.handlePreCheckout(update.pre_checkout_query);
      }

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

    this.db.getOrCreateUser({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username
    });

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
    const welcomeText = `<b>Добро пожаловать в AVYX!</b>

Креативная платформа для дизайнеров, художников и заказчиков.

<b>Что вас ждет:</b>
- Заказы на UI/UX дизайн, логотипы, иллюстрации и графику
- Система уровней и достижений за выполненные работы
- Ежедневные творческие спринты с призами
- Безопасные сделки через встроенный эскроу
- Портфолио и рейтинг исполнителей

<b>Как начать:</b>
1. Откройте приложение по кнопке ниже
2. Заполните профиль и укажите свои навыки
3. Начните искать заказы или создайте свой

Нажмите кнопку, чтобы открыть приложение!`;

    await this.bot.sendMessage(chatId, welcomeText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: 'Открыть AVYX', web_app: { url: this.webAppUrl } }
        ]]
      }
    });
  }

  private async handleHelp(chatId: number): Promise<void> {
    const helpText = `<b>Справка по AVYX</b>

<b>Доступные команды:</b>
/start - Запустить приложение и получить приветствие
/help - Показать эту справку с описанием функций
/profile - Посмотреть свой профиль, уровень и статистику
/tasks - Список ваших активных заказов

<b>Основные возможности платформы:</b>

<b>Для дизайнеров:</b>
- Находите заказы по своей специализации
- Откликайтесь на интересные проекты
- Получайте XP и повышайте уровень
- Участвуйте в ежедневных спринтах
- Собирайте бейджи и достижения

<b>Для заказчиков:</b>
- Создавайте заказы с подробным описанием
- Выбирайте исполнителей по рейтингу и портфолио
- Безопасные сделки через эскроу
- Оставляйте отзывы о работе

<b>Геймификация:</b>
- Stars — внутренняя валюта платформы
- XP и уровни за активность
- Бейджи за достижения
- Ежедневные миссии и квесты

<b>Поддержка:</b>
Если возникли вопросы или проблемы, напишите нам: @avyx_support`;

    await this.bot.sendMessage(chatId, helpText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: 'Открыть приложение', web_app: { url: this.webAppUrl } }
        ]]
      }
    });
  }

  private async handleProfile(chatId: number, telegramId: number): Promise<void> {
    const user = this.db.getUserByTelegramId(telegramId);

    if (!user) {
      await this.bot.sendMessage(chatId, 'Профиль не найден. Откройте приложение для регистрации.', {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Открыть AVYX', web_app: { url: this.webAppUrl } }
          ]]
        }
      });
      return;
    }

    const profileText = `<b>Ваш профиль</b>

<b>Имя:</b> ${user.first_name}${user.last_name ? ' ' + user.last_name : ''}
<b>Username:</b> ${user.username ? '@' + user.username : 'не указан'}
<b>Тип:</b> ${this.getUserTypeLabel(user.type)}

<b>Статистика:</b>
Уровень: ${user.level}
XP: ${user.xp}
Stars: ${user.stars_balance}

Зарегистрирован: ${new Date(user.created_at).toLocaleDateString('ru-RU')}`;

    await this.bot.sendMessage(chatId, profileText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: 'Редактировать', web_app: { url: `${this.webAppUrl}?screen=profile` } }
        ]]
      }
    });
  }

  private async handleTasks(chatId: number, telegramId: number): Promise<void> {
    const user = this.db.getUserByTelegramId(telegramId);

    if (!user) {
      await this.bot.sendMessage(chatId, 'Сначала откройте приложение для регистрации.');
      return;
    }

    const tasks = this.db.getUserTasks(user.id, 5);

    if (tasks.length === 0) {
      await this.bot.sendMessage(chatId, 'У вас пока нет заказов.\n\nСоздайте первый заказ в приложении!', {
        reply_markup: {
          inline_keyboard: [[
            { text: 'Создать заказ', web_app: { url: `${this.webAppUrl}?screen=create` } }
          ]]
        }
      });
      return;
    }

    let tasksText = '<b>Ваши заказы:</b>\n\n';
    
    tasks.forEach((task, index) => {
      const statusLabel = this.getTaskStatusLabel(task.status);
      tasksText += `${index + 1}. [${statusLabel}] <b>${task.title}</b>\n`;
      if (task.budget_min || task.budget_max) {
        tasksText += `   Бюджет: ${task.budget_min || '?'} - ${task.budget_max || '?'} руб.\n`;
      }
      tasksText += '\n';
    });

    await this.bot.sendMessage(chatId, tasksText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[
          { text: 'Все заказы', web_app: { url: `${this.webAppUrl}?screen=tasks` } }
        ]]
      }
    });
  }

  private async handleUnknown(chatId: number): Promise<void> {
    await this.bot.sendMessage(chatId, 'Неизвестная команда.\n\nИспользуйте /help для списка доступных команд.');
  }

  private async handlePreCheckout(query: TelegramBot.PreCheckoutQuery): Promise<void> {
    await this.bot.answerPreCheckoutQuery(query.id, true);
  }

  private async handleSuccessfulPayment(message: TelegramBot.Message): Promise<void> {
    const payment = message.successful_payment;
    if (!payment || !message.from) return;

    const user = this.db.getUserByTelegramId(message.from.id);
    if (!user) return;

    const amount = payment.total_amount;
    this.db.addStars(user.id, amount);

    this.db.createPayment({
      id: crypto.randomUUID(),
      user_id: user.id,
      amount: amount,
      currency: payment.currency,
      status: 'completed',
      telegram_payment_id: payment.telegram_payment_charge_id,
      description: payment.invoice_payload
    });

    await this.bot.sendMessage(message.chat.id, `Оплата успешна!\n\n+${amount} Stars зачислено на ваш баланс.`);
  }

  private getUserTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      designer: 'Дизайнер',
      entrepreneur: 'Предприниматель',
      company: 'Компания'
    };
    return labels[type] || type;
  }

  private getTaskStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Активен',
      completed: 'Завершен',
      hidden: 'Скрыт',
      flagged: 'На модерации',
      deleted: 'Удален'
    };
    return labels[status] || status;
  }

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

  async createInvoice(chatId: number, title: string, description: string, payload: string, amount: number): Promise<string> {
    const result = await this.bot.sendInvoice(
      chatId,
      title,
      description,
      payload,
      '',
      'XTR',
      [{ label: title, amount }]
    );
    return result.message_id.toString();
  }
}
