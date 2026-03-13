const baseUrl = 'https://api.levvicode.cloud';

let stats = { totalRequests:0, uptimeDays:0, uptimeHours:0, uptimeMinutes:0, cpuCores:0 };
let latency = 0;

async function fetchStats() {
  try {
    const res = await fetch(baseUrl + '/stats?_=' + Date.now());
    const data = await res.json();
    if (data.status) {
      stats = {
        totalRequests: data.stats.totalRequests,
        uptimeDays: data.stats.uptime.days,
        uptimeHours: data.stats.uptime.hours,
        uptimeMinutes: data.stats.uptime.minutes,
        cpuCores: data.stats.cpu.cores
      };
      updateDisplay();
    }
  } catch (err) { console.error(err); }
}

async function fetchCategoryStats() {
  try {
    const res = await fetch(baseUrl + '/stats/categories?_=' + Date.now());
    const data = await res.json();
    if (data.status) {
      document.getElementById('totalCategories').innerText = data.totalCategories;
      document.getElementById('totalEndpoints').innerText = data.totalEndpoints;
    }
  } catch (err) { console.error(err); }
}

async function measureLatency() {
  const start = Date.now();
  try {
    await fetch(baseUrl + '/ping?_=' + Date.now());
    latency = Date.now() - start;
  } catch { latency = 'N/A'; }
  updateDisplay();
}

function updateDisplay() {
  const reqEl = document.getElementById('totalRequests');
  if (reqEl) reqEl.innerText = stats.totalRequests;
  const uptimeEl = document.getElementById('uptime');
  if (uptimeEl) uptimeEl.innerText = `${stats.uptimeDays}d ${stats.uptimeHours}h ${stats.uptimeMinutes}m`;
  const cpuEl = document.getElementById('cpuCores');
  if (cpuEl) cpuEl.innerText = stats.cpuCores;
  const latEl = document.getElementById('latency');
  if (latEl) latEl.innerText = latency !== 'N/A' ? latency + ' ms' : 'N/A';
}

function renderStats() {
  const container = document.getElementById('stats-container');
  if (!container) return;
  container.innerHTML = `
    <div class="stats-card"><i class="bi bi-hdd-stack icon"></i><h3>Total Requests</h3><div class="value" id="totalRequests">${stats.totalRequests}</div></div>
    <div class="stats-card"><i class="bi bi-clock-history icon"></i><h3>Uptime</h3><div class="value" id="uptime">${stats.uptimeDays}d ${stats.uptimeHours}h ${stats.uptimeMinutes}m</div></div>
    <div class="stats-card"><i class="bi bi-wifi icon"></i><h3>Latency</h3><div class="value" id="latency">0 ms</div></div>
    <div class="stats-card"><i class="bi bi-cpu icon"></i><h3>CPU Cores</h3><div class="value" id="cpuCores">${stats.cpuCores}</div></div>
  `;
}

if (document.getElementById('stats-container')) {
  renderStats();
  fetchStats();
  fetchCategoryStats();
  measureLatency();
  setInterval(() => {
    fetchStats();
    fetchCategoryStats();
    measureLatency();
  }, 3000);
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark-mode', currentTheme === 'dark');
  themeToggle.innerHTML = currentTheme === 'light' ? '<i class="bi bi-moon-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
  });
}