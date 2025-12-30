import 'dotenv/config';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function callApi(method: string, params: Record<string, unknown> = {}) {
  const response = await fetch(`${API_URL}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await response.json();
  if (!data.ok) {
    throw new Error(`API Error: ${data.description}`);
  }
  return data.result;
}

async function setupBot() {
  console.log('Setting up AVYX bot...\n');

  // 1. Get bot info
  const me = await callApi('getMe');
  console.log(`Bot: @${me.username} (ID: ${me.id})`);

  // 2. Set bot name
  try {
    await callApi('setMyName', { name: 'AVYX — Маркетплейс для дизайнеров' });
    console.log('Name set');
  } catch (e) {
    console.log('Name: skipped (may require BotFather)');
  }

  // 3. Set bot description (shown in profile when user opens bot)
  await callApi('setMyDescription', {
    description: `AVYX — креативная платформа для дизайнеров, художников и заказчиков.

Здесь вы найдете:
- Заказы на UI/UX дизайн, логотипы, иллюстрации и графику
- Систему уровней и достижений за выполненные работы
- Ежедневные творческие спринты с призами
- Безопасные сделки через встроенный эскроу
- Портфолио и рейтинг исполнителей

Присоединяйтесь к сообществу креативных профессионалов!`
  });
  console.log('Description set');

  // 4. Set short description (shown in chat list and search)
  await callApi('setMyShortDescription', {
    short_description: 'Креативный маркетплейс для дизайнеров и художников с геймификацией, спринтами и безопасными сделками'
  });
  console.log('Short description set');

  // 5. Set commands
  await callApi('setMyCommands', {
    commands: [
      { command: 'start', description: 'Запустить приложение' },
      { command: 'help', description: 'Показать справку' },
      { command: 'profile', description: 'Мой профиль' },
      { command: 'tasks', description: 'Мои заказы' }
    ]
  });
  console.log('Commands set');

  // 6. Set menu button (Web App)
  const webAppUrl = process.env.FRONTEND_URL || 'https://avyx.app';
  try {
    await callApi('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: 'Открыть AVYX',
        web_app: { url: webAppUrl }
      }
    });
    console.log(`Menu button set: ${webAppUrl}`);
  } catch (e) {
    console.log(`Menu button: skipped (requires HTTPS URL, current: ${webAppUrl})`);
  }

  console.log('\nBot setup complete!');
  console.log(`\nTo set profile photo, use BotFather or upload via API with setMyProfilePhoto`);
}

setupBot().catch(console.error);
