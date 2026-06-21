const pageLinks = document.querySelectorAll("[data-page-link]");
const pages = document.querySelectorAll(".page");
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const systemCards = document.getElementById("systemCards");
const environmentTable = document.getElementById("environmentTable");
const envSearch = document.getElementById("envSearch");
const envFilter = document.getElementById("envFilter");
const envSort = document.getElementById("envSort");
const fileForm = document.getElementById("fileForm");
const fileId = document.getElementById("fileId");
const filename = document.getElementById("filename");
const fileContent = document.getElementById("fileContent");
const formTitle = document.getElementById("formTitle");
const resetForm = document.getElementById("resetForm");
const createFileButton = document.getElementById("createFileButton");
const fileList = document.getElementById("fileList");
const refreshSystem = document.getElementById("refreshSystem");
const copySnapshot = document.getElementById("copySnapshot");
const generateReport = document.getElementById("generateReport");
const copyReport = document.getElementById("copyReport");
const downloadReport = document.getElementById("downloadReport");
const reportPreview = document.getElementById("reportPreview");
const healthSummary = document.getElementById("healthSummary");
const scoreRing = document.getElementById("scoreRing");
const healthScore = document.getElementById("healthScore");
const capabilityList = document.getElementById("capabilityList");
const docsGrid = document.getElementById("docsGrid");
const toastStack = document.getElementById("toastStack");
const loader = document.getElementById("loader");
const typedTerminal = document.getElementById("typedTerminal");
const particleCanvas = document.getElementById("particleCanvas");

const storageKey = "system-inspector-files";
let currentSortDirection = "asc";
let latestReport = null;
let currentSystemInfo = [];
let currentEnvironmentVariables = [];
let currentSystemSnapshot = {};
let currentCapabilityItems = [];

window.addEventListener("error", () => {
  showToast("An unexpected browser error was handled");
});

window.addEventListener("unhandledrejection", () => {
  showToast("An async operation failed safely");
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await refreshCurrentSystemInfo();
    renderSystemCards();
    renderEnvironmentTable();
    renderFiles();
    renderDocs();
    typeTerminalText();
    setupParticles();
    bindEvents();
    navigateTo(location.hash.replace("#", "") || "home");

    setTimeout(() => {
      loader.classList.add("hidden");
      showToast("Current system information loaded");
    }, 700);
  } catch (error) {
    loader.classList.add("hidden");
    showToast("Dashboard recovered from a startup error");
    renderFallbackState();
    setupParticles();
    bindEvents();
    navigateTo(location.hash.replace("#", "") || "home");
  }
});

function bindEvents() {
  pageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigateTo(link.dataset.pageLink);
    });
  });

  navToggle.addEventListener("click", () => nav.classList.toggle("open"));
  envSearch.addEventListener("input", renderEnvironmentTable);
  envFilter.addEventListener("change", renderEnvironmentTable);
  envSort.addEventListener("click", toggleEnvironmentSort);
  fileForm.addEventListener("submit", saveFile);
  resetForm.addEventListener("click", clearFileForm);
  createFileButton.addEventListener("click", () => {
    clearFileForm();
    filename.focus();
  });
  refreshSystem.addEventListener("click", refreshDashboardScan);
  copySnapshot.addEventListener("click", copyCurrentSnapshot);
  generateReport.addEventListener("click", createReport);
  copyReport.addEventListener("click", copyJsonReport);
  downloadReport.addEventListener("click", downloadJsonReport);
  window.addEventListener("hashchange", () => navigateTo(location.hash.replace("#", "") || "home"));
}

function navigateTo(pageId) {
  const targetId = document.getElementById(pageId) ? pageId : "home";

  pages.forEach((page) => page.classList.toggle("active", page.id === targetId));
  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === targetId);
  });

  nav.classList.remove("open");
  try {
    history.replaceState(null, "", `#${targetId}`);
  } catch (error) {
    location.hash = targetId;
  }

  if (targetId === "dashboard") {
    animateCounters();
  }
}

function renderSystemCards() {
  systemCards.innerHTML = currentSystemInfo.map((card, index) => `
    <article class="system-card glass-panel" style="--delay: ${index * 80}ms">
      <div class="card-icon">${escapeHtml(card.icon)}</div>
      <h3>${escapeHtml(card.title)}</h3>
      <dl>
        ${card.details.map((item) => `
          <div>
            <dt>${escapeHtml(item.label)}</dt>
            <dd>${escapeHtml(String(item.value))}</dd>
          </div>
        `).join("")}
      </dl>
    </article>
  `).join("");
}

function renderEnvironmentTable() {
  const searchTerm = envSearch.value.toLowerCase();
  const filterValue = envFilter.value;
  const sortedVariables = [...currentEnvironmentVariables].sort((a, b) => {
    const order = a.name.localeCompare(b.name);
    return currentSortDirection === "asc" ? order : -order;
  });

  const visibleVariables = sortedVariables.filter((variable) => {
    const matchesSearch = `${variable.name} ${variable.value}`.toLowerCase().includes(searchTerm);
    const matchesFilter = filterValue === "all" || variable.type === filterValue;
    return matchesSearch && matchesFilter;
  });

  environmentTable.innerHTML = visibleVariables.length
    ? visibleVariables.map((variable) => `
      <tr>
        <td>${escapeHtml(variable.name)}</td>
        <td>${escapeHtml(String(variable.value))}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="2">No variables match your search.</td></tr>`;
}

function toggleEnvironmentSort() {
  currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
  envSort.textContent = currentSortDirection === "asc" ? "Sort A-Z" : "Sort Z-A";
  renderEnvironmentTable();
  showToast(`Environment variables sorted ${currentSortDirection === "asc" ? "A-Z" : "Z-A"}`);
}

function getFiles() {
  try {
    const savedFiles = localStorage.getItem(storageKey);

    if (!savedFiles) {
      localStorage.setItem(storageKey, JSON.stringify(starterFiles));
      return [...starterFiles];
    }

    const parsedFiles = JSON.parse(savedFiles);
    return Array.isArray(parsedFiles) ? parsedFiles : [...starterFiles];
  } catch (error) {
    showToast("LocalStorage is unavailable, using temporary files");
    return [...starterFiles];
  }
}

function setFiles(files) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(files));
    return true;
  } catch (error) {
    showToast("Could not save files in this browser");
    return false;
  }
}

function renderFiles() {
  const files = getFiles();

  fileList.innerHTML = files.map((file) => `
    <article class="file-card glass-panel">
      <div>
        <h3>${escapeHtml(file.name)}</h3>
        <pre>${escapeHtml(file.content)}</pre>
      </div>
      <div class="file-actions">
        <button class="secondary-button" type="button" data-action="edit" data-id="${escapeHtml(file.id)}">Edit</button>
        <button class="danger-button" type="button" data-action="delete" data-id="${escapeHtml(file.id)}">Delete</button>
      </div>
    </article>
  `).join("");

  fileList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "edit") {
        editFile(button.dataset.id);
      } else {
        deleteFile(button.dataset.id);
      }
    });
  });
}

function saveFile(event) {
  event.preventDefault();

  const files = getFiles();
  const trimmedName = filename.value.trim();
  const trimmedContent = fileContent.value.trim();

  if (!trimmedName || !trimmedContent) {
    showToast("Add both filename and content");
    return;
  }

  if (fileId.value) {
    const updatedFiles = files.map((file) => file.id === fileId.value
      ? { ...file, name: trimmedName, content: trimmedContent }
      : file);
    if (setFiles(updatedFiles)) {
      showToast("File updated");
    }
  } else {
    files.unshift({
      id: `file-${Date.now()}`,
      name: trimmedName,
      content: trimmedContent
    });
    if (setFiles(files)) {
      showToast("New file created");
    }
  }

  clearFileForm();
  renderFiles();
}

function editFile(id) {
  const file = getFiles().find((item) => item.id === id);

  if (!file) return;

  fileId.value = file.id;
  filename.value = file.name;
  fileContent.value = file.content;
  formTitle.textContent = "Update File";
  filename.focus();
}

function deleteFile(id) {
  const updatedFiles = getFiles().filter((file) => file.id !== id);
  if (setFiles(updatedFiles)) {
    renderFiles();
    showToast("File deleted");
  }
}

function clearFileForm() {
  fileId.value = "";
  filename.value = "";
  fileContent.value = "";
  formTitle.textContent = "Create New File";
}

function createReport() {
  try {
    latestReport = {
      system: currentSystemSnapshot.osName,
      platform: currentSystemSnapshot.platform,
      architecture: currentSystemSnapshot.architecture,
      cpuCores: currentSystemSnapshot.cpuCores,
      memory: currentSystemSnapshot.memory,
      battery: currentSystemSnapshot.battery,
      connection: currentSystemSnapshot.connection,
      permissions: currentSystemSnapshot.permissions,
      node: currentSystemSnapshot.nodeVersion,
      hostname: currentSystemSnapshot.hostname,
      browser: currentSystemSnapshot.browser,
      language: currentSystemSnapshot.language,
      timeZone: currentSystemSnapshot.timeZone,
      files: getFiles().length,
      generatedAt: new Date().toISOString()
    };

    reportPreview.textContent = JSON.stringify(latestReport, null, 2);
    copyReport.disabled = false;
    downloadReport.disabled = false;
    showToast("Report generated");
  } catch (error) {
    showToast("Report generation failed safely");
  }
}

async function copyJsonReport() {
  if (!latestReport) return;

  await copyText(JSON.stringify(latestReport, null, 2), "Report JSON copied");
}

function downloadJsonReport() {
  if (!latestReport) return;

  try {
    const blob = new Blob([JSON.stringify(latestReport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "system-inspector-report.json";
    link.click();
    URL.revokeObjectURL(url);
    showToast("JSON download started");
  } catch (error) {
    showToast("Download is blocked in this browser");
  }
}

function renderDocs() {
  docsGrid.innerHTML = documentationItems.map((item) => `
    <article class="doc-card glass-panel">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </article>
  `).join("");
}

function animateCounters() {
  document.querySelectorAll(".counter").forEach((counter) => {
    const target = Number(counter.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = current;
      }
    }, 25);
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastStack.appendChild(toast);

  setTimeout(() => toast.remove(), 2800);
}

function typeTerminalText() {
  const text = [
    "$ inspect system --summary",
    `OS: ${currentSystemSnapshot.osName}`,
    `Platform: ${currentSystemSnapshot.platform}`,
    `Architecture: ${currentSystemSnapshot.architecture}`,
    `CPU cores: ${currentSystemSnapshot.cpuCores}`,
    "Files: localStorage synced"
  ].join("\n");

  let index = 0;
  const timer = setInterval(() => {
    typedTerminal.textContent = text.slice(0, index);
    index += 1;
    if (index > text.length) clearInterval(timer);
  }, 28);
}

function setupParticles() {
  const context = particleCanvas.getContext("2d");
  if (!context) return;

  const particles = Array.from({ length: 70 }, () => createParticle());

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function draw() {
    context.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > particleCanvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > particleCanvas.height) particle.speedY *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = particle.color;
      context.fill();
    });

    requestAnimationFrame(draw);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  draw();
}

function createParticle() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2.8 + 0.7,
    speedX: (Math.random() - 0.5) * 0.45,
    speedY: (Math.random() - 0.5) * 0.45,
    color: Math.random() > 0.5 ? "rgba(66, 211, 255, 0.45)" : "rgba(89, 255, 181, 0.38)"
  };
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

async function refreshCurrentSystemInfo() {
  try {
    currentSystemSnapshot = await collectBrowserSystemInfo();
  } catch (error) {
    currentSystemSnapshot = createUnavailableSystemSnapshot();
    showToast("Some system APIs are unavailable");
  }

  currentSystemInfo = buildSystemCards(currentSystemSnapshot);
  currentEnvironmentVariables = buildRuntimeVariables(currentSystemSnapshot);
  currentCapabilityItems = buildCapabilityItems(currentSystemSnapshot);
  updateMetricCounters(currentSystemSnapshot);
  renderHealthPanel(currentSystemSnapshot);
  renderCapabilityList();
}

async function collectBrowserSystemInfo() {
  const userAgent = safeRead(() => navigator.userAgent, "Unavailable");
  const userAgentData = navigator.userAgentData;
  let highEntropyValues = {};

  if (userAgentData && userAgentData.getHighEntropyValues) {
    try {
      highEntropyValues = await userAgentData.getHighEntropyValues([
        "architecture",
        "bitness",
        "model",
        "platform",
        "platformVersion",
        "uaFullVersion"
      ]);
    } catch (error) {
      highEntropyValues = {};
    }
  }

  const platform = highEntropyValues.platform || userAgentData?.platform || safeRead(() => navigator.platform, "Unavailable");
  const architecture = formatArchitecture(highEntropyValues.architecture, highEntropyValues.bitness, userAgent);
  const memory = safeRead(
    () => navigator.deviceMemory ? `${navigator.deviceMemory} GB approximate` : "Unavailable in this browser",
    "Unavailable in this browser"
  );
  const battery = await getBatteryInfo();
  const permissions = await getPermissionStates();
  const storage = await getStorageInfo();

  return {
    osName: detectOperatingSystem(platform, userAgent),
    platform,
    architecture,
    browser: detectBrowser(userAgent),
    browserVersion: highEntropyValues.uaFullVersion || "Unavailable",
    cpuCores: safeRead(() => navigator.hardwareConcurrency, "Unavailable") || "Unavailable",
    processor: "Exact processor model is blocked by browser security",
    memory,
    jsHeapLimit: getHeapLimit(),
    nodeVersion: "Not available in browser-only apps",
    hostname: "Blocked by browser security",
    battery,
    connection: getConnectionInfo(),
    permissions,
    storage,
    language: safeRead(() => navigator.language, "Unavailable") || "Unavailable",
    languages: safeRead(() => navigator.languages.join(", "), "Unavailable"),
    online: safeRead(() => navigator.onLine, false) ? "Online" : "Offline",
    timeZone: safeRead(() => Intl.DateTimeFormat().resolvedOptions().timeZone, "Unavailable") || "Unavailable",
    screen: safeRead(() => `${window.screen.width} x ${window.screen.height}`, "Unavailable"),
    viewport: safeRead(() => `${window.innerWidth} x ${window.innerHeight}`, "Unavailable"),
    colorDepth: safeRead(() => `${window.screen.colorDepth} bit`, "Unavailable"),
    cookies: safeRead(() => navigator.cookieEnabled, false) ? "Enabled" : "Disabled",
    doNotTrack: safeRead(() => navigator.doNotTrack, "Unavailable") || "Unavailable",
    userAgent
  };
}

function buildSystemCards(snapshot) {
  return [
    {
      title: "Operating System",
      icon: "OS",
      details: [
        { label: "OS Name", value: snapshot.osName },
        { label: "Platform", value: snapshot.platform },
        { label: "Architecture", value: snapshot.architecture }
      ]
    },
    {
      title: "CPU",
      icon: "CPU",
      details: [
        { label: "Processor", value: snapshot.processor },
        { label: "Logical Cores", value: snapshot.cpuCores }
      ]
    },
    {
      title: "Memory",
      icon: "RAM",
      details: [
        { label: "Device Memory", value: snapshot.memory },
        { label: "JS Heap Limit", value: snapshot.jsHeapLimit }
      ]
    },
    {
      title: "Runtime",
      icon: "JS",
      details: [
        { label: "Browser", value: snapshot.browser },
        { label: "Node Version", value: snapshot.nodeVersion }
      ]
    },
    {
      title: "Power & Network",
      icon: "NET",
      details: [
        { label: "Battery", value: snapshot.battery },
        { label: "Connection", value: snapshot.connection }
      ]
    },
    {
      title: "Hostname",
      icon: "PC",
      details: [
        { label: "Hostname", value: snapshot.hostname },
        { label: "Network", value: snapshot.online }
      ]
    }
  ];
}

function buildRuntimeVariables(snapshot) {
  return [
    { name: "USER_AGENT", value: snapshot.userAgent, type: "browser" },
    { name: "BROWSER", value: snapshot.browser, type: "browser" },
    { name: "BROWSER_VERSION", value: snapshot.browserVersion, type: "browser" },
    { name: "PLATFORM", value: snapshot.platform, type: "device" },
    { name: "OS_NAME", value: snapshot.osName, type: "device" },
    { name: "ARCHITECTURE", value: snapshot.architecture, type: "device" },
    { name: "CPU_CORES", value: snapshot.cpuCores, type: "device" },
    { name: "DEVICE_MEMORY", value: snapshot.memory, type: "device" },
    { name: "BATTERY", value: snapshot.battery, type: "device" },
    { name: "CONNECTION", value: snapshot.connection, type: "network" },
    { name: "STORAGE_ESTIMATE", value: snapshot.storage, type: "device" },
    { name: "PERMISSION_CAMERA", value: snapshot.permissions.camera, type: "security" },
    { name: "PERMISSION_MICROPHONE", value: snapshot.permissions.microphone, type: "security" },
    { name: "PERMISSION_GEOLOCATION", value: snapshot.permissions.geolocation, type: "security" },
    { name: "PERMISSION_NOTIFICATIONS", value: snapshot.permissions.notifications, type: "security" },
    { name: "LANGUAGE", value: snapshot.language, type: "browser" },
    { name: "LANGUAGES", value: snapshot.languages, type: "browser" },
    { name: "ONLINE_STATUS", value: snapshot.online, type: "network" },
    { name: "TIME_ZONE", value: snapshot.timeZone, type: "device" },
    { name: "SCREEN_SIZE", value: snapshot.screen, type: "screen" },
    { name: "VIEWPORT_SIZE", value: snapshot.viewport, type: "screen" },
    { name: "COLOR_DEPTH", value: snapshot.colorDepth, type: "screen" },
    { name: "COOKIES", value: snapshot.cookies, type: "security" },
    { name: "DO_NOT_TRACK", value: snapshot.doNotTrack, type: "security" },
    { name: "HOSTNAME", value: snapshot.hostname, type: "security" },
    { name: "NODE_VERSION", value: snapshot.nodeVersion, type: "security" }
  ];
}

function updateMetricCounters(snapshot) {
  const counters = document.querySelectorAll(".counter");
  if (counters.length < 3) return;

  counters[0].dataset.count = parseInt(snapshot.memory, 10) || 0;
  counters[1].dataset.count = Number(snapshot.cpuCores) || 0;
  counters[2].dataset.count = getFiles().length;
}

function renderHealthPanel(snapshot) {
  const score = calculateHealthScore(snapshot);
  healthScore.textContent = score;
  scoreRing.style.setProperty("--score", score);
  healthSummary.textContent = score >= 80
    ? "Most browser-readable system signals are available."
    : "Some system signals are limited by this browser or security settings.";
}

function renderCapabilityList() {
  capabilityList.innerHTML = currentCapabilityItems.map((item) => `
    <div class="capability-item">
      <span class="status-dot ${item.status}"></span>
      <div>
        <strong>${escapeHtml(item.label)}</strong>
        <small>${escapeHtml(item.value)}</small>
      </div>
    </div>
  `).join("");
}

function buildCapabilityItems(snapshot) {
  return [
    createCapabilityItem("CPU cores", snapshot.cpuCores),
    createCapabilityItem("Device memory", snapshot.memory),
    createCapabilityItem("Battery API", snapshot.battery),
    createCapabilityItem("Network info", snapshot.connection),
    createCapabilityItem("Storage estimate", snapshot.storage),
    createCapabilityItem("Camera permission", snapshot.permissions.camera),
    createCapabilityItem("Microphone permission", snapshot.permissions.microphone),
    createCapabilityItem("Geolocation permission", snapshot.permissions.geolocation),
    createCapabilityItem("Hostname access", snapshot.hostname)
  ];
}

function createCapabilityItem(label, value) {
  const normalized = String(value).toLowerCase();
  const unavailable = normalized.includes("unavailable") || normalized.includes("blocked") || normalized.includes("unsupported");

  return {
    label,
    value,
    status: unavailable ? "blocked" : "available"
  };
}

function calculateHealthScore(snapshot) {
  const checks = [
    snapshot.osName,
    snapshot.platform,
    snapshot.architecture,
    snapshot.cpuCores,
    snapshot.memory,
    snapshot.battery,
    snapshot.connection,
    snapshot.storage,
    snapshot.language,
    snapshot.timeZone
  ];
  const availableCount = checks.filter((value) => !createCapabilityItem("", value).status.includes("blocked")).length;
  return Math.round((availableCount / checks.length) * 100);
}

function detectOperatingSystem(platform, userAgent) {
  const source = `${platform} ${userAgent}`.toLowerCase();

  if (source.includes("windows")) return "Windows";
  if (source.includes("mac")) return "macOS";
  if (source.includes("iphone") || source.includes("ipad")) return "iOS";
  if (source.includes("android")) return "Android";
  if (source.includes("linux")) return "Linux";
  return "Unavailable";
}

function detectBrowser(userAgent) {
  if (userAgent.includes("Edg/")) return "Microsoft Edge";
  if (userAgent.includes("OPR/") || userAgent.includes("Opera")) return "Opera";
  if (userAgent.includes("Firefox/")) return "Firefox";
  if (userAgent.includes("Chrome/")) return "Chrome or Chromium";
  if (userAgent.includes("Safari/")) return "Safari";
  return "Unavailable";
}

function formatArchitecture(architecture, bitness, userAgent) {
  if (architecture && bitness) return `${architecture} ${bitness}-bit`;
  if (architecture) return architecture;
  if (/Win64|x64|x86_64|amd64/i.test(userAgent)) return "x64";
  if (/arm|aarch64/i.test(userAgent)) return "ARM";
  return "Unavailable in this browser";
}

function getHeapLimit() {
  const memoryInfo = safeRead(() => performance.memory, null);

  if (!memoryInfo || !memoryInfo.jsHeapSizeLimit) {
    return "Unavailable in this browser";
  }

  return `${Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024)} MB`;
}

async function getBatteryInfo() {
  try {
    if (!navigator.getBattery) return "Unavailable in this browser";

    const battery = await navigator.getBattery();
    const level = Math.round(battery.level * 100);
    return `${level}% ${battery.charging ? "charging" : "not charging"}`;
  } catch (error) {
    return "Unavailable in this browser";
  }
}

function getConnectionInfo() {
  const connection = safeRead(() => navigator.connection || navigator.mozConnection || navigator.webkitConnection, null);

  if (!connection) return "Unavailable in this browser";

  const type = connection.effectiveType || connection.type || "unknown";
  const downlink = connection.downlink ? `${connection.downlink} Mbps` : "speed unavailable";
  return `${type}, ${downlink}`;
}

async function getPermissionStates() {
  const fallback = {
    camera: "Unavailable in this browser",
    microphone: "Unavailable in this browser",
    geolocation: "Unavailable in this browser",
    notifications: "Unavailable in this browser"
  };

  if (!navigator.permissions || !navigator.permissions.query) return fallback;

  return {
    camera: await queryPermission("camera"),
    microphone: await queryPermission("microphone"),
    geolocation: await queryPermission("geolocation"),
    notifications: await queryPermission("notifications")
  };
}

async function queryPermission(name) {
  try {
    const result = await navigator.permissions.query({ name });
    return result.state;
  } catch (error) {
    return "Unavailable in this browser";
  }
}

async function getStorageInfo() {
  try {
    if (!navigator.storage || !navigator.storage.estimate) return "Unavailable in this browser";

    const estimate = await navigator.storage.estimate();
    const usage = formatBytes(estimate.usage || 0);
    const quota = formatBytes(estimate.quota || 0);
    return `${usage} used of ${quota}`;
  } catch (error) {
    return "Unavailable in this browser";
  }
}

function formatBytes(bytes) {
  if (!bytes) return "0 MB";
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

async function refreshDashboardScan() {
  refreshSystem.disabled = true;
  refreshSystem.textContent = "Scanning...";

  await refreshCurrentSystemInfo();
  renderSystemCards();
  renderEnvironmentTable();
  typeTerminalText();
  animateCounters();

  refreshSystem.disabled = false;
  refreshSystem.textContent = "Refresh Scan";
  showToast("System scan refreshed");
}

async function copyCurrentSnapshot() {
  await copyText(JSON.stringify(currentSystemSnapshot, null, 2), "Current snapshot copied");
}

async function copyText(text, successMessage) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    showToast(successMessage);
  } catch (error) {
    showToast("Copy is blocked in this browser");
  }
}

function safeRead(reader, fallback) {
  try {
    const value = reader();
    return value === undefined || value === null || value === "" ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function createUnavailableSystemSnapshot() {
  return {
    osName: "Unavailable",
    platform: "Unavailable",
    architecture: "Unavailable",
    browser: "Unavailable",
    browserVersion: "Unavailable",
    cpuCores: "Unavailable",
    processor: "Unavailable",
    memory: "Unavailable",
    jsHeapLimit: "Unavailable",
    nodeVersion: "Not available in browser-only apps",
    hostname: "Blocked by browser security",
    battery: "Unavailable",
    connection: "Unavailable",
    permissions: {
      camera: "Unavailable",
      microphone: "Unavailable",
      geolocation: "Unavailable",
      notifications: "Unavailable"
    },
    storage: "Unavailable",
    language: "Unavailable",
    languages: "Unavailable",
    online: "Unavailable",
    timeZone: "Unavailable",
    screen: "Unavailable",
    viewport: "Unavailable",
    colorDepth: "Unavailable",
    cookies: "Unavailable",
    doNotTrack: "Unavailable",
    userAgent: "Unavailable"
  };
}

function renderFallbackState() {
  currentSystemSnapshot = createUnavailableSystemSnapshot();
  currentSystemInfo = buildSystemCards(currentSystemSnapshot);
  currentEnvironmentVariables = buildRuntimeVariables(currentSystemSnapshot);
  currentCapabilityItems = buildCapabilityItems(currentSystemSnapshot);
  renderSystemCards();
  renderEnvironmentTable();
  renderHealthPanel(currentSystemSnapshot);
  renderCapabilityList();
  renderFiles();
  renderDocs();
}
