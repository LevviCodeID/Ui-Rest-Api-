const baseUrl = 'https://api.levvicode.cloud';
let stats = { totalRequests:0, uptimeDays:0, uptimeHours:0, uptimeMinutes:0, cpuCores:0 };
let latency = 0;

function getLatencyLabel(ms) {
  if (ms === 'N/A') return 'N/A';
  if (ms < 200) return 'Sangat Baik';
  if (ms < 500) return 'Baik';
  return 'Buruk';
}

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
      const totalCat = document.getElementById('totalCategories');
      const totalEnd = document.getElementById('totalEndpoints');
      if (totalCat) totalCat.innerText = data.totalCategories;
      if (totalEnd) totalEnd.innerText = data.totalEndpoints;
    }
  } catch (err) { console.error(err); }
}

async function measureLatency() {
  const start = Date.now();
  try {
    await fetch(baseUrl + '/ping?_=' + Date.now(), { method: 'HEAD' });
    latency = Date.now() - start;
  } catch {
    latency = 'N/A';
  }
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
  if (latEl) latEl.innerText = latency !== 'N/A' ? getLatencyLabel(latency) : 'N/A';
}

function renderStats() {
  const container = document.getElementById('stats-container');
  if (!container) return;
  container.innerHTML = `
    <div class="stats-card"><i class="bi bi-hdd-stack icon"></i><h3>Total Requests</h3><div class="value" id="totalRequests">${stats.totalRequests}</div></div>
    <div class="stats-card"><i class="bi bi-clock-history icon"></i><h3>Uptime</h3><div class="value" id="uptime">${stats.uptimeDays}d ${stats.uptimeHours}h ${stats.uptimeMinutes}m</div></div>
    <div class="stats-card"><i class="bi bi-wifi icon"></i><h3>Ping</h3><div class="value" id="latency">0 ms</div></div>
    <div class="stats-card"><i class="bi bi-cpu icon"></i><h3>CPU Cores</h3><div class="value" id="cpuCores">${stats.cpuCores}</div></div>
  `;
}

function renderCategoryStats() {
  const container = document.getElementById('category-stats-container');
  if (!container) return;
  container.innerHTML = `
    <div class="col-md-6">
      <div class="card text-center p-4">
        <i class="bi bi-folder2-open fs-1" style="color: var(--accent-primary);"></i>
        <h2 class="h2" id="totalCategories">0</h2>
        <p class="text-secondary">Total Categories</p>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card text-center p-4">
        <i class="bi bi-hdd-stack fs-1" style="color: var(--accent-primary);"></i>
        <h2 class="h2" id="totalEndpoints">0</h2>
        <p class="text-secondary">Total Endpoints</p>
      </div>
    </div>
  `;
}

if (document.getElementById('stats-container')) {
  renderStats();
  renderCategoryStats();
  fetchStats();
  fetchCategoryStats();
  measureLatency();

  setInterval(() => {
    fetchStats();
    fetchCategoryStats();
  }, 10000);

  setInterval(measureLatency, 60000);
}

const themeToggle = document.getElementById('themeToggle');
const navbar = document.querySelector('.navbar-custom');
const navbarCollapse = document.querySelector('.navbar-collapse');
if (themeToggle && navbar) {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark-mode', savedTheme === 'dark');
  themeToggle.innerHTML = savedTheme === 'light' ? '<i class="bi bi-moon-fill"></i>' : '<i class="bi bi-sun-fill"></i>';
  if (savedTheme === 'dark') {
    navbar.classList.add('navbar-dark');
    navbar.classList.remove('navbar-light');
  } else {
    navbar.classList.add('navbar-light');
    navbar.classList.remove('navbar-dark');
  }
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    if (isDark) {
      navbar.classList.add('navbar-dark');
      navbar.classList.remove('navbar-light');
    } else {
      navbar.classList.add('navbar-light');
      navbar.classList.remove('navbar-dark');
    }
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
    if (bsCollapse) bsCollapse.hide();
  });
}
if (navbarCollapse) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) bsCollapse.hide();
    });
  });
}
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});