const STORAGE_KEY = "khaalipocket-state-v1";
const THEME_STORAGE_KEY = "khaalipocket-theme";
const DARK_THEME_COLOR = "#0f0f0f";
const LIGHT_THEME_COLOR = "#f5fafc";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const formatMoney = (value) => currency.format(Math.max(0, Math.round(Number(value) || 0)));
const numeric = (value) => Number(String(value).replace(/[^\d.]/g, "")) || 0;

const defaultState = {
  page: "home",
  dailyLimit: 450,
  mealBudget: 120,
  monthlyTotal: 20000,
  budgetIncome: 4500,
  tipsReviewed: [],
  categories: [
    { id: "housing", name: "Housing", value: 1500, icon: "home", color: "var(--category-housing-color)", bg: "var(--category-housing-bg)" },
    { id: "food", name: "Food", value: 600, icon: "restaurant", color: "var(--category-food-color)", bg: "var(--category-food-bg)" },
    { id: "transport", name: "Transport", value: 400, icon: "commute", color: "var(--category-transport-color)", bg: "var(--category-transport-bg)" }
  ],
  expenses: [
    { id: "seed-1", amount: 2600, category: "food", note: "Meals and snacks", date: "2026-04-22T10:30:00.000Z" },
    { id: "seed-2", amount: 1900, category: "transport", note: "Metro and rides", date: "2026-04-24T13:20:00.000Z" },
    { id: "seed-3", amount: 1000, category: "shopping", note: "Essentials", date: "2026-04-25T17:05:00.000Z" }
  ]
};

const restaurants = [
  {
    id: "slice-station",
    name: "Slice Station",
    cuisines: "Pizza, Fast Food",
    price: 120,
    distance: 450,
    distanceLabel: "450m",
    rating: 4.2,
    status: "Trending",
    statusIcon: "local_fire_department",
    tags: ["nearest", "open"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIPNiE4XQw5XPcA4t1GxEp6ukJcgjlF2XOJ-r57KuGLoMlsUcM19WT-4fUNw5UTPhMx3X2TbREd8uiVdPbXj5_s4bZ4M0dmeqsC6WyPWfcHDmaTIM3w-IBBzjJME_Tl3Pe9ZF09eOiGOWHOmhPkuc--gvlz-qUkBEnkvmUTL8FYJi58qFl-duPkJbtf3i2p8dR2zyY0XPHbcnKJJtKt_Vz0qePWcOl7CrGJgZnSyiU5hhIE3_yNf2rl6MUxBUbn3VU1cVrUg3sTr8",
    alt: "Close up of a wood fired pizza with melted cheese and fresh basil"
  },
  {
    id: "noodle-ninja",
    name: "Noodle Ninja",
    cuisines: "Chinese, Asian Street",
    price: 90,
    distance: 800,
    distanceLabel: "800m",
    rating: 4.5,
    status: "Top Rated",
    statusIcon: "verified",
    tags: ["nearest", "street", "open"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjND1_5JEaNjKDFWKXKPdFu_6E_mIZRMc12qbZ0clAEKOHR0LtCqdTOPeG5DgWzkoDXJfc9jLLR88TXOZWjw84s951cWt4PJO0z1gE-P3cz6r85Ms08RAlWGO_uW7EW2VJ8UZVfznFPTmyv-WmcfS0tOZ-RCKQbtcz8TGha4y56Mf83xuJzORv5sMr7kCy3lLCjrszNFy_-Z_aIulahJk8dFBdINJv9ebRL6yWYDhVAsGPl32boewnN1SV5t3Is3_ub-QXIk3M6io",
    alt: "Bowl of steaming asian noodles with vegetables and chopsticks"
  },
  {
    id: "burger-bros",
    name: "Burger Bros",
    cuisines: "American, Fast Food",
    price: 149,
    distance: 1200,
    distanceLabel: "1.2km",
    rating: 4.0,
    status: "15 min wait",
    statusIcon: "schedule",
    mutedStatus: true,
    tags: ["open"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqsa0a8q8XwB_PyetWswBOTJ8Xnelk2-sh2tvsjf5YaNr4TX_ydToOgcrk4N06LinEtz6lo5T88702Avdz9JVMFc453Zdm47jyE8_cKcVTN-5lNeb2RMbW4kYGsNXMIo5XsBgj6WWR99w629J2Utz4cIqCUtJZDy-914EXAcBOIEO-VOvUWsblkVBCih73B9RToyJaeSz0zRN51ey8WaLY2AAMv9Oa2uaQ2kSRtVhbbeTcEpJ9ZXHXrqImvXGZq1mAghh7r0eDb4c",
    alt: "Juicy classic double cheeseburger with lettuce and tomato"
  },
  {
    id: "veg-vault",
    name: "Veg Vault",
    cuisines: "Pure Veg, Thali",
    price: 110,
    distance: 950,
    distanceLabel: "950m",
    rating: 4.3,
    status: "Pure Veg",
    statusIcon: "eco",
    tags: ["veg", "open"],
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    alt: "Vegetarian thali with rice, curries, roti and chutneys"
  }
];

const tipTemplates = [
  {
    id: "dining",
    icon: "restaurant",
    title: "Reduce Dining Out",
    description: "Your weekend dining expenses are spiking.",
    savings: 120,
    cta: "Review Habits"
  },
  {
    id: "subscriptions",
    icon: "subscriptions",
    title: "Unused Subscriptions",
    description: "One recurring charge hasn't been active.",
    savings: 15,
    cta: "Manage Subs"
  },
  {
    id: "transit",
    icon: "directions_transit",
    title: "Transit Optimization",
    description: "Switching to a monthly pass is recommended.",
    savings: 45,
    cta: "View Options"
  }
];

let state = loadState();
let activeFilter = "nearest";

const els = {};

applyStoredTheme();

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  updateThemeToggle();
  render();
  setPage(state.page || "home", { persist: false });
});

function applyStoredTheme() {
  const savedTheme = safeStorageGet(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  setTheme(theme, { persist: false, renderThemeAwareUi: false });
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  setTheme(nextTheme);
}

function setTheme(theme, options = {}) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";

  const metaTheme = document.querySelector("meta[name='theme-color']");
  if (metaTheme) {
    metaTheme.setAttribute("content", isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  }

  if (options.persist !== false) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      showToast("Theme preference could not be saved", "error");
    }
  }

  updateThemeToggle();

  if (options.renderThemeAwareUi !== false && els.spendingDonut) {
    renderBudget();
    renderInsights();
  }
}

function updateThemeToggle() {
  if (!els.themeToggle) {
    return;
  }

  const isDark = document.body.classList.contains("dark");
  els.themeToggle.setAttribute("aria-pressed", String(isDark));
  els.themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  els.themeToggleIcon.textContent = isDark ? "light_mode" : "dark_mode";
  els.themeToggleText.textContent = isDark ? "Light" : "Dark";
}

function cacheElements() {
  els.pages = Array.from(document.querySelectorAll("[data-page]"));
  els.navButtons = Array.from(document.querySelectorAll("[data-nav]"));
  els.incomeInput = document.getElementById("income-input");
  els.incomeError = document.getElementById("income-error");
  els.categoryList = document.getElementById("category-list");
  els.allocatedLabel = document.getElementById("allocated-label");
  els.remainingLabel = document.getElementById("remaining-label");
  els.allocationProgress = document.getElementById("allocation-progress");
  els.activeCategoryCount = document.getElementById("active-category-count");
  els.saveBudget = document.getElementById("save-budget");
  els.autoDivide = document.getElementById("auto-divide");
  els.addCategoryButton = document.getElementById("add-category-button");
  els.expenseForm = document.getElementById("expense-form");
  els.amountInput = document.getElementById("amount-input");
  els.amountError = document.getElementById("amount-error");
  els.noteInput = document.getElementById("note-input");
  els.dashboardTitle = document.getElementById("dashboard-title");
  els.incomeTotalLabel = document.getElementById("income-total-label");
  els.usageChip = document.getElementById("usage-chip");
  els.monthlyProgress = document.getElementById("monthly-progress");
  els.dailyLimitText = document.getElementById("daily-limit-text");
  els.perMealText = document.getElementById("per-meal-text");
  els.mealBudgetText = document.getElementById("meal-budget-text");
  els.breakdownList = document.getElementById("breakdown-list");
  els.spendingDonut = document.getElementById("spending-donut");
  els.tipList = document.getElementById("tip-list");
  els.burnHeading = document.getElementById("burn-heading");
  els.burnSummary = document.getElementById("burn-summary");
  els.restaurantGrid = document.getElementById("restaurant-grid");
  els.filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  els.exploreOffers = document.getElementById("explore-offers");
  els.toastStack = document.getElementById("toast-stack");
  els.dialog = document.getElementById("app-dialog");
  els.dialogBody = document.getElementById("dialog-body");
  els.themeToggle = document.getElementById("theme-toggle");
  els.themeToggleIcon = els.themeToggle?.querySelector(".theme-toggle-icon");
  els.themeToggleText = els.themeToggle?.querySelector(".theme-toggle-text");
}

function bindEvents() {
  els.navButtons.forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.nav));
  });

  document.querySelector("[data-action='go-home']").addEventListener("click", () => setPage("home"));
  document.querySelector("[data-action='profile']").addEventListener("click", openProfileDialog);
  els.themeToggle.addEventListener("click", toggleTheme);

  els.incomeInput.addEventListener("input", () => {
    state.budgetIncome = numeric(els.incomeInput.value);
    renderBudget();
    saveState();
  });

  els.autoDivide.addEventListener("click", applySmartSplit);
  els.saveBudget.addEventListener("click", saveBudgetStructure);
  els.addCategoryButton.addEventListener("click", openCategoryDialog);
  els.expenseForm.addEventListener("submit", handleExpenseSubmit);

  document.querySelectorAll("[data-edit-limit]").forEach((button) => {
    button.addEventListener("click", () => openLimitDialog(button.dataset.editLimit));
  });

  els.filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      renderRestaurants();
      showToast(`${button.textContent.trim()} filter applied`, "tune");
    });
  });

  els.exploreOffers.addEventListener("click", () => {
    activeFilter = "open";
    renderRestaurants();
    document.querySelector(".restaurant-grid").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.dialog.addEventListener("click", (event) => {
    const rect = els.dialog.querySelector(".dialog-card").getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      els.dialog.close();
    }
  });
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== "object") {
      return normalizeCategoryThemeValues(clone(defaultState));
    }

    return normalizeCategoryThemeValues({
      ...clone(defaultState),
      ...stored,
      categories: Array.isArray(stored.categories) ? stored.categories : clone(defaultState.categories),
      expenses: Array.isArray(stored.expenses) ? stored.expenses : clone(defaultState.expenses),
      tipsReviewed: Array.isArray(stored.tipsReviewed) ? stored.tipsReviewed : []
    });
  } catch {
    return normalizeCategoryThemeValues(clone(defaultState));
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast("Browser storage is unavailable", "error");
  }
}

function render() {
  renderBudget();
  renderDashboard();
  renderInsights();
  renderRestaurants();
}

function setPage(page, options = {}) {
  const targetPage = page || "home";
  document.body.classList.add("is-transitioning");

  els.pages.forEach((section) => {
    section.classList.toggle("active", section.dataset.page === targetPage);
  });

  els.navButtons.forEach((button) => {
    const isActive = button.dataset.nav === targetPage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  state.page = targetPage;
  if (options.persist !== false) {
    saveState();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(() => document.body.classList.remove("is-transitioning"), 260);

  if (targetPage === "add") {
    window.setTimeout(() => els.amountInput.focus({ preventScroll: true }), 260);
  }
}

function renderBudget() {
  const income = Math.max(0, Number(state.budgetIncome) || 0);
  const allocated = state.categories.reduce((sum, category) => sum + Number(category.value || 0), 0);
  const remaining = income - allocated;
  const percent = income > 0 ? Math.min((allocated / income) * 100, 100) : 0;

  els.incomeInput.value = income ? String(Math.round(income)) : "";
  els.incomeError.textContent = income <= 0 ? "Enter a monthly income to keep allocations accurate." : "";
  els.allocatedLabel.textContent = formatMoney(allocated);
  els.remainingLabel.textContent = `${remaining < 0 ? "-" : ""}${formatMoney(Math.abs(remaining))}`;
  els.remainingLabel.style.color = remaining < 0 ? "var(--error)" : "var(--primary)";
  els.allocationProgress.style.width = `${percent}%`;
  els.allocationProgress.style.background = remaining < 0 ? "var(--error)" : "var(--primary)";
  els.activeCategoryCount.textContent = `${state.categories.length} Active`;

  els.categoryList.innerHTML = state.categories.map(categoryTemplate).join("");

  els.categoryList.querySelectorAll("[data-category-input]").forEach((input) => {
    input.addEventListener("input", () => updateCategoryValue(input.dataset.categoryInput, numeric(input.value)));
  });

  els.categoryList.querySelectorAll("[data-category-range]").forEach((range) => {
    range.addEventListener("input", () => updateCategoryValue(range.dataset.categoryRange, numeric(range.value)));
  });
}

function categoryTemplate(category) {
  const income = Math.max(1, Number(state.budgetIncome) || 1);
  const value = Math.max(0, Number(category.value) || 0);
  const spendMap = getCategorySpendMap();
  const spent = spendMap[category.id] || 0;
  const remaining = value - spent;
  const width = Math.min((value / income) * 100, 100);

  return `
    <div class="budget-category">
      <div class="category-top">
        <div class="category-name">
          <span>${category.name}</span>
        </div>
        <label class="mini-currency">
          <span>₹</span>
          <input data-category-input="${category.id}" type="text" value="${value}">
        </label>
      </div>
      <div class="category-meta">
        <span>Spent: ₹${spent}</span>
        <span style="color:${remaining < 0 ? 'red' : 'green'}">
        Left: ₹${remaining}
        </span>
      </div>
      <div class="range-wrap">
        <input data-category-range="${category.id}" type="range" min="0" max="${state.budgetIncome}" value="${value}">
        <div class="range-fill" style="width:${width}%"></div>
      </div>
    </div>
  `;
}

function updateCategoryValue(id, value) {
  const category = state.categories.find((item) => item.id === id);
  if (!category) return;

  category.value = Math.max(0, value);

  renderBudget();   // ✅ full re-render (stable)
  saveState();
}

function updateBudgetSummary() {
  const income = Math.max(0, Number(state.budgetIncome) || 0);
  const allocated = state.categories.reduce((sum, c) => sum + Number(c.value || 0), 0);
  const remaining = income - allocated;
  const percent = income > 0 ? Math.min((allocated / income) * 100, 100) : 0;

  els.allocatedLabel.textContent = formatMoney(allocated);
  els.remainingLabel.textContent = `${remaining < 0 ? "-" : ""}${formatMoney(Math.abs(remaining))}`;
  els.remainingLabel.style.color = remaining < 0 ? "var(--error)" : "var(--primary)";
  els.allocationProgress.style.width = `${percent}%`;
}

function applySmartSplit() {
  const income = Math.max(0, Number(state.budgetIncome) || 0);
  if (!income) {
    els.incomeInput.focus();
    showToast("Add your income first", "error");
    return;
  }

  const plan = [
    ["housing", 0.45],
    ["food", 0.25],
    ["transport", 0.15]
  ];
  const fallbackShare = 0.15 / Math.max(1, state.categories.length - 3);

  state.categories = state.categories.map((category) => {
    const matched = plan.find(([id]) => id === category.id);
    const share = matched ? matched[1] : fallbackShare;
    return { ...category, value: Math.round(income * share) };
  });

  renderBudget();
  saveState();
  showToast("Smart split applied", "auto_awesome");
}

function saveBudgetStructure() {
  const income = Number(state.budgetIncome) || 0;
  if (income <= 0) {
    els.incomeError.textContent = "Monthly income must be greater than zero.";
    els.incomeInput.focus();
    return;
  }

  state.monthlyTotal = income;
  renderDashboard();
  saveState();
  showToast("Budget structure saved", "check_circle");
}

function openCategoryDialog() {
  openDialog(`
    <h2>Add Custom Category</h2>
    <p>Create another allocation bucket for your monthly plan.</p>
    <label class="modal-input">
      <span class="eyebrow">Category Name</span>
      <input id="new-category-name" type="text" maxlength="24" placeholder="Utilities">
    </label>
    <label class="modal-input" style="margin-top:12px">
      <span class="eyebrow">Starting Amount</span>
      <input id="new-category-amount" type="number" min="0" step="1" placeholder="300">
    </label>
    <div class="dialog-actions">
      <button class="outline-button" type="button" data-dialog-cancel>Cancel</button>
      <button class="primary-button" type="button" id="confirm-category">Add Category</button>
    </div>
  `);

  document.getElementById("new-category-name").focus();
  document.querySelector("[data-dialog-cancel]").addEventListener("click", () => els.dialog.close());
  document.getElementById("confirm-category").addEventListener("click", () => {
    const name = document.getElementById("new-category-name").value.trim();
    const value = numeric(document.getElementById("new-category-amount").value);

    if (!name) {
      showToast("Name the category first", "error");
      return;
    }

    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    state.categories.push({
      id,
      name,
      value,
      icon: "category",
      color: "var(--primary)",
      bg: "var(--primary-soft)"
    });
    renderBudget();
    saveState();
    els.dialog.close();
    showToast(`${name} added`, "add_circle");
  });
}

function handleExpenseSubmit(event) {
  event.preventDefault();
  const amount = numeric(els.amountInput.value);
  const note = els.noteInput.value.trim();

  if (amount <= 0) {
    els.amountError.textContent = "Amount must be greater than zero.";
    return;
  }

  els.amountError.textContent = "";
  state.expenses.unshift({
    id: createId("expense"),
    amount,
    category: "food",
    note: note || "Expense",
    date: new Date().toISOString()
  });

  els.amountInput.value = "";
  els.noteInput.value = "";
  saveState();
  saveState();
  renderDashboard();
  renderInsights();
renderBudget(); // 🔥 THIS links everything
  renderDashboard();
  renderInsights();
  showToast("Expense logged", "check_circle");
}

function renderDashboard() {
  const spent = totalSpent();
  const total = Math.max(1, Number(state.monthlyTotal) || 1);
  const remaining = Math.max(0, total - spent);
  const usedPercent = Math.min((spent / total) * 100, 100);

  // 🔥 NEW: category tracking
  const categorySpend = getCategorySpendMap();

  // UI updates
  els.dashboardTitle.textContent = formatMoney(remaining);
  els.incomeTotalLabel.textContent = `/ ${formatMoney(total)}`;
  els.usageChip.textContent = `${Math.round(usedPercent)}% Used`;
  els.monthlyProgress.style.width = `${usedPercent}%`;

  // 🔥 Dynamic daily limit
  const daysLeft = getDaysLeftInMonth();
  state.dailyLimit = remaining / Math.max(1, daysLeft);

  // 🔥 Dynamic meal budget
  state.mealBudget = state.dailyLimit / 3;

  els.dailyLimitText.textContent = formatMoney(state.dailyLimit);
  els.perMealText.textContent = formatMoney(state.mealBudget);
  els.mealBudgetText.textContent = formatMoney(state.mealBudget);
}

function getDaysLeftInMonth() {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate() + 1;
}

function openLimitDialog(type) {
  const isDaily = type === "daily";
  const label = isDaily ? "Daily Spend Limit" : "Per Meal Budget";
  const current = isDaily ? state.dailyLimit : state.mealBudget;

  openDialog(`
    <h2>Edit ${label}</h2>
    <p>Update this local estimate and it will persist on reload.</p>
    <label class="modal-input">
      <span class="eyebrow">${label}</span>
      <input id="limit-input" type="number" min="1" step="1" value="${Math.round(current)}">
    </label>
    <div class="dialog-actions">
      <button class="outline-button" type="button" data-dialog-cancel>Cancel</button>
      <button class="primary-button" type="button" id="confirm-limit">Save</button>
    </div>
  `);

  document.getElementById("limit-input").focus();
  document.querySelector("[data-dialog-cancel]").addEventListener("click", () => els.dialog.close());
  document.getElementById("confirm-limit").addEventListener("click", () => {
    const value = numeric(document.getElementById("limit-input").value);
    if (value <= 0) {
      showToast("Enter a value greater than zero", "error");
      return;
    }

    if (isDaily) {
      state.dailyLimit = value;
    } else {
      state.mealBudget = value;
    }

    renderDashboard();
    saveState();
    els.dialog.close();
    showToast(`${label} updated`, "check_circle");
  });
}

function renderInsights() {
  const breakdown = spendingBreakdown();
  const total = breakdown.reduce((sum, item) => sum + item.value, 0) || 1;
  let cursor = 0;
  const colors = [
    getCssVariable("--primary"),
    getCssVariable("--primary-mid"),
    getCssVariable("--tertiary"),
    getCssVariable("--chart-other")
  ];
  const segments = breakdown.map((item, index) => {
    const start = cursor;
    const amount = (item.value / total) * 100;
    cursor += amount;
    return `${colors[index]} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
  });

  els.spendingDonut.style.background = `conic-gradient(${segments.join(", ")})`;
  els.breakdownList.innerHTML = breakdown.map((item, index) => {
    const percent = Math.round((item.value / total) * 100);
    return `
      <div class="breakdown-item">
        <div class="breakdown-label">
          <span class="swatch" style="background:${colors[index]}"></span>
          <span>${item.label}</span>
        </div>
        <strong>${percent}%</strong>
      </div>
    `;
  }).join("");

  const spent = totalSpent();
  const monthlyTotal = Math.max(1, state.monthlyTotal);
  const usedPercent = (spent / monthlyTotal) * 100;

  if (usedPercent > 90) {
    els.burnHeading.textContent = "Careful pace.";
    els.burnSummary.innerHTML = `You have used <strong>${Math.round(usedPercent)}%</strong> of your monthly budget. Tighten the next few purchases.`;
  } else {
    els.burnHeading.textContent = "Looking good.";
    els.burnSummary.innerHTML = `You are spending <strong>12% less</strong> than last week. Keep up the disciplined pacing.`;
  }

  els.tipList.innerHTML = tipTemplates.map(tipTemplate).join("");
  els.tipList.querySelectorAll("[data-tip]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.tip;
      if (!state.tipsReviewed.includes(id)) {
        state.tipsReviewed.push(id);
      }
      saveState();
      renderInsights();
      showToast("Tip marked reviewed", "task_alt");
    });
  });
}

function tipTemplate(tip) {
  const reviewed = state.tipsReviewed.includes(tip.id);
  return `
    <div class="tip-item">
      <div class="tip-main">
        <div class="circle-icon">
          <span class="material-symbols-outlined" aria-hidden="true">${tip.icon}</span>
        </div>
        <div>
          <h3>${tip.title}</h3>
          <p>${reviewed ? "Reviewed and added to your focus list." : tip.description}</p>
        </div>
      </div>
      <div class="tip-action">
        <span class="savings-chip">+${formatMoney(tip.savings)}/mo</span>
        <button class="link-button" type="button" data-tip="${tip.id}">
          ${reviewed ? "Reviewed" : tip.cta}
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

function renderRestaurants() {
  els.filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === activeFilter);
  });

  const filtered = restaurants
    .filter((restaurant) => activeFilter === "nearest" || restaurant.tags.includes(activeFilter))
    .sort((a, b) => activeFilter === "nearest" ? a.distance - b.distance : a.price - b.price);

  els.restaurantGrid.innerHTML = filtered.map(restaurantTemplate).join("");
  els.restaurantGrid.querySelectorAll("[data-restaurant]").forEach((card) => {
    card.addEventListener("click", () => openRestaurantDialog(card.dataset.restaurant));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openRestaurantDialog(card.dataset.restaurant);
      }
    });
  });
}

function restaurantTemplate(restaurant) {
  return `
    <article class="restaurant-card" tabindex="0" role="button" data-restaurant="${restaurant.id}" aria-label="Open ${escapeHtml(restaurant.name)} details">
      <div class="restaurant-media">
        <img src="${restaurant.image}" alt="${escapeHtml(restaurant.alt)}" loading="lazy">
        <div class="price-badge">${formatMoney(restaurant.price)} <span>avg</span></div>
        <div class="distance-badge">
          <span class="material-symbols-outlined" aria-hidden="true">location_on</span>
          ${restaurant.distanceLabel}
        </div>
      </div>
      <div class="restaurant-body">
        <div>
          <div class="restaurant-title-row">
            <h2>${restaurant.name}</h2>
            <div class="rating">
              <span class="material-symbols-outlined" aria-hidden="true">star</span>
              ${restaurant.rating.toFixed(1)}
            </div>
          </div>
          <p>${restaurant.cuisines}</p>
        </div>
        <div class="restaurant-foot">
          <span class="status-label ${restaurant.mutedStatus ? "muted" : ""}">
            <span class="material-symbols-outlined" aria-hidden="true">${restaurant.statusIcon}</span>
            ${restaurant.status}
          </span>
          <button class="arrow-button" type="button" aria-label="Open ${restaurant.name}">
            <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function openRestaurantDialog(id) {
  const restaurant = restaurants.find((item) => item.id === id);
  if (!restaurant) {
    return;
  }

  openDialog(`
    <h2>${restaurant.name}</h2>
    <p>${restaurant.cuisines} · ${restaurant.distanceLabel} · ${formatMoney(restaurant.price)} average</p>
    <div class="expense-row">
      <div>
        <strong>Budget fit</strong>
        <span>${restaurant.price <= state.mealBudget ? "Inside your per-meal budget" : `${formatMoney(restaurant.price - state.mealBudget)} over your meal budget`}</span>
      </div>
      <span class="savings-chip">${restaurant.rating.toFixed(1)} ★</span>
    </div>
    <div class="dialog-actions">
      <button class="outline-button" type="button" data-dialog-cancel>Close</button>
      <button class="primary-button" type="button" id="log-meal">Log Meal</button>
    </div>
  `);

  document.querySelector("[data-dialog-cancel]").addEventListener("click", () => els.dialog.close());
  document.getElementById("log-meal").addEventListener("click", () => {
    state.expenses.unshift({
      id: createId("expense"),
      amount: restaurant.price,
      category: "food",
      note: restaurant.name,
      date: new Date().toISOString()
    });
    saveState();
    renderDashboard();
    renderInsights();
    els.dialog.close();
    showToast(`${restaurant.name} logged`, "restaurant");
  });
}

function openProfileDialog() {
  const recent = state.expenses.slice(0, 5);
  openDialog(`
    <h2>Profile Summary</h2>
    <p>Your local app data is saved in this browser only.</p>
    <div class="expense-row">
      <div>
        <strong>Monthly Spend</strong>
        <span>${state.expenses.length} tracked transactions</span>
      </div>
      <strong>${formatMoney(totalSpent())}</strong>
    </div>
    <div class="expense-list">
      ${recent.length ? recent.map((expense) => `
        <div class="expense-row">
          <div>
            <strong>${escapeHtml(expense.note || labelForCategory(expense.category))}</strong>
            <span>${labelForCategory(expense.category)}</span>
          </div>
          <strong>${formatMoney(expense.amount)}</strong>
        </div>
      `).join("") : "<p>No expenses yet.</p>"}
    </div>
  `);
}

function openDialog(markup) {
  els.dialogBody.innerHTML = markup;
  if (els.dialog.open) {
    els.dialog.close();
  }
  if (typeof els.dialog.showModal === "function") {
    els.dialog.showModal();
  } else {
    els.dialog.setAttribute("open", "");
  }
}

function showToast(message, icon = "info") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
    <span>${escapeHtml(message)}</span>
  `;
  els.toastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("leaving");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, 2400);
}

function spendingBreakdown() {
  const buckets = [
    { key: "food", label: "Food", value: 0 },
    { key: "transport", label: "Transport", value: 0 },
    { key: "shopping", label: "Entertainment", value: 0 },
    { key: "other", label: "Other", value: 0 }
  ];

  state.expenses.forEach((expense) => {
    const bucket = buckets.find((item) => item.key === expense.category) || buckets[3];
    bucket.value += Number(expense.amount) || 0;
  });

  if (buckets.every((bucket) => bucket.value === 0)) {
    return [
      { label: "Food", value: 40 },
      { label: "Transport", value: 25 },
      { label: "Entertainment", value: 20 },
      { label: "Other", value: 15 }
    ];
  }

  return buckets.map(({ label, value }) => ({ label, value }));
}

function totalSpent() {
  return state.expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
}

function createId(prefix) {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeCategoryThemeValues(appState) {
  const themeValues = {
    housing: { color: "var(--category-housing-color)", bg: "var(--category-housing-bg)" },
    food: { color: "var(--category-food-color)", bg: "var(--category-food-bg)" },
    transport: { color: "var(--category-transport-color)", bg: "var(--category-transport-bg)" }
  };

  appState.categories = appState.categories.map((category) => ({
    ...category,
    ...(themeValues[category.id] || {
      color: category.color?.startsWith("var(") ? category.color : "var(--primary)",
      bg: category.bg?.startsWith("var(") ? category.bg : "var(--primary-soft)"
    })
  }));

  return appState;
}

function getCssVariable(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function labelForCategory(category) {
  const labels = {
    food: "Food",
    transport: "Transport",
    shopping: "Shopping",
    other: "Other"
  };
  return labels[category] || "Other";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

let typingTimer;

input.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    updateCategoryValue(id, numeric(input.value));
  }, 120);
});

function getCategorySpendMap() {
  const map = {};

  state.expenses.forEach(exp => {
    map[exp.category] = (map[exp.category] || 0) + exp.amount;
  });

  return map;
}

function getCategorySpendMap() {
  const map = {};

  state.expenses.forEach(exp => {
    map[exp.category] = (map[exp.category] || 0) + exp.amount;
  });

  return map;
}