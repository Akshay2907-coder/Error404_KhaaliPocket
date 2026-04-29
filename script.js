const STORAGE_KEY = "khaalipocket-state-v1";
const THEME_STORAGE_KEY = "khaalipocket-theme";
const DARK_THEME_COLOR = "#0f0f0f";
const LIGHT_THEME_COLOR = "#f5fafc";
const BASE_URL = "http://localhost:5000";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const formatMoney = (value) => currency.format(Math.max(0, Math.round(Number(value) || 0)));
const numeric = (value) => Number(String(value).replace(/[^\d.]/g, "")) || 0;

const defaultState = {
  page: "welcome",
  dailyLimit: 0,
  mealBudget: 0,
  monthlyTotal: 0,
  budgetIncome: 0,
  profileName: "",
  profileColor: "",
  tipsReviewed: [],
  categories: [
    { id: "shopping", name: "Shopping", value: 0, icon: "shopping_bag", color: "var(--category-shopping-color)", bg: "var(--category-shopping-bg)" },
    { id: "food", name: "Food", value: 0, icon: "restaurant", color: "var(--category-food-color)", bg: "var(--category-food-bg)" },
    { id: "transport", name: "Transport", value: 0, icon: "commute", color: "var(--category-transport-color)", bg: "var(--category-transport-bg)" }
  ],
  expenses: []
};

const restaurants = [
  { id: "idli-1", name: "Idli", cuisines: "South Indian", price: 30, distance: 200, distanceLabel: "200m", rating: 4.5, status: "Hot", statusIcon: "local_fire_department", tags: ["nearest", "veg", "open", "Indiranagar", "BTM"], location: "Indiranagar", icon: "bakery_dining", bgColor: "#fef3c7", alt: "Idli" },
  { id: "dosa-1", name: "Dosa", cuisines: "South Indian", price: 50, distance: 300, distanceLabel: "300m", rating: 4.2, status: "Popular", statusIcon: "star", tags: ["nearest", "veg", "open", "Whitefield", "Marathahalli"], location: "Whitefield", icon: "local_pizza", bgColor: "#ffedd5", alt: "Dosa" },
  { id: "masala-dosa", name: "Masala Dosa", cuisines: "South Indian", price: 60, distance: 400, distanceLabel: "400m", rating: 4.6, status: "Trending", statusIcon: "trending_up", tags: ["veg", "open", "BTM", "Electronic City"], location: "BTM", icon: "lunch_dining", bgColor: "#fed7aa", alt: "Masala Dosa" },
  { id: "meals", name: "Meals", cuisines: "South Indian Thali", price: 120, distance: 600, distanceLabel: "600m", rating: 4.3, status: "Filling", statusIcon: "restaurant", tags: ["veg", "open", "Indiranagar", "Marathahalli"], location: "Marathahalli", icon: "rice_bowl", bgColor: "#dcfce7", alt: "Meals" },
  { id: "lemon-rice", name: "Lemon Rice", cuisines: "Rice Bowl", price: 40, distance: 150, distanceLabel: "150m", rating: 4.1, status: "Quick Bite", statusIcon: "bolt", tags: ["nearest", "veg", "street", "Whitefield", "BTM"], location: "Whitefield", icon: "rice_bowl", bgColor: "#fef08a", alt: "Lemon Rice" },
  { id: "curd-rice", name: "Curd Rice", cuisines: "Comfort Food", price: 40, distance: 250, distanceLabel: "250m", rating: 4.4, status: "Cooling", statusIcon: "ac_unit", tags: ["nearest", "veg", "Indiranagar", "Electronic City"], location: "Electronic City", icon: "rice_bowl", bgColor: "#f1f5f9", alt: "Curd Rice" },
  { id: "vada", name: "Vada", cuisines: "Snack", price: 20, distance: 100, distanceLabel: "100m", rating: 4.7, status: "Crunchy", statusIcon: "cookie", tags: ["nearest", "veg", "street", "Marathahalli", "BTM"], location: "Marathahalli", icon: "donut_small", bgColor: "#fcd34d", alt: "Vada" },
  { id: "pongal", name: "Pongal", cuisines: "Breakfast", price: 50, distance: 350, distanceLabel: "350m", rating: 4.3, status: "Morning Special", statusIcon: "wb_twilight", tags: ["veg", "open", "Whitefield", "Indiranagar"], location: "Indiranagar", icon: "soup_kitchen", bgColor: "#fde68a", alt: "Pongal" },
  { id: "biryani", name: "Biryani", cuisines: "Mughlai", price: 120, distance: 800, distanceLabel: "800m", rating: 4.8, status: "Must Try", statusIcon: "local_fire_department", tags: ["open", "Whitefield", "Electronic City"], location: "Electronic City", icon: "kebab_dining", bgColor: "#fecaca", alt: "Biryani" },
  { id: "fried-rice", name: "Fried Rice", cuisines: "Indo-Chinese", price: 60, distance: 500, distanceLabel: "500m", rating: 4.2, status: "Spicy", statusIcon: "whatshot", tags: ["street", "open", "BTM", "Marathahalli"], location: "BTM", icon: "skillet", bgColor: "#ffedd5", alt: "Fried Rice" },
  { id: "noodles", name: "Noodles", cuisines: "Chinese", price: 60, distance: 550, distanceLabel: "550m", rating: 4.1, status: "Fast Food", statusIcon: "ramen_dining", tags: ["street", "open", "Whitefield", "Indiranagar"], location: "Whitefield", icon: "ramen_dining", bgColor: "#e0e7ff", alt: "Noodles" },
  { id: "burger", name: "Burger", cuisines: "American", price: 80, distance: 900, distanceLabel: "900m", rating: 4.0, status: "Juicy", statusIcon: "lunch_dining", tags: ["open", "Indiranagar", "Electronic City"], location: "Indiranagar", icon: "lunch_dining", bgColor: "#fee2e2", alt: "Burger" },
  { id: "pizza", name: "Pizza", cuisines: "Italian", price: 99, distance: 1000, distanceLabel: "1km", rating: 4.5, status: "Cheesy", statusIcon: "local_pizza", tags: ["open", "Marathahalli", "Whitefield"], location: "Marathahalli", icon: "local_pizza", bgColor: "#fef08a", alt: "Pizza" },
  { id: "sandwich", name: "Sandwich", cuisines: "Snack", price: 60, distance: 400, distanceLabel: "400m", rating: 4.3, status: "Healthy", statusIcon: "eco", tags: ["veg", "nearest", "open", "BTM", "Indiranagar"], location: "BTM", icon: "breakfast_dining", bgColor: "#dcfce7", alt: "Sandwich" },
  { id: "parotta", name: "Parotta", cuisines: "South Indian", price: 60, distance: 450, distanceLabel: "450m", rating: 4.6, status: "Flaky", statusIcon: "bakery_dining", tags: ["street", "open", "Electronic City", "Marathahalli"], location: "Electronic City", icon: "bakery_dining", bgColor: "#f3e8ff", alt: "Parotta" }
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
let isOffline = false;

const els = {};

applyStoredTheme();

document.addEventListener("DOMContentLoaded", async () => {
  cacheElements();
  bindEvents();
  updateThemeToggle();
  updateProfileUI();
  await fetchExpenses();
  
  if (state.budgetIncome === 0) {
    setPage("welcome", { persist: false });
  } else {
    render();
    setPage(state.page || "home", { persist: false });
  }
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
  els.dailyAlert = document.getElementById("daily-alert");
  els.saveBudget = document.getElementById("save-budget");
  els.autoDivide = document.getElementById("auto-divide");
  els.addCategoryButton = document.getElementById("add-category-button");
  els.expenseForm = document.getElementById("expense-form");
  els.expenseCategoryOptions = document.getElementById("expense-category-options");
  els.amountInput = document.getElementById("amount-input");
  els.amountError = document.getElementById("amount-error");
  els.noteInput = document.getElementById("note-input");
  els.dashboardTitle = document.getElementById("dashboard-title");
  els.incomeTotalLabel = document.getElementById("income-total-label");
  els.usageChip = document.getElementById("usage-chip");
  els.monthlyProgress = document.getElementById("monthly-progress");
  els.dailyLimitText = document.getElementById("daily-limit-text");
  els.welcomeForm = document.getElementById("welcome-form");
  els.welcomeName = document.getElementById("welcome-name");
  els.welcomeIncome = document.getElementById("welcome-income");
  els.welcomeSpent = document.getElementById("welcome-spent");
  els.welcomeError = document.getElementById("welcome-error");
  els.historyIncome = document.getElementById("history-income");
  els.historySpent = document.getElementById("history-spent");
  els.historyRemaining = document.getElementById("history-remaining");
  els.historyList = document.getElementById("history-list");
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

  const aiBtn = document.getElementById("get-ai-insight-btn");
  if (aiBtn) {
    aiBtn.addEventListener("click", fetchAiInsights);
  }

  els.incomeInput.addEventListener("input", () => {
    state.budgetIncome = numeric(els.incomeInput.value);
    renderBudget();
    renderDashboard();
    saveState();
  });

  els.autoDivide.addEventListener("click", applySmartSplit);
  els.saveBudget.addEventListener("click", saveBudgetStructure);
  els.addCategoryButton.addEventListener("click", openCategoryDialog);
  els.expenseForm.addEventListener("submit", handleExpenseSubmit);
  els.welcomeForm?.addEventListener("submit", handleWelcomeSubmit);

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
  renderHistory();
  renderWelcome();
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
  renderExpenseCategoryOptions();

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

  const range = document.querySelector(`[data-category-range="${id}"]`);
  const input = document.querySelector(`[data-category-input="${id}"]`);
  const fill = range?.parentElement.querySelector(".range-fill");

  if (range) range.value = value;
  if (input) input.value = value;

  const income = Math.max(1, Number(state.budgetIncome) || 1);
  const width = Math.min((value / income) * 100, 100);
  if (fill) fill.style.width = `${width}%`;

  updateBudgetSummary();
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

function renderExpenseCategoryOptions() {
  if (!els.expenseCategoryOptions) return;

  const categories = [...state.categories];
  if (!categories.some((category) => category.id === "other")) {
    categories.push({ id: "other", name: "Other", icon: "more_horiz" });
  }

  els.expenseCategoryOptions.innerHTML = categories.map((category, index) => {
    const icon = category.icon || "category";
    const checked = category.id === "food" ? "checked" : "";
    return `
      <label>
        <input type="radio" name="expense-category" value="${category.id}" ${checked}>
        <span>
          <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
          ${escapeHtml(category.name)}
        </span>
      </label>
    `;
  }).join("");
}

function applySmartSplit() {
  const income = Math.max(0, Number(state.budgetIncome) || 0);
  if (!income) {
    els.incomeInput.focus();
    showToast("Add your income first", "error");
    return;
  }

  const plan = [
    ["shopping", 0.45],
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

  state.budgetIncome = income;
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

async function handleExpenseSubmit(event) {
  event.preventDefault();
  const amount = numeric(els.amountInput.value);
  const note = els.noteInput.value.trim();

  if (amount <= 0) {
    els.amountError.textContent = "Amount must be greater than zero.";
    return;
  }

  els.amountError.textContent = "";
  const selectedCategory = document.querySelector('input[name="expense-category"]:checked')?.value || "food";

  const submitBtn = event.target.querySelector('button[type="submit"]');

  if (selectedCategory === 'food' && state.dailyFoodLimit && state.dailyFoodLimit > 0) {
    const todayStr = new Date().toDateString();
    const foodSpentToday = state.expenses
      .filter(e => e.category === 'food' && new Date(e.date).toDateString() === todayStr)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    if (foodSpentToday + amount > state.dailyFoodLimit) {
      openDialog(`
        <div style="text-align:center; padding: 8px 0 4px;">
          <span class="material-symbols-outlined" aria-hidden="true" style="font-size: 48px; color: var(--warning, #f59e0b); display:block; margin-bottom: 12px;">restaurant</span>
          <h2 style="margin-bottom: 8px;">Food Budget Alert</h2>
          <p style="color: var(--text-secondary); margin-bottom: 8px;">Adding <strong>₹${amount}</strong> will exceed your daily food budget of <strong>₹${Math.round(state.dailyFoodLimit)}</strong>.</p>
          <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 13px;">Do you still want to proceed?</p>
          <div class="dialog-actions">
            <button class="outline-button" type="button" id="food-warn-cancel">Cancel</button>
            <button class="primary-button" type="button" id="food-warn-proceed" style="background: var(--warning, #f59e0b); border-color: var(--warning, #f59e0b); color: #000;">
              <span class="material-symbols-outlined" aria-hidden="true">check</span>
              Proceed Anyway
            </button>
          </div>
        </div>
      `);

      document.getElementById('food-warn-cancel').addEventListener('click', () => els.dialog.close());
      document.getElementById('food-warn-proceed').addEventListener('click', () => {
        els.dialog.close();
        submitExpenseToAPI(amount, selectedCategory, note, submitBtn);
      });
      return;
    }
  }

  submitExpenseToAPI(amount, selectedCategory, note, submitBtn);
}

async function submitExpenseToAPI(amount, selectedCategory, note, submitBtn) {
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">hourglass_empty</span> Saving...';
  }
  
  const newExpense = {
    id: createId("expense"),
    amount: Number(amount),
    category: selectedCategory,
    note: note || '',
    date: new Date().toISOString()
  };

  try {
    const response = await fetch(`${BASE_URL}/add-expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, category: selectedCategory, note, dailyFoodLimit: state.dailyFoodLimit || 0 })
    });

    if (response.ok) {
      const data = await response.json();
      state.expenses.unshift(data.expense);
      saveState();
      els.amountInput.value = "";
      els.noteInput.value = "";
      renderBudget();
      renderDashboard();
      renderInsights();

      if (data.limitExceeded) {
        showToast("⚠️ Budget Exceeded! You've spent your food budget for today.", "error");
      } else if (data.nearLimit) {
        showToast("⚡ You're close to your daily food budget.", "warning");
      } else {
        showToast("Expense logged", "check_circle");
      }
    } else {
        throw new Error("Failed to add expense");
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    state.expenses.unshift(newExpense);
    saveState();
    els.amountInput.value = "";
    els.noteInput.value = "";
    renderBudget();
    renderDashboard();
    renderInsights();
    
    if (selectedCategory === 'food') {
       const todayStr = new Date().toDateString();
       const foodSpentToday = state.expenses
         .filter(e => e.category === 'food' && new Date(e.date).toDateString() === todayStr)
         .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
       
       if (state.dailyFoodLimit > 0 && foodSpentToday > state.dailyFoodLimit) {
           showToast("⚠️ Budget Exceeded! You've spent your food budget for today.", "error");
       } else if (state.dailyFoodLimit > 0 && foodSpentToday >= state.dailyFoodLimit * 0.8) {
           showToast("⚡ You're close to your daily food budget.", "warning");
       } else {
           showToast("Offline mode: Expense saved locally", "wifi_off");
       }
    } else {
       showToast("Offline mode: Expense saved locally", "wifi_off");
    }
  } finally {
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">add_task</span> Add Expense';
    }
  }
}

function renderDashboard() {
  const spent = totalSpent();
  const total = Number(state.budgetIncome) || 0;
  const remaining = Math.max(0, total - spent);
  const usedPercent = total > 0 ? Math.min((spent / total) * 100, 100) : (spent > 0 ? 100 : 0);

  const categorySpend = getCategorySpendMap();

  els.dashboardTitle.textContent = formatMoney(remaining);
  els.incomeTotalLabel.textContent = `/ ${formatMoney(state.budgetIncome)}`;

  const rawUsedPercent = total > 0 ? (spent / total) * 100 : (spent > 0 ? 100 : 0);
  els.usageChip.textContent = `${Math.round(rawUsedPercent)}% Used`;
  els.monthlyProgress.style.width = `${Math.min(rawUsedPercent, 100)}%`;

  if (rawUsedPercent >= 100) {
    els.monthlyProgress.style.backgroundColor = "var(--error)";
    els.usageChip.style.color = "var(--error)";
    els.usageChip.style.backgroundColor = "var(--error-soft, rgba(239, 68, 68, 0.1))";
    els.usageChip.style.borderColor = "var(--error)";
  } else {
    els.monthlyProgress.style.backgroundColor = "var(--primary)";
    els.usageChip.style.color = "var(--text-secondary)";
    els.usageChip.style.backgroundColor = "transparent";
    els.usageChip.style.borderColor = "var(--border)";
  }

  const todayStr = new Date().toDateString();
  const totalSpentToday = state.expenses
      .filter(e => new Date(e.date).toDateString() === todayStr)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const foodCategoryForLimit = state.categories.find(c => c.id === 'food');
  const foodAllocatedForLimit = foodCategoryForLimit ? Number(foodCategoryForLimit.value) : 0;

  const needsRecalc = state.lastCalculatedDate !== todayStr ||
    (foodAllocatedForLimit > 0 && (!state.dailyFoodLimit || state.dailyFoodLimit === 0));

  if (needsRecalc) {
    const spentBeforeToday = state.expenses
      .filter(e => new Date(e.date).toDateString() !== todayStr)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const remainingStartOfDay = Math.max(0, total - spentBeforeToday);
    const daysLeft = getDaysLeftInMonth();

    state.dailyLimit = remainingStartOfDay / Math.max(1, daysLeft);
    state.mealBudget = state.dailyLimit / 3;

    const foodSpentBeforeToday = state.expenses
      .filter(e => e.category === 'food' && new Date(e.date).toDateString() !== todayStr)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const foodRemainingStartOfDay = Math.max(0, foodAllocatedForLimit - foodSpentBeforeToday);
    state.dailyFoodLimit = foodAllocatedForLimit > 0
      ? (foodRemainingStartOfDay / Math.max(1, daysLeft))
      : state.dailyLimit;

    state.lastCalculatedDate = todayStr;
    saveState();
  }

  els.dailyLimitText.textContent = formatMoney(state.dailyLimit);
  els.perMealText.textContent = formatMoney(state.mealBudget);
  els.mealBudgetText.textContent = formatMoney(state.mealBudget);

  const smartMessageCard = document.querySelector('.smart-message');
  const smartMessageP = smartMessageCard?.querySelector('p');
  const smartMessageIcon = smartMessageCard?.querySelector('.material-symbols-outlined');
  const smartMessageCircle = smartMessageCard?.querySelector('.circle-icon');

  if (els.dailyAlert) {
    const foodCategory = state.categories.find(c => c.id === 'food');
    const foodAllocated = foodCategory ? Number(foodCategory.value) : 0;
    const foodSpent = categorySpend['food'] || 0;

    const foodSpentToday = state.expenses
      .filter(e => e.category === 'food' && new Date(e.date).toDateString() === todayStr)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      
    // Update Daily Food Progress Bar
    const foodProgressFill = document.getElementById("daily-food-progress");
    const foodSpentLabel = document.getElementById("daily-food-spent-label");
    const foodLimitLabel = document.getElementById("daily-food-limit-label");
    if (foodProgressFill && foodSpentLabel && foodLimitLabel) {
       foodSpentLabel.textContent = `Spent: ${formatMoney(foodSpentToday)}`;
       foodLimitLabel.textContent = `Limit: ${formatMoney(state.dailyFoodLimit)}`;
       let pct = state.dailyFoodLimit > 0 ? (foodSpentToday / state.dailyFoodLimit) * 100 : 0;
       foodProgressFill.style.width = `${Math.min(pct, 100)}%`;
       if (pct < 70) foodProgressFill.style.background = "#22c55e"; // Green
       else if (pct <= 100) foodProgressFill.style.background = "#f59e0b"; // Orange
       else foodProgressFill.style.background = "#ef4444"; // Red
    }

    let isOverspent = false;
    let alertTitle = "";
    let alertMsg = "";
    let isWarning = false;

    if (state.dailyLimit > 0 && totalSpentToday >= state.dailyLimit) {
      isOverspent = true;
      alertTitle = "🚨 Daily Spend Limit Exceeded!";
      alertMsg = `You've spent ${formatMoney(totalSpentToday)} today, exceeding your total daily limit of ${formatMoney(state.dailyLimit)}.`;
      if (smartMessageCard && smartMessageP && smartMessageIcon) {
        smartMessageCard.style.backgroundColor = "var(--error-soft, rgba(239, 68, 68, 0.1))";
        smartMessageCard.style.borderColor = "var(--error)";
        smartMessageIcon.textContent = "warning";
        smartMessageIcon.style.color = "var(--error)";
        if (smartMessageCircle) smartMessageCircle.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
        smartMessageP.innerHTML = `<strong>⚠️ Limit Exceeded!</strong> You've spent more than your daily limit.`;
        smartMessageP.style.color = "var(--error)";
      }
    } else if (state.dailyFoodLimit > 0 && foodSpentToday >= state.dailyFoodLimit) {
      isOverspent = true;
      alertTitle = "🍔 Daily Food Budget Exceeded!";
      alertMsg = `You exceeded your daily food budget of ${formatMoney(state.dailyFoodLimit)}. You've spent ${formatMoney(foodSpentToday)} on food today.`;
      if (smartMessageCard && smartMessageP && smartMessageIcon) {
        smartMessageCard.style.backgroundColor = "var(--error-soft, rgba(239, 68, 68, 0.1))";
        smartMessageCard.style.borderColor = "var(--error)";
        smartMessageIcon.textContent = "warning";
        smartMessageIcon.style.color = "var(--error)";
        if (smartMessageCircle) smartMessageCircle.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
        smartMessageP.innerHTML = `<strong>⚠️ Budget Exceeded!</strong> You've spent your food budget for today.`;
        smartMessageP.style.color = "var(--error)";
      }
    } else if (state.dailyLimit > 0 && totalSpentToday >= state.dailyLimit * 0.8) {
       isWarning = true;
       alertTitle = "⚠️ Close to Daily Limit";
       alertMsg = `You've spent ${formatMoney(totalSpentToday)} today, close to your daily limit of ${formatMoney(state.dailyLimit)}.`;
       if (smartMessageCard && smartMessageP && smartMessageIcon) {
        smartMessageCard.style.backgroundColor = "var(--surface)";
        smartMessageCard.style.borderColor = "var(--border)";
        smartMessageIcon.textContent = "warning";
        smartMessageIcon.style.color = "#f59e0b";
        if (smartMessageCircle) smartMessageCircle.style.backgroundColor = "rgba(245, 158, 11, 0.2)";
        smartMessageP.innerHTML = `You are very close to your daily limit. Watch your spending.`;
        smartMessageP.style.color = "#f59e0b";
      }
    } else if (state.dailyFoodLimit > 0 && foodSpentToday >= state.dailyFoodLimit * 0.8) {
       isWarning = true;
       alertTitle = "⚠️ Close to Food Limit";
       alertMsg = `You're close to your daily food limit of ${formatMoney(state.dailyFoodLimit)}.`;
       if (smartMessageCard && smartMessageP && smartMessageIcon) {
        smartMessageCard.style.backgroundColor = "var(--surface)";
        smartMessageCard.style.borderColor = "var(--border)";
        smartMessageIcon.textContent = "warning";
        smartMessageIcon.style.color = "#f59e0b";
        if (smartMessageCircle) smartMessageCircle.style.backgroundColor = "rgba(245, 158, 11, 0.2)";
        smartMessageP.innerHTML = `You are very close to your food limit. Watch your spending.`;
        smartMessageP.style.color = "#f59e0b";
      }
    } else {
      if (foodAllocated > 0 && foodSpent > foodAllocated) {
        isOverspent = true;
        alertTitle = "🍔 Monthly Food Budget Exceeded!";
        alertMsg = `You've spent ${formatMoney(foodSpent)} which is over your ${formatMoney(foodAllocated)} limit.`;
      } else if (remaining < 0) {
        isOverspent = true;
        alertTitle = "Warning: Over monthly budget.";
        alertMsg = "Try reducing your expenses.";
      }

      if (smartMessageCard && smartMessageP && smartMessageIcon) {
        smartMessageCard.style.backgroundColor = "var(--surface)";
        smartMessageCard.style.borderColor = "var(--border)";
        smartMessageIcon.textContent = "smart_toy";
        smartMessageIcon.style.color = "var(--primary)";
        if (smartMessageCircle) smartMessageCircle.style.backgroundColor = "var(--primary-soft)";
        smartMessageP.innerHTML = `"You can spend <strong id="meal-budget-text">${formatMoney(state.mealBudget)}</strong> per meal today"`;
        smartMessageP.style.color = "var(--text-secondary)";
        els.mealBudgetText = document.getElementById("meal-budget-text");
      }
    }

    if (isOverspent || isWarning) {
      els.dailyAlert.style.display = "flex";
      els.dailyAlert.querySelector('h2').textContent = alertTitle;
      els.dailyAlert.querySelector('p').textContent = alertMsg;
      if(isWarning) {
          els.dailyAlert.style.borderLeftColor = "#f59e0b";
          els.dailyAlert.style.color = "#f59e0b";
          els.dailyAlert.style.background = "rgba(245, 158, 11, 0.1)";
      } else {
          els.dailyAlert.style.borderLeftColor = "var(--error)";
          els.dailyAlert.style.color = "var(--error)";
          els.dailyAlert.style.background = "var(--error-bg)";
      }
    } else {
      els.dailyAlert.style.display = "none";
    }
    
    // Smart suggestions block
    const suggestionCard = document.getElementById("smart-suggestion-card");
    const suggestionText = document.getElementById("smart-suggestion-text");
    if (suggestionCard && suggestionText) {
       const affordable = restaurants.filter(r => r.price <= 50);
       if(affordable.length > 0) {
           const pick = affordable[Math.floor(Math.random() * affordable.length)];
           suggestionText.innerHTML = `Try <strong>${pick.name}</strong> from ${pick.location} for just ${formatMoney(pick.price)}.`;
           suggestionCard.style.display = "block";
       } else {
           suggestionCard.style.display = "none";
       }
    }
  }

  renderHistory();
}

function renderHistory() {
  if (!els.historyIncome || !els.historySpent || !els.historyRemaining || !els.historyList) {
    return;
  }

  const income = Math.max(0, Number(state.budgetIncome) || 0);
  const spent = totalSpent();
  const remaining = Math.max(0, income - spent);

  els.historyIncome.textContent = formatMoney(income);
  els.historySpent.textContent = formatMoney(spent);
  els.historyRemaining.textContent = formatMoney(remaining);

  const sortedExpenses = [...state.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  els.historyList.innerHTML = sortedExpenses.length
    ? sortedExpenses.map((expense) => `
      <div class="expense-row history-item">
        <div>
          <strong>${escapeHtml(expense.note || labelForCategory(expense.category))}</strong>
          <span>${labelForCategory(expense.category)} · ${new Date(expense.date).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong>${formatMoney(expense.amount)}</strong>
          <button class="icon-button" onclick="deleteExpense('${expense.id}')" aria-label="Delete expense" style="color: var(--error);">
            <span class="material-symbols-outlined" aria-hidden="true" style="font-size: 20px;">delete</span>
          </button>
        </div>
      </div>
    `).join("")
    : `
      <div class="empty-state-card card" style="text-align: center; padding: 32px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--muted); margin-bottom: 16px; display: block;">receipt_long</span>
        <h3 style="margin-bottom: 8px;">No expenses yet</h3>
        <p style="color: var(--muted);">Start tracking to save money and gain insights.</p>
      </div>
    `;
}

function getDaysLeftInMonth() {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDay.getDate() - today.getDate() + 1;
}

function renderWelcome() {
  if (!els.welcomeIncome || !els.welcomeSpent) {
    return;
  }
  if (els.welcomeName) els.welcomeName.value = state.profileName || "";
  els.welcomeIncome.value = state.budgetIncome ? String(Math.round(state.budgetIncome)) : "";
  els.welcomeSpent.value = state.expenses.length ? String(totalSpent()) : "";
}

function handleWelcomeSubmit(event) {
  event.preventDefault();
  const income = numeric(els.welcomeIncome.value);
  const spent = numeric(els.welcomeSpent.value);
  const name = els.welcomeName ? els.welcomeName.value.trim() : "";

  if (income <= 0) {
    els.welcomeError.textContent = "Please enter your monthly budget.";
    return;
  }

  els.welcomeError.textContent = "";
  state.budgetIncome = income;
  state.profileName = name || "You";
  if (!state.profileColor) state.profileColor = getRandomColor();
  state.page = "home";

  if (spent > 0 && state.expenses.length === 0) {
    state.expenses = [
      {
        id: createId("expense"),
        amount: spent,
        category: "other",
        note: "Already spent this month",
        date: new Date().toISOString()
      }
    ];
  }

  saveState();
  updateProfileUI();
  render();
  setPage("home");
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
  const income = Number(state.budgetIncome) || 0;
  const daysLeft = getDaysLeftInMonth();
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysPassed = Math.max(1, daysInMonth - daysLeft);
  const dailyAvg = spent / daysPassed;
  const projectedMonthly = dailyAvg * daysInMonth;
  const usedPercent = income > 0 ? (spent / income) * 100 : 0;
  const projectedPercent = income > 0 ? (projectedMonthly / income) * 100 : 0;

  if (usedPercent >= 100) {
    els.burnHeading.textContent = "Over Budget!";
    els.burnSummary.innerHTML = `You've spent <strong>${formatMoney(spent)}</strong> — that's <strong>${Math.round(usedPercent)}%</strong> of your monthly budget. Reduce spending immediately.`;
  } else if (projectedPercent > 100) {
    els.burnHeading.textContent = "⚠️ On Track to Overspend";
    els.burnSummary.innerHTML = `At your current rate of <strong>${formatMoney(Math.round(dailyAvg))}/day</strong>, you'll spend <strong>${formatMoney(Math.round(projectedMonthly))}</strong> this month — exceeding your budget.`;
  } else if (usedPercent > 70) {
    els.burnHeading.textContent = "Careful pace.";
    els.burnSummary.innerHTML = `You've used <strong>${Math.round(usedPercent)}%</strong> of your budget with ${daysLeft} days remaining. Spend <strong>${formatMoney(Math.round(dailyAvg))}/day</strong> on average.`;
  } else {
    els.burnHeading.textContent = "Looking good.";
    els.burnSummary.innerHTML = `You've spent <strong>${formatMoney(spent)}</strong> so far. Daily average: <strong>${formatMoney(Math.round(dailyAvg))}</strong>. Projected monthly: <strong>${formatMoney(Math.round(projectedMonthly))}</strong>.`;
  }

  renderMonthlyChart();

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

function renderMonthlyChart() {
  const chartEl = document.getElementById('monthly-chart');
  const legendEl = document.getElementById('monthly-chart-legend');
  if (!chartEl || !legendEl) return;

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const dailyMap = {};
  state.expenses.forEach(e => {
    const d = new Date(e.date);
    if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
      const day = d.getDate();
      dailyMap[day] = (dailyMap[day] || 0) + Number(e.amount);
    }
  });

  const maxVal = Math.max(...Object.values(dailyMap), 1);
  const income = Number(state.budgetIncome) || 0;
  const dailyBudget = income > 0 ? income / daysInMonth : 0;

  let barsHtml = '';
  for (let d = 1; d <= daysInMonth; d++) {
    const val = dailyMap[d] || 0;
    const heightPct = Math.min((val / maxVal) * 100, 100);
    const isToday = d === today.getDate();
    const isOver = dailyBudget > 0 && val > dailyBudget;
    const color = isOver ? 'var(--error)' : isToday ? 'var(--primary)' : 'var(--primary-soft)';
    const opacity = d > today.getDate() ? '0.25' : '1';
    barsHtml += `
      <div class="chart-bar-wrap" title="Day ${d}: ${formatMoney(val)}">
        <div class="chart-bar" style="height:${heightPct}%;background:${color};opacity:${opacity};"></div>
        ${isToday ? `<span class="chart-day-label" style="color:var(--primary);font-weight:700;">${d}</span>` : (d % 5 === 0 ? `<span class="chart-day-label">${d}</span>` : '<span class="chart-day-label"></span>')}
      </div>`;
  }

  chartEl.innerHTML = barsHtml;

  if (dailyBudget > 0 && maxVal > 0) {
    const lineTop = 100 - Math.min((dailyBudget / maxVal) * 100, 100);
    chartEl.style.position = 'relative';
    const existing = chartEl.querySelector('.budget-line');
    if (existing) existing.remove();
    const line = document.createElement('div');
    line.className = 'budget-line';
    line.style.cssText = `position:absolute;left:0;right:0;top:${lineTop}%;border-top:1.5px dashed var(--primary);pointer-events:none;`;
    chartEl.appendChild(line);
  }

  legendEl.innerHTML = `
    <span style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-secondary);">
      <span style="width:10px;height:10px;border-radius:2px;background:var(--primary);display:inline-block;"></span> Today
    </span>
    <span style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-secondary);">
      <span style="width:10px;height:10px;border-radius:2px;background:var(--error);display:inline-block;"></span> Over daily budget
    </span>
    ${dailyBudget > 0 ? `<span style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text-secondary);"><span style="width:10px;border-top:1.5px dashed var(--primary);display:inline-block;"></span> Daily limit</span>` : ''}
  `;
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
    .filter((restaurant) => activeFilter === "nearest" || restaurant.tags.includes(activeFilter) || restaurant.location === activeFilter)
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
  const mediaContent = restaurant.icon 
    ? `<div style="width: 100%; height: 160px; background-color: ${restaurant.bgColor}; display: flex; align-items: center; justify-content: center; border-radius: 12px 12px 0 0;">
         <span class="material-symbols-outlined" style="font-size: 72px; color: rgba(0,0,0,0.5);">${restaurant.icon}</span>
       </div>`
    : `<img src="${restaurant.image}" alt="${escapeHtml(restaurant.alt)}" loading="lazy">`;

  return `
    <article class="restaurant-card" tabindex="0" role="button" data-restaurant="${restaurant.id}" aria-label="Open ${escapeHtml(restaurant.name)} details">
      <div class="restaurant-media">
        ${mediaContent}
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
    showToast(`${restaurant.name} logged locally`, "restaurant");
  });
}

function getInitials(name) {
  if (!name) return "UP";
  const parts = name.trim().split(" ");
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getRandomColor() {
   const colors = ['#006876', '#8d4f00', '#283593', '#ba1a1a', '#006064', '#6a1b9a', '#e65100'];
   return colors[Math.floor(Math.random() * colors.length)];
}

function openProfileDialog() {
  const profileName = state.profileName || 'You';
  const profileIcon = state.profileIcon || 'person';
  const avatarIcons = ['person', 'account_circle', 'star', 'favorite', 'bolt', 'diamond', 'rocket_launch', 'psychology', 'eco', 'local_fire_department'];

  openDialog(`
    <div style="text-align:center; margin-bottom: 16px;">
      <div id="profile-avatar-preview" style="width:72px;height:72px;border-radius:50%;background:var(--primary-soft);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;">
        <span class="material-symbols-outlined" style="font-size:40px;color:var(--primary);">${profileIcon}</span>
      </div>
      <h2 style="margin-bottom: 4px;">Edit Profile</h2>
    </div>

    <label class="modal-input" style="margin-bottom:12px;">
      <span class="eyebrow">Your Name</span>
      <input id="profile-name-input" type="text" maxlength="24" placeholder="Your name" value="${escapeHtml(profileName)}" style="width:100%;">
    </label>

    <div style="margin-bottom: 20px;">
      <span class="eyebrow" style="display:block;margin-bottom:8px;">Choose Icon</span>
      <div id="profile-icon-picker" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
        ${avatarIcons.map(icon => `
          <button type="button" class="icon-button profile-icon-option" data-icon="${icon}"
            style="width:44px;height:44px;border-radius:50%;border:2px solid ${icon === profileIcon ? 'var(--primary)' : 'var(--border)'};background:${icon === profileIcon ? 'var(--primary-soft)' : 'transparent'};">
            <span class="material-symbols-outlined" style="font-size:24px;color:${icon === profileIcon ? 'var(--primary)' : 'var(--text-secondary)'}">${icon}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="dialog-actions">
      <button class="outline-button" type="button" data-dialog-cancel>Cancel</button>
      <button class="primary-button" type="button" id="save-profile-btn">
        <span class="material-symbols-outlined" aria-hidden="true">check</span>
        Save
      </button>
    </div>
  `);

  document.querySelector("[data-dialog-cancel]").addEventListener("click", () => els.dialog.close());

  let selectedIcon = profileIcon;
  document.getElementById('profile-icon-picker').addEventListener('click', (e) => {
    const btn = e.target.closest('.profile-icon-option');
    if (!btn) return;
    selectedIcon = btn.dataset.icon;
    document.querySelectorAll('.profile-icon-option').forEach(b => {
      const isSelected = b.dataset.icon === selectedIcon;
      b.style.borderColor = isSelected ? 'var(--primary)' : 'var(--border)';
      b.style.background = isSelected ? 'var(--primary-soft)' : 'transparent';
      b.querySelector('span').style.color = isSelected ? 'var(--primary)' : 'var(--text-secondary)';
    });
    document.getElementById('profile-avatar-preview').innerHTML =
      `<span class="material-symbols-outlined" style="font-size:40px;color:var(--primary);">${selectedIcon}</span>`;
  });

  document.getElementById('save-profile-btn').addEventListener('click', () => {
    const newName = document.getElementById('profile-name-input').value.trim() || 'You';
    state.profileName = newName;
    state.profileIcon = selectedIcon;
    if(!state.profileColor) state.profileColor = getRandomColor();
    saveState();
    els.dialog.close();
    showToast('Profile updated', 'check_circle');
    updateProfileUI();
  });
}

function updateProfileUI() {
  const profileIcon = state.profileIcon || 'person';
  const profileBtn = document.querySelector("[data-action='profile'] .material-symbols-outlined");
  const profileInitials = document.querySelector(".profile-initials");
  const profileButtonWrapper = document.querySelector(".profile-button");
  
  if(state.profileName && profileInitials) {
      if(profileBtn) profileBtn.style.display = "none";
      profileInitials.textContent = getInitials(state.profileName);
      profileInitials.style.display = "inline-block";
      if(state.profileColor) {
         profileButtonWrapper.style.backgroundColor = state.profileColor;
         profileButtonWrapper.style.color = "#ffffff";
         profileButtonWrapper.style.border = "none";
      }
  } else {
      if(profileBtn) {
         profileBtn.textContent = profileIcon;
         profileBtn.style.display = "inline-block";
      }
      if(profileInitials) profileInitials.style.display = "none";
  }
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
    { key: "shopping", label: "Shopping", value: 0 },
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
    shopping: { color: "var(--category-shopping-color)", bg: "var(--category-shopping-bg)" },
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

function getCategorySpendMap() {
  const map = {};
  state.expenses.forEach(exp => {
    map[exp.category] = (map[exp.category] || 0) + exp.amount;
  });
  return map;
}

async function fetchExpenses() {
  try {
    const response = await fetch(`${BASE_URL}/expenses`);
    if (response.ok) {
      const serverExpenses = await response.json();
      if (serverExpenses.length >= state.expenses.length || state.expenses.length === 0) {
          state.expenses = serverExpenses;
          saveState();
      }
      if(isOffline) {
          isOffline = false;
          showToast("Reconnected to server", "wifi");
      }
    } else {
        throw new Error("Failed to load");
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
    if(!isOffline) {
        showToast("Offline mode active. Using local storage.", "wifi_off");
        isOffline = true;
    }
  }
}

function getSmartInsights() {
  const foodSpend = getCategorySpendMap()['food'] || 0;
  const total = totalSpent();
  const income = Number(state.budgetIncome) || 0;
  
  let insights = [];
  
  if (total > 0) {
    const foodPercent = Math.round((foodSpend / total) * 100);
    insights.push(`You spent ${foodPercent}% on food this month.`);
    
    if (foodPercent > 35) {
       insights.push(`You can save around ₹${Math.round(foodSpend * 0.2)}/month by reducing outside food by 20%.`);
    } else {
       insights.push("Great job keeping your food spending in check!");
    }
  } else {
      insights.push("Add some expenses to get tailored AI insights.");
  }
  
  const daysLeft = getDaysLeftInMonth();
  if (income > 0) {
     const remaining = income - total;
     if (remaining > 0) {
        insights.push(`You have ₹${remaining} left to safely spend over the next ${daysLeft} days.`);
     } else {
        insights.push(`You are over budget by ₹${Math.abs(remaining)}. Limit all non-essential spending.`);
     }
  }
  
  return insights;
}

async function fetchAiInsights() {
  const resultDiv = document.getElementById("ai-insight-result");
  const totalEl = document.getElementById("ai-total-spending");
  const msgEl = document.getElementById("ai-smart-message");
  const btn = document.getElementById("get-ai-insight-btn");

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">hourglass_empty</span> Analyzing...`;
  }

  try {
    const insights = getSmartInsights();
    totalEl.textContent = formatMoney(totalSpent());
    msgEl.innerHTML = insights.map(i => `<div style="margin-bottom: 8px;">• ${i}</div>`).join('');
    resultDiv.style.display = "block";
    showToast("Smart Insights generated", "auto_awesome");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span> Get AI Insight`;
    }
  }
}

function deleteExpense(id) {
  openDialog(`
    <div style="text-align:center; padding: 8px 0 4px;">
      <span class="material-symbols-outlined" aria-hidden="true" style="font-size: 48px; color: var(--error); display:block; margin-bottom: 12px;">delete_forever</span>
      <h2 style="margin-bottom: 8px;">Delete Expense?</h2>
      <p style="color: var(--text-secondary); margin-bottom: 24px;">This action cannot be undone.</p>
      <div class="dialog-actions">
        <button class="outline-button" type="button" data-dialog-cancel>Cancel</button>
        <button class="primary-button" type="button" id="confirm-delete-btn" style="background: var(--error); border-color: var(--error);">
          <span class="material-symbols-outlined" aria-hidden="true">delete</span>
          Delete
        </button>
      </div>
    </div>
  `);

  document.querySelector("[data-dialog-cancel]").addEventListener("click", () => els.dialog.close());

  document.getElementById("confirm-delete-btn").addEventListener("click", async () => {
    els.dialog.close();
    try {
      const response = await fetch(`${BASE_URL}/delete/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        state.expenses = state.expenses.filter(e => e.id !== id);
        saveState();
        renderBudget();
        renderDashboard();
        renderInsights();
        showToast("Expense deleted", "delete");
      } else {
        throw new Error("Failed to delete via API");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      state.expenses = state.expenses.filter(e => e.id !== id);
      saveState();
      renderBudget();
      renderDashboard();
      renderInsights();
      showToast("Offline: Expense removed locally", "delete");
    }
  });
}