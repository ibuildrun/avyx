import { Router } from 'express';
import type { Database } from '../db/database.js';
import { createAuthMiddleware } from '../auth/middleware.js';

export function createAdminRouter(db: Database): Router {
  const router = Router();
  const auth = createAuthMiddleware(db);

  // Serve admin panel HTML
  router.get('/', (_req, res) => {
    res.send(getAdminHtml());
  });

  // ==================== Admin API ====================

  // Get stats
  router.get('/api/stats', auth.requireAdmin, (_req, res) => {
    const stats = db.getStats();
    res.json(stats);
  });

  // Get pending reports
  router.get('/api/reports', auth.requireAdmin, (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const reports = db.getPendingReports(limit);
    res.json({ reports });
  });

  // Process report
  router.put('/api/reports/:id', auth.requireAdmin, (req, res) => {
    const { action, reason } = req.body;
    const report = db.getReportById(req.params.id);

    if (!report) {
      res.status(404).json({ error: 'NotFound', message: 'Report not found' });
      return;
    }

    if (!['dismiss', 'warn_user', 'hide_content', 'ban_user'].includes(action)) {
      res.status(400).json({ error: 'BadRequest', message: 'Invalid action' });
      return;
    }

    const adminId = req.user!.id;

    switch (action) {
      case 'dismiss':
        db.processReport(req.params.id, 'dismissed', adminId);
        break;

      case 'warn_user': {
        // Get content owner and warn them
        if (report.content_type === 'task') {
          const task = db.getTaskById(report.content_id);
          if (task) {
            db.updateUserStatus(task.creator_id, 'warned', adminId, reason);
          }
        }
        db.processReport(req.params.id, 'reviewed', adminId);
        break;
      }

      case 'hide_content':
        db.hideContent(report.content_type, report.content_id, adminId, reason);
        db.processReport(req.params.id, 'reviewed', adminId);
        break;

      case 'ban_user': {
        if (report.content_type === 'task') {
          const task = db.getTaskById(report.content_id);
          if (task) {
            db.updateUserStatus(task.creator_id, 'banned', adminId, reason);
          }
        } else if (report.content_type === 'user') {
          db.updateUserStatus(parseInt(report.content_id), 'banned', adminId, reason);
        }
        db.processReport(req.params.id, 'reviewed', adminId);
        break;
      }
    }

    res.json({ success: true });
  });

  // Get users
  router.get('/api/users', auth.requireAdmin, (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const users = db.getUsers(limit, offset);
    res.json({ users });
  });

  // Update user status
  router.put('/api/users/:id', auth.requireAdmin, (req, res) => {
    const { status, reason } = req.body;
    const userId = parseInt(req.params.id);
    const user = db.getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'NotFound', message: 'User not found' });
      return;
    }

    if (!['active', 'warned', 'banned'].includes(status)) {
      res.status(400).json({ error: 'BadRequest', message: 'Invalid status' });
      return;
    }

    db.updateUserStatus(userId, status, req.user!.id, reason);
    res.json({ success: true });
  });

  // Get moderation logs
  router.get('/api/logs', auth.requireAdmin, (_req, res) => {
    const logs = db.getModerationLogs();
    res.json({ logs });
  });

  return router;
}

function getAdminHtml(): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AVYX Admin</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-100 min-h-screen">
  <div id="app" class="max-w-4xl mx-auto p-4">
    <div id="auth-required" class="text-center py-20">
      <h1 class="text-2xl font-bold mb-4">🔐 AVYX Admin Panel</h1>
      <p class="text-gray-600 mb-4">Откройте эту страницу через Telegram Web App</p>
      <button onclick="initTelegram()" class="bg-blue-500 text-white px-6 py-2 rounded-lg">
        Авторизоваться
      </button>
    </div>

    <div id="admin-panel" class="hidden">
      <header class="bg-white rounded-lg shadow p-4 mb-4">
        <h1 class="text-xl font-bold">🛡️ AVYX Admin Panel</h1>
        <p class="text-gray-500 text-sm" id="admin-name"></p>
      </header>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-4 mb-4">
        <div class="bg-white rounded-lg shadow p-4 text-center">
          <div class="text-2xl font-bold text-blue-500" id="stat-users">-</div>
          <div class="text-gray-500 text-sm">Пользователей</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 text-center">
          <div class="text-2xl font-bold text-green-500" id="stat-tasks">-</div>
          <div class="text-gray-500 text-sm">Заказов</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 text-center">
          <div class="text-2xl font-bold text-red-500" id="stat-reports">-</div>
          <div class="text-gray-500 text-sm">Жалоб</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 text-center">
          <div class="text-2xl font-bold text-purple-500" id="stat-payments">-</div>
          <div class="text-gray-500 text-sm">Платежей</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow mb-4">
        <div class="flex border-b">
          <button onclick="showTab('reports')" class="tab-btn px-4 py-2 font-medium" data-tab="reports">
            🚨 Жалобы
          </button>
          <button onclick="showTab('users')" class="tab-btn px-4 py-2 font-medium" data-tab="users">
            👥 Пользователи
          </button>
          <button onclick="showTab('logs')" class="tab-btn px-4 py-2 font-medium" data-tab="logs">
            📋 Логи
          </button>
        </div>

        <div id="tab-reports" class="tab-content p-4">
          <div id="reports-list"></div>
        </div>

        <div id="tab-users" class="tab-content p-4 hidden">
          <div id="users-list"></div>
        </div>

        <div id="tab-logs" class="tab-content p-4 hidden">
          <div id="logs-list"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let initData = '';
    
    function initTelegram() {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        initData = window.Telegram.WebApp.initData;
        if (initData) {
          loadAdmin();
        }
      }
    }

    async function api(endpoint, options = {}) {
      const res = await fetch('/admin/api' + endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData,
          ...options.headers
        }
      });
      if (!res.ok) throw new Error('API Error');
      return res.json();
    }

    async function loadAdmin() {
      try {
        const stats = await api('/stats');
        document.getElementById('auth-required').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        
        document.getElementById('stat-users').textContent = stats.users;
        document.getElementById('stat-tasks').textContent = stats.tasks;
        document.getElementById('stat-reports').textContent = stats.reports;
        document.getElementById('stat-payments').textContent = stats.payments;

        loadReports();
      } catch (e) {
        alert('Доступ запрещён. Вы не администратор.');
      }
    }

    async function loadReports() {
      const { reports } = await api('/reports');
      const html = reports.length ? reports.map(r => \`
        <div class="border rounded p-3 mb-2">
          <div class="flex justify-between">
            <span class="font-medium">\${r.content_type}: \${r.content_id}</span>
            <span class="text-sm text-gray-500">\${new Date(r.created_at).toLocaleString('ru')}</span>
          </div>
          <div class="text-sm text-red-500">Причина: \${r.reason}</div>
          \${r.description ? '<div class="text-sm text-gray-600">' + r.description + '</div>' : ''}
          <div class="mt-2 flex gap-2">
            <button onclick="processReport('\${r.id}', 'dismiss')" class="text-xs bg-gray-200 px-2 py-1 rounded">Отклонить</button>
            <button onclick="processReport('\${r.id}', 'warn_user')" class="text-xs bg-yellow-200 px-2 py-1 rounded">Предупредить</button>
            <button onclick="processReport('\${r.id}', 'hide_content')" class="text-xs bg-orange-200 px-2 py-1 rounded">Скрыть</button>
            <button onclick="processReport('\${r.id}', 'ban_user')" class="text-xs bg-red-200 px-2 py-1 rounded">Забанить</button>
          </div>
        </div>
      \`).join('') : '<p class="text-gray-500">Нет жалоб</p>';
      document.getElementById('reports-list').innerHTML = html;
    }

    async function loadUsers() {
      const { users } = await api('/users');
      const html = users.map(u => \`
        <div class="border rounded p-3 mb-2 flex justify-between items-center">
          <div>
            <span class="font-medium">\${u.first_name} \${u.last_name || ''}</span>
            <span class="text-gray-500">@\${u.username || 'unknown'}</span>
            <span class="text-xs ml-2 px-2 py-0.5 rounded \${u.status === 'banned' ? 'bg-red-100 text-red-600' : u.status === 'warned' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}">\${u.status}</span>
          </div>
          <div class="flex gap-2">
            <button onclick="updateUser(\${u.id}, 'active')" class="text-xs bg-green-200 px-2 py-1 rounded">Активен</button>
            <button onclick="updateUser(\${u.id}, 'warned')" class="text-xs bg-yellow-200 px-2 py-1 rounded">Предупредить</button>
            <button onclick="updateUser(\${u.id}, 'banned')" class="text-xs bg-red-200 px-2 py-1 rounded">Забанить</button>
          </div>
        </div>
      \`).join('');
      document.getElementById('users-list').innerHTML = html;
    }

    async function loadLogs() {
      const { logs } = await api('/logs');
      const html = logs.length ? logs.map(l => \`
        <div class="border rounded p-2 mb-1 text-sm">
          <span class="text-gray-500">\${new Date(l.created_at).toLocaleString('ru')}</span>
          <span class="font-medium ml-2">\${l.action}</span>
          <span class="text-gray-600">→ \${l.target_type}:\${l.target_id}</span>
          \${l.reason ? '<span class="text-gray-500 ml-2">(' + l.reason + ')</span>' : ''}
        </div>
      \`).join('') : '<p class="text-gray-500">Нет логов</p>';
      document.getElementById('logs-list').innerHTML = html;
    }

    async function processReport(id, action) {
      const reason = action !== 'dismiss' ? prompt('Причина (опционально):') : null;
      await api('/reports/' + id, {
        method: 'PUT',
        body: JSON.stringify({ action, reason })
      });
      loadReports();
      loadAdmin();
    }

    async function updateUser(id, status) {
      const reason = status !== 'active' ? prompt('Причина:') : null;
      await api('/users/' + id, {
        method: 'PUT',
        body: JSON.stringify({ status, reason })
      });
      loadUsers();
    }

    function showTab(tab) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('border-b-2', 'border-blue-500'));
      document.getElementById('tab-' + tab).classList.remove('hidden');
      document.querySelector('[data-tab="' + tab + '"]').classList.add('border-b-2', 'border-blue-500');
      
      if (tab === 'users') loadUsers();
      if (tab === 'logs') loadLogs();
      if (tab === 'reports') loadReports();
    }

    // Auto-init
    initTelegram();
    showTab('reports');
  </script>
</body>
</html>`;
}
