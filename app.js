const STORAGE_KEY = "digitalClubhouseState:v1";
const SHARE_PARAM = "crew";

const routes = [
  { id: "home", label: "Home", icon: "home" },
  { id: "expenses", label: "Tab", icon: "payments" },
  { id: "plans", label: "Plans", icon: "event" },
  { id: "members", label: "Members", icon: "groups" },
  { id: "wrapped", label: "Wrapped", icon: "auto_awesome" },
  { id: "gallery", label: "Snaps", icon: "photo_library" },
];

const people = [
  { id: "you", name: "You", avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Nova&backgroundColor=bd00ff" },
  { id: "alex", name: "Alex", avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Alex&backgroundColor=ecb2ff" },
  { id: "sam", name: "Sam", avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Sam&backgroundColor=00e0ff" },
  { id: "jordan", name: "Jordan", avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Jordan&backgroundColor=ff4f9a" },
  { id: "mike", name: "Mike", avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Mike&backgroundColor=87f7c5" },
  { id: "sarah", name: "Sarah", avatar: "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Sarah&backgroundColor=ffd166" },
];

const defaultState = {
  activeRoute: "home",
  selectedSlot: "fri-9",
  userVote: "bowling",
  notificationsOpen: false,
  nicknames: {},
  notifications: [
    { icon: "event_available", title: "Friday is winning", body: "4 people are free at 9 PM." },
    { icon: "payments", title: "New split added", body: "Mike added Late Night Slice." },
    { icon: "photo_camera", title: "Beach Day landed", body: "3 new photos were added to the gallery." },
  ],
  hangouts: [
    {
      id: "h1",
      title: "Smash Bros Tourney",
      emoji: "🎮",
      day: "Wednesday",
      time: "7:00 PM",
      location: "Alex's basement",
      attendees: ["alex", "sam", "mike"],
      description: "Double elimination, snacks mandatory, bragging rights eternal.",
    },
    {
      id: "h2",
      title: "Pizza & Code",
      emoji: "🍕",
      day: "Thursday",
      time: "6:00 PM",
      location: "WhatScenes table",
      attendees: ["you", "sarah"],
      description: "Side projects, slices, and one very dramatic deploy.",
    },
    {
      id: "h3",
      title: "Jam Session",
      emoji: "🎸",
      day: "Saturday",
      time: "2:00 PM",
      location: "Garage room",
      attendees: ["jordan"],
      description: "Bring picks, cables, and a song you secretly over-practiced.",
    },
  ],
  votes: [
    { id: "sushi", label: "Sushi Feast", emoji: "🍣", voters: ["sarah"] },
    { id: "bowling", label: "Midnight Bowling", emoji: "🎳", voters: ["you", "alex", "sam"] },
    { id: "games", label: "Game Night", emoji: "🎮", voters: [] },
  ],
  expenses: [
    { id: "e1", title: "Late Night Slice", emoji: "🍕", amount: 45, paidBy: "mike", splitWith: ["you", "alex", "sam", "mike"], date: "2026-04-24" },
    { id: "e2", title: "Uber from Club", emoji: "🚕", amount: 22.5, paidBy: "you", splitWith: ["you", "sarah"], date: "2026-04-25" },
    { id: "e3", title: "Concert Tix", emoji: "🎟️", amount: 120, paidBy: "alex", splitWith: ["you", "alex", "jordan"], date: "2026-04-22" },
  ],
  memories: [
    {
      id: "m1",
      title: "Beach Day",
      tag: "Latest Snap",
      description: "The sunscreen economy collapsed by 3 PM.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1100&q=80",
      likes: 12,
    },
    {
      id: "m2",
      title: "Quick Drink Incident",
      tag: "Top Memory",
      description: "A 45-minute plan became a four-hour lore event.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1100&q=80",
      likes: 27,
    },
    {
      id: "m3",
      title: "Rooftop Pizza",
      tag: "Food Archive",
      description: "Technically dinner, spiritually a group therapy session.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1100&q=80",
      likes: 18,
    },
  ],
};

let state = loadState();

const app = document.querySelector("#app");
const mobileNav = document.querySelector(".mobile-nav");
const desktopNav = document.querySelector(".desktop-nav");
const modalBackdrop = document.querySelector("[data-modal]");
const modalBody = document.querySelector("#modal-body");
const modalTitle = document.querySelector("#modal-title");
const modalKicker = document.querySelector("#modal-kicker");
const notificationPanel = document.querySelector(".notification-panel");
const toastStack = document.querySelector(".toast-stack");
const dateTimePill = document.querySelector("[data-current-datetime]");

document.addEventListener("DOMContentLoaded", () => {
  renderNavigation();
  renderNotifications();
  renderDateTime();
  setInterval(renderDateTime, 30000);

  setTimeout(() => {
    navigate(state.activeRoute || "home", { replace: true });
  }, 450);

  document.body.addEventListener("click", handleClick);
  document.body.addEventListener("submit", handleSubmit);
  document.body.addEventListener("change", handleChange);
  window.addEventListener("keydown", handleKeydown);
});

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const loadedState = stored ? { ...structuredClone(defaultState), ...stored } : structuredClone(defaultState);
    const sharedNicknames = readSharedNicknames();

    if (sharedNicknames) {
      loadedState.nicknames = sharedNicknames;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedState));
    }

    return loadedState;
  } catch {
    const fallbackState = structuredClone(defaultState);
    const sharedNicknames = readSharedNicknames();
    if (sharedNicknames) fallbackState.nicknames = sharedNicknames;
    return fallbackState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function handleClick(event) {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    navigate(routeButton.dataset.route);
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;
  const id = actionTarget.dataset.id;

  const actions = {
    "open-profile": () => openProfileModal(),
    "toggle-notifications": () => toggleNotifications(),
    "close-modal": () => closeModal(),
    "new-hangout": () => openHangoutModal(),
    "new-expense": () => openExpenseModal(),
    "new-memory": () => openMemoryModal(),
    "new-vote": () => openVoteModal(),
    "edit-nickname": () => openNicknameModal(id),
    "clear-nickname": () => clearNickname(id),
    "share-nicknames": () => shareNicknames(),
    "vote-option": () => voteFor(id),
    "select-slot": () => selectSlot(id),
    "toggle-rsvp": () => toggleRsvp(id),
    "edit-expense": () => openExpenseModal(id),
    "delete-expense": () => deleteExpense(id),
    "like-memory": () => likeMemory(id),
    "share-wrapped": () => shareWrapped(),
    "reset-demo": () => resetDemo(),
  };

  actions[action]?.();
}

async function handleSubmit(event) {
  const form = event.target.closest("form[data-form]");
  if (!form) return;

  event.preventDefault();
  const handlers = {
    hangout: saveHangout,
    expense: saveExpense,
    memory: saveMemory,
    vote: saveVote,
    nickname: saveNickname,
  };

  await handlers[form.dataset.form]?.(form);
}

function handleChange(event) {
  const input = event.target.closest("[data-image-input]");
  if (!input) return;

  const file = input.files?.[0];
  const preview = input.closest(".image-upload-zone")?.querySelector("[data-image-preview]");
  if (!file || !preview) return;

  preview.style.backgroundImage = `url("${URL.createObjectURL(file)}")`;
  preview.classList.add("has-image");
}

function handleKeydown(event) {
  if (event.key === "Escape") closeModal();
}

function navigate(routeId, options = {}) {
  state.activeRoute = routes.some((route) => route.id === routeId) ? routeId : "home";
  state.notificationsOpen = false;
  saveState();
  renderNavigation();
  renderNotifications();

  const renderers = {
    home: renderHome,
    expenses: renderExpenses,
    plans: renderPlans,
    members: renderMembers,
    wrapped: renderWrapped,
    gallery: renderGallery,
  };

  app.innerHTML = renderers[state.activeRoute]();
  app.focus({ preventScroll: true });

}

function renderNavigation() {
  const navHtml = routes
    .map(
      (route) => `
        <button class="nav-item ${state.activeRoute === route.id ? "is-active" : ""}" type="button" data-route="${route.id}" aria-label="${route.label}">
          <span class="material-symbols-outlined">${route.icon}</span>
          <span class="desktop-label">${route.label}</span>
        </button>
      `
    )
    .join("");

  mobileNav.innerHTML = navHtml;
  desktopNav.innerHTML = navHtml;
}

function renderNotifications() {
  notificationPanel.classList.toggle("is-open", state.notificationsOpen);
  notificationPanel.innerHTML = state.notifications
    .map(
      (item) => `
        <article class="notification-card">
          <span class="emoji-token"><span class="material-symbols-outlined">${item.icon}</span></span>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p class="muted">${escapeHtml(item.body)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderDateTime() {
  if (!dateTimePill) return;
  dateTimePill.innerHTML = `
    <span class="material-symbols-outlined">schedule</span>
    <span>${escapeHtml(getLiveDateTimeLabel())}</span>
  `;
}

function renderHome() {
  const totals = calculateExpenseTotals();
  const upcoming = state.hangouts[0];
  const latestMemory = state.memories[0];

  return `
    <section class="page">
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">WhatScenes</p>
          <h1>The Basement <span class="gradient-text">is live.</span></h1>
          <p class="lede">Plan the weekend, split the damage, vote on the vibe, and keep the group memories in one fast little social cockpit.</p>
          <span class="badge blue">
            <span class="material-symbols-outlined">today</span>
            ${escapeHtml(getFullTodayLabel())}
          </span>
          <div class="hero-actions">
            <button class="primary-button" type="button" data-action="new-hangout">
              <span class="material-symbols-outlined">add</span>
              New hangout
            </button>
            <button class="ghost-button" type="button" data-route="wrapped">
              <span class="material-symbols-outlined">auto_awesome</span>
              See wrapped
            </button>
            <button class="ghost-button" type="button" data-route="members">
              <span class="material-symbols-outlined">groups</span>
              Members
            </button>
          </div>
        </div>

        <article class="glass-card metric-card">
          <span class="badge purple">Tonight's pulse</span>
          <div>
            <span class="metric-icon"><span class="material-symbols-outlined">event_available</span></span>
            <p class="metric-value">${escapeHtml(upcoming?.emoji || "✨")} ${escapeHtml(upcoming?.title || "No plans yet")}</p>
            <p class="metric-label">${upcoming ? `${escapeHtml(upcoming.day)} at ${escapeHtml(upcoming.time)} · ${escapeHtml(upcoming.location)}` : "Create a hangout to wake this up."}</p>
          </div>
        </article>
      </div>

      <section class="section">
        <div class="stats-grid">
          ${metricCard("event_seat", state.hangouts.length, "Active plans", "purple")}
          ${metricCard("how_to_vote", totalVotes(), "Votes cast", "blue")}
          ${metricCard("payments", formatMoney(Math.abs(totals.youOwe)), totals.youOwe > 0 ? "You owe" : "You are owed", totals.youOwe > 0 ? "pink" : "green")}
          ${metricCard("favorite", state.memories.reduce((sum, memory) => sum + memory.likes, 0), "Memory likes", "green")}
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>What's happening this week?</h2>
            <p>Tap a card to RSVP. The lineup stays saved in your browser.</p>
          </div>
          <button class="pill-button" type="button" data-action="new-hangout">
            <span class="material-symbols-outlined">add</span>
            Add
          </button>
        </div>
        ${renderHangoutList(state.hangouts)}
      </section>

      <section class="section dashboard-grid">
        <article class="memory-card" style="background-image: url('${latestMemory?.image || ""}')">
          <span class="badge blue">${escapeHtml(latestMemory?.tag || "Latest snap")}</span>
          <h3>${escapeHtml(latestMemory?.title || "No snaps yet")}</h3>
          <p>${escapeHtml(latestMemory?.description || "Add a memory to fill the wall.")}</p>
        </article>

        <article class="glass-card">
          <div class="row-between">
            <div>
              <p class="eyebrow">Decision engine</p>
              <h2>${escapeHtml(getWinningVote()?.label || "No votes yet")}</h2>
            </div>
            <span class="emoji-token">${escapeHtml(getWinningVote()?.emoji || "✨")}</span>
          </div>
          <p class="lede">Current winner from the live vibe poll.</p>
          <div class="stack" style="margin-top: 16px;">
            ${renderVoteCards(true)}
          </div>
        </article>
      </section>
    </section>
  `;
}

function renderPlans() {
  return `
    <section class="page">
      <div class="section-header">
        <div>
          <p class="eyebrow">Hangout decider</p>
          <h1>The Move</h1>
          <p>Lock in the plan without the group chat archaeology. Updated ${escapeHtml(getLiveDateTimeLabel())}.</p>
        </div>
        <button class="primary-button" type="button" data-action="new-hangout">
          <span class="material-symbols-outlined">add</span>
          Plan
        </button>
      </div>

      <section class="section plan-board">
        <article class="glass-card">
          <div class="section-header">
            <div>
              <h2>Availability</h2>
              <p>Pick the best slot. Your choice is remembered.</p>
            </div>
            <span class="badge blue">This week</span>
          </div>
          <div class="availability-grid" style="margin-top: 18px;">
            ${renderSlots()}
          </div>
          <div class="glass-card" style="margin-top: 14px; background: rgba(0, 224, 255, 0.08);">
            <div class="row-between">
              <p style="margin: 0;"><strong>Best read:</strong> Friday at 9 PM has the cleanest overlap.</p>
              <span class="material-symbols-outlined" style="color: var(--blue);">auto_awesome</span>
            </div>
          </div>
        </article>

        <article class="glass-card">
          <div class="section-header">
            <div>
              <h2>What's the vibe?</h2>
              <p>${totalVotes()} votes cast</p>
            </div>
            <button class="pill-button" type="button" data-action="new-vote">
              <span class="material-symbols-outlined">add</span>
              Idea
            </button>
          </div>
          <div class="stack" style="margin-top: 16px;">
            ${renderVoteCards()}
          </div>
        </article>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <h2>Plans on deck</h2>
            <p>RSVP directly from the cards.</p>
          </div>
        </div>
        ${renderHangoutList(state.hangouts)}
      </section>
    </section>
  `;
}

function renderExpenses() {
  const totals = calculateExpenseTotals();
  const friendBalances = calculateFriendBalances();
  const sortedExpenses = [...state.expenses].sort((a, b) => b.date.localeCompare(a.date));

  return `
    <section class="page">
      <div class="section-header">
        <div>
          <p class="eyebrow">Expense tracker</p>
          <h1>The Damage</h1>
          <p>Settle up so the next pizza order can happen in peace.</p>
        </div>
        <button class="primary-button" type="button" data-action="new-expense">
          <span class="material-symbols-outlined">add</span>
          Expense
        </button>
      </div>

      <section class="section expense-layout">
        <div class="stack">
          <article class="glass-card expense-total">
            <span class="badge ${totals.youOwe > 0 ? "pink" : "green"}">Your tab</span>
            <div class="money ${totals.youOwe > 0 ? "negative" : "positive"}">${totals.youOwe > 0 ? "-" : "+"}${formatMoney(Math.abs(totals.youOwe))}</div>
            <p class="muted">${totals.youOwe > 0 ? "You owe the crew." : "The crew owes you."}</p>
            <div class="mini-people">
              ${renderBalanceChips(friendBalances)}
            </div>
          </article>

          <article class="glass-card">
            <div class="section-header">
              <div>
                <h2>Spending pulse</h2>
                <p>Biggest bars are the priciest hangout days.</p>
              </div>
            </div>
            <div class="chart" aria-label="Spending chart">
              ${renderChartBars()}
            </div>
          </article>
        </div>

        <article class="glass-card">
          <div class="section-header">
            <div>
              <h2>Recent drops</h2>
              <p>${state.expenses.length} saved transactions</p>
            </div>
          </div>
          <div class="transaction-list" style="margin-top: 16px;">
            ${
              sortedExpenses.length
                ? sortedExpenses.map(renderTransaction).join("")
                : emptyState("No expenses yet", "Add your first split and the balances will appear here.")
            }
          </div>
        </article>
      </section>
    </section>
  `;
}

function renderMembers() {
  const friends = people.filter((person) => person.id !== "you");
  const nicknamedCount = friends.filter((person) => state.nicknames?.[person.id]).length;
  const friendBalances = calculateFriendBalances();
  const mostMissed = getMostMissedMember();

  return `
    <section class="page">
      <div class="section-header">
        <div>
          <p class="eyebrow">Group members</p>
          <h1>The Crew</h1>
          <p>Add friend nicknames once and they will show up across plans, expenses, and wrapped.</p>
        </div>
        <span class="badge blue">${nicknamedCount}/${friends.length} nicknamed</span>
      </div>

      <section class="section members-grid">
        ${friends.map((person) => renderMemberCard(person, friendBalances[person.id] || 0, mostMissed?.id === person.id ? mostMissed.missed : 0)).join("")}
      </section>

      <section class="section">
        <article class="glass-card">
          <div class="row-between">
            <div>
              <p class="eyebrow">Shared crew labels</p>
              <h2>Make nicknames visible for everyone</h2>
              <p class="muted">Copy a crew link and send it to the group. Anyone who opens it imports these nicknames into their browser.</p>
            </div>
            <button class="primary-button" type="button" data-action="share-nicknames">
              <span class="material-symbols-outlined">link</span>
              Copy crew link
            </button>
          </div>
        </article>
      </section>
    </section>
  `;
}

function renderMemberCard(person, balance = 0, mostMissedCount = 0) {
  const nickname = state.nicknames?.[person.id]?.trim();
  const missedCount = getMissedCount(person.id);
  const signedBalance = getSignedBalanceLabel(balance);
  return `
    <article class="member-card">
      <div class="member-main">
        <img src="${person.avatar}" alt="${person.name} avatar">
        <div>
          <div class="member-badges">
            <span class="badge ${nickname ? "green" : "purple"}">${nickname ? "Nickname set" : "Original name"}</span>
            ${mostMissedCount > 0 ? `<span class="badge pink">Most missed</span>` : ""}
          </div>
          <h2>${escapeHtml(nickname || person.name)}</h2>
          <p class="muted">${nickname ? `Real name: ${escapeHtml(person.name)}` : "Tap edit to add a nickname."}</p>
        </div>
      </div>
      <div class="member-stats">
        <div class="member-stat">
          <span>Money</span>
          <strong class="${signedBalance.className}">${signedBalance.text}</strong>
          <small>${signedBalance.helper}</small>
        </div>
        <div class="member-stat">
          <span>Missed</span>
          <strong>${missedCount}</strong>
          <small>${missedCount === 1 ? "plan skipped" : "plans skipped"}</small>
        </div>
      </div>
      <div class="member-actions">
        <button class="primary-button" type="button" data-action="edit-nickname" data-id="${person.id}">
          <span class="material-symbols-outlined">edit</span>
          ${nickname ? "Edit" : "Add nickname"}
        </button>
        ${
          nickname
            ? `<button class="ghost-button" type="button" data-action="clear-nickname" data-id="${person.id}">
                <span class="material-symbols-outlined">backspace</span>
                Clear
              </button>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderWrapped() {
  const totals = calculateExpenseTotals();
  const mostActive = [...people].sort((a, b) => countAppearances(b.id, state.hangouts, "attendees") - countAppearances(a.id, state.hangouts, "attendees"))[0];
  const mostActiveDisplay = getPerson(mostActive.id);
  const biggestExpense = [...state.expenses].sort((a, b) => b.amount - a.amount)[0];
  const topMemory = [...state.memories].sort((a, b) => b.likes - a.likes)[0];

  return `
    <section class="page">
      <div class="hero-copy" style="text-align: center; max-width: 760px; margin: 0 auto;">
        <p class="eyebrow">Friend wrapped</p>
        <h1>The Group Chat <span class="gradient-text">Exposed.</span></h1>
        <p class="lede" style="margin-inline: auto;">A month of attendance, expenses, decisions, and memories distilled into suspiciously shiny awards.</p>
        <div class="hero-actions" style="justify-content: center;">
          <button class="primary-button" type="button" data-action="share-wrapped">
            <span class="material-symbols-outlined">ios_share</span>
            Share wrapped
          </button>
        </div>
      </div>

      <section class="section wrapped-layout">
        <div class="wrapped-grid">
          <article class="glass-card wrapped-card">
            <img src="${mostActive.avatar}" alt="${mostActive.name} avatar">
            <span class="badge purple">Most active</span>
            <h2>${mostActiveDisplay.name}</h2>
            <p class="muted">${countAppearances(mostActive.id, state.hangouts, "attendees")} plans attended</p>
          </article>

          <article class="glass-card wrapped-card">
            <span class="emoji-token">💸</span>
            <span class="badge blue">Biggest spend</span>
            <h2>${biggestExpense ? formatMoney(biggestExpense.amount) : "$0.00"}</h2>
            <p class="muted">${biggestExpense ? escapeHtml(biggestExpense.title) : "No expenses yet"}</p>
          </article>

          <article class="glass-card wrapped-card">
            <span class="emoji-token">🎳</span>
            <span class="badge green">Winning vibe</span>
            <h2>${escapeHtml(getWinningVote()?.label || "No vote")}</h2>
            <p class="muted">${totalVotes()} total votes</p>
          </article>

          <article class="glass-card wrapped-card">
            <span class="emoji-token">🧾</span>
            <span class="badge pink">Your balance</span>
            <h2>${totals.youOwe > 0 ? "-" : "+"}${formatMoney(Math.abs(totals.youOwe))}</h2>
            <p class="muted">${totals.youOwe > 0 ? "Payback era" : "Collector era"}</p>
          </article>
        </div>

        <article class="memory-card" style="background-image: url('${topMemory?.image || ""}')">
          <span class="badge blue">${escapeHtml(topMemory?.tag || "Top memory")}</span>
          <h2>${escapeHtml(topMemory?.title || "Add a memory")}</h2>
          <p>${escapeHtml(topMemory?.description || "Your most-liked memory will show up here.")}</p>
        </article>
      </section>
    </section>
  `;
}

function renderGallery() {
  return `
    <section class="page">
      <div class="section-header">
        <div>
          <p class="eyebrow">Photo wall</p>
          <h1>Snaps</h1>
          <p>Memory cards with saved like counts and quick-add support.</p>
        </div>
        <button class="primary-button" type="button" data-action="new-memory">
          <span class="material-symbols-outlined">add_a_photo</span>
          Memory
        </button>
      </div>

      <section class="section gallery-grid">
        ${
          state.memories.length
            ? state.memories.map(renderMemoryCard).join("")
            : emptyState("No memories yet", "Add a photo memory and the wall will brighten up.")
        }
      </section>

      <section class="section">
        <article class="glass-card">
          <div class="row-between">
            <div>
              <p class="eyebrow">Demo controls</p>
              <h2>Start fresh</h2>
              <p class="muted">Resets saved localStorage data to the original demo state.</p>
            </div>
            <button class="ghost-button" type="button" data-action="reset-demo">
              <span class="material-symbols-outlined">restart_alt</span>
              Reset
            </button>
          </div>
        </article>
      </section>
    </section>
  `;
}

function metricCard(icon, value, label, color = "purple") {
  return `
    <article class="glass-card metric-card">
      <span class="metric-icon" style="background: ${colorBackground(color)};">
        <span class="material-symbols-outlined">${icon}</span>
      </span>
      <div>
        <p class="metric-value">${value}</p>
        <p class="metric-label">${label}</p>
      </div>
    </article>
  `;
}

function renderHangoutList(hangouts) {
  if (!hangouts.length) return emptyState("No plans yet", "Create a hangout and invite the crew.");

  return `
    <div class="horizontal-list">
      ${hangouts.map(renderHangoutCard).join("")}
    </div>
  `;
}

function renderHangoutCard(hangout) {
  const isGoing = hangout.attendees.includes("you");
  return `
    <article class="event-card">
      <div class="row-between">
        <span class="emoji-token">${escapeHtml(hangout.emoji)}</span>
        <span class="badge ${isGoing ? "green" : "purple"}">${isGoing ? "You're in" : "RSVP"}</span>
      </div>
      <div>
        <h3>${escapeHtml(hangout.title)}</h3>
        <p class="muted">${escapeHtml(hangout.description)}</p>
      </div>
      <div class="event-meta">
        <span>${escapeHtml(hangout.day)} · ${escapeHtml(hangout.time)}</span>
        <span>${escapeHtml(hangout.location)}</span>
      </div>
      <div class="row-between">
        ${avatarStack(hangout.attendees)}
        <button class="pill-button" type="button" data-action="toggle-rsvp" data-id="${hangout.id}">
          <span class="material-symbols-outlined">${isGoing ? "person_remove" : "person_add"}</span>
          ${isGoing ? "Leave" : "Join"}
        </button>
      </div>
    </article>
  `;
}

function renderSlots() {
  const slots = [
    { id: "wed-7", day: "Wed", time: "7 PM", count: 1 },
    { id: "thu-8", day: "Thu", time: "8 PM", count: 2 },
    { id: "fri-9", day: "Fri", time: "9 PM", count: 4 },
    { id: "sat-2", day: "Sat", time: "2 PM", count: 2 },
    { id: "sun-5", day: "Sun", time: "5 PM", count: 0 },
  ];

  return slots
    .map(
      (slot) => `
        <button class="slot ${state.selectedSlot === slot.id ? "is-selected" : ""}" type="button" data-action="select-slot" data-id="${slot.id}">
          <strong>${slot.day}</strong>
          <span>${slot.time}</span>
          <span>${slot.count || "No"} free</span>
        </button>
      `
    )
    .join("");
}

function renderVoteCards(compact = false) {
  const total = Math.max(totalVotes(), 1);
  const winner = getWinningVote()?.id;

  if (!state.votes.length) return emptyState("No ideas yet", "Suggest an idea and let the crew vote.");

  return state.votes
    .map((vote) => {
      const percent = Math.round((vote.voters.length / total) * 100);
      const hasYourVote = state.userVote === vote.id;
      return `
        <button class="vote-card card-button ${winner === vote.id ? "is-winning" : ""}" type="button" data-action="vote-option" data-id="${vote.id}">
          <div class="row-between">
            <div class="row-between" style="justify-content: flex-start;">
              <span class="emoji-token">${escapeHtml(vote.emoji)}</span>
              <div>
                <h3>${escapeHtml(vote.label)}</h3>
                <p class="muted">${vote.voters.length} vote${vote.voters.length === 1 ? "" : "s"} ${hasYourVote ? "· your pick" : ""}</p>
              </div>
            </div>
            ${compact ? "" : avatarStack(vote.voters)}
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="--width: ${percent}%"></div>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderBalanceChips(friendBalances) {
  const chips = Object.entries(friendBalances)
    .map(([id, amount]) => ({ person: getPerson(id), amount }))
    .filter(({ amount }) => Math.abs(amount) > 0.01);

  if (!chips.length) return `<p class="muted">All settled. A rare and beautiful condition.</p>`;

  return chips
    .map(
      ({ person, amount }) => `
        <div class="person-chip">
          <img src="${person.avatar}" alt="${person.name} avatar">
          <strong>${person.name}</strong>
          <p class="${amount > 0 ? "money-positive" : "money-negative"}">${amount > 0 ? "+" : "-"}${formatMoney(Math.abs(amount))}</p>
          <p class="muted">${amount > 0 ? "collect from them" : "you owe them"}</p>
        </div>
      `
    )
    .join("");
}

function renderChartBars() {
  const daily = {};
  state.expenses.forEach((expense) => {
    const day = new Date(expense.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
    daily[day] = (daily[day] || 0) + Number(expense.amount);
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const max = Math.max(...Object.values(daily), 1);

  return days
    .map((day) => {
      const value = daily[day] || 0;
      const height = Math.max(12, Math.round((value / max) * 100));
      return `<div class="bar ${value === max && value > 0 ? "is-hot" : ""}" style="--height: ${height}%" title="${day}: ${formatMoney(value)}"></div>`;
    })
    .join("");
}

function renderTransaction(expense) {
  const payer = getPerson(expense.paidBy);
  return `
    <article class="expense-card transaction">
      <span class="emoji-token">${escapeHtml(expense.emoji)}</span>
      <div>
        <h3>${escapeHtml(expense.title)}</h3>
        <p class="muted">${payer.name} paid · ${expense.splitWith.length} people · ${formatDate(expense.date)}</p>
      </div>
      <div class="row-between" style="gap: 10px;">
        <strong>${formatMoney(expense.amount)}</strong>
        <div class="transaction-actions">
          <button class="tiny-button" type="button" data-action="edit-expense" data-id="${expense.id}" aria-label="Edit ${escapeHtml(expense.title)}">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="tiny-button" type="button" data-action="delete-expense" data-id="${expense.id}" aria-label="Delete ${escapeHtml(expense.title)}">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderMemoryCard(memory) {
  return `
    <article class="memory-card" style="background-image: url('${memory.image}')">
      <span class="badge blue">${escapeHtml(memory.tag)}</span>
      <h2>${escapeHtml(memory.title)}</h2>
      <p>${escapeHtml(memory.description)}</p>
      <div class="row-between">
        <span class="memory-meta">${memory.likes} likes</span>
        <button class="pill-button" type="button" data-action="like-memory" data-id="${memory.id}">
          <span class="material-symbols-outlined">favorite</span>
          Like
        </button>
      </div>
    </article>
  `;
}

function avatarStack(ids) {
  const uniqueIds = [...new Set(ids)].slice(0, 4);
  if (!uniqueIds.length) return `<div class="avatar-stack"><span>+</span></div>`;

  const extra = Math.max(0, ids.length - uniqueIds.length);
  return `
    <div class="avatar-stack" aria-label="${ids.length} attendees">
      ${uniqueIds.map((id) => `<img src="${getPerson(id).avatar}" alt="${getPerson(id).name} avatar">`).join("")}
      ${extra ? `<span>+${extra}</span>` : ""}
    </div>
  `;
}

function openHangoutModal() {
  openModal({
    kicker: "New plan",
    title: "Create hangout",
    body: `
      <form class="form" data-form="hangout">
        <div class="form-grid">
          ${field("title", "Title", "text", "Movie Night", true)}
          ${field("emoji", "Emoji", "text", "🍿", true)}
          ${field("day", "Day", "text", "Friday", true)}
          ${field("time", "Time", "text", "8:00 PM", true)}
        </div>
        ${field("location", "Location", "text", "The Basement", true)}
        <div class="field">
          <label for="description">Description</label>
          <textarea id="description" name="description" placeholder="What should everyone know?"></textarea>
        </div>
        <div class="modal-actions">
          <button class="ghost-button" type="button" data-action="close-modal">Cancel</button>
          <button class="primary-button" type="submit">
            <span class="material-symbols-outlined">add</span>
            Save plan
          </button>
        </div>
      </form>
    `,
  });
}

function openExpenseModal(id) {
  const expense = state.expenses.find((item) => item.id === id);
  openModal({
    kicker: expense ? "Edit split" : "New split",
    title: expense ? "Update expense" : "Add expense",
    body: `
      <form class="form" data-form="expense" data-id="${expense?.id || ""}">
        <div class="form-grid">
          ${field("title", "Title", "text", expense?.title || "Pizza Fund", true)}
          ${field("emoji", "Emoji", "text", expense?.emoji || "🍕", true)}
          ${field("amount", "Amount", "number", expense?.amount || "24", true, "0.01")}
          ${field("date", "Date", "date", expense?.date || getLocalDateInputValue(), true)}
        </div>
        <div class="form-grid">
          ${selectField("paidBy", "Paid by", people, expense?.paidBy || "you")}
          ${selectField("splitPreset", "Split with", [
            { id: "all", name: "Everyone" },
            { id: "core", name: "You, Alex, Sam" },
            { id: "two", name: "You and Sarah" },
          ], "all")}
        </div>
        <div class="modal-actions">
          <button class="ghost-button" type="button" data-action="close-modal">Cancel</button>
          <button class="primary-button" type="submit">
            <span class="material-symbols-outlined">payments</span>
            ${expense ? "Update" : "Add"} expense
          </button>
        </div>
      </form>
    `,
  });
}

function openMemoryModal() {
  openModal({
    kicker: "New snap",
    title: "Add memory",
    body: `
      <form class="form" data-form="memory">
        <div class="form-grid">
          ${field("title", "Title", "text", "Arcade Night", true)}
          ${field("tag", "Tag", "text", "New memory", true)}
        </div>
        <div class="field">
          <label for="imageFile">Image</label>
          <div class="image-upload-zone">
            <input id="imageFile" name="imageFile" type="file" accept="image/*" data-image-input required />
            <div class="image-upload-preview" data-image-preview>
              <span class="material-symbols-outlined">add_a_photo</span>
              <strong>Choose from gallery</strong>
              <small>PNG, JPG, or WebP</small>
            </div>
          </div>
        </div>
        <div class="field">
          <label for="description">Caption</label>
          <textarea id="description" name="description" placeholder="The one-line lore summary"></textarea>
        </div>
        <div class="modal-actions">
          <button class="ghost-button" type="button" data-action="close-modal">Cancel</button>
          <button class="primary-button" type="submit">
            <span class="material-symbols-outlined">add_a_photo</span>
            Save memory
          </button>
        </div>
      </form>
    `,
  });
}

function openVoteModal() {
  openModal({
    kicker: "New idea",
    title: "Suggest a vibe",
    body: `
      <form class="form" data-form="vote">
        <div class="form-grid">
          ${field("label", "Idea", "text", "Karaoke Night", true)}
          ${field("emoji", "Emoji", "text", "🎤", true)}
        </div>
        <div class="modal-actions">
          <button class="ghost-button" type="button" data-action="close-modal">Cancel</button>
          <button class="primary-button" type="submit">
            <span class="material-symbols-outlined">how_to_vote</span>
            Add idea
          </button>
        </div>
      </form>
    `,
  });
}

function openNicknameModal(id) {
  const person = people.find((item) => item.id === id);
  if (!person) return;

  openModal({
    kicker: "Member nickname",
    title: `Name ${person.name}`,
    body: `
      <form class="form" data-form="nickname" data-id="${person.id}">
        <article class="glass-card">
          <div class="member-main">
            <img src="${person.avatar}" alt="${person.name} avatar">
            <div>
              <p class="eyebrow">Original name</p>
              <h2>${escapeHtml(person.name)}</h2>
              <p class="muted">Leave the nickname blank to go back to the original name.</p>
            </div>
          </div>
        </article>
        ${field("nickname", "Nickname", "text", state.nicknames?.[person.id] || "", false)}
        <div class="modal-actions">
          <button class="ghost-button" type="button" data-action="close-modal">Cancel</button>
          <button class="primary-button" type="submit">
            <span class="material-symbols-outlined">badge</span>
            Save nickname
          </button>
        </div>
      </form>
    `,
  });
}

function openProfileModal() {
  const totals = calculateExpenseTotals();
  openModal({
    kicker: "Profile",
    title: "Nova's WhatScenes",
    body: `
      <article class="profile-panel glass-card">
        <div class="row-between">
          <div>
            <h2>Nova</h2>
            <p class="muted">Host, planner, and keeper of receipts.</p>
          </div>
          <img src="${getPerson("you").avatar}" alt="Nova avatar" style="width: 86px; height: 86px; border-radius: 50%;">
        </div>
        <div class="stats-grid" style="margin-top: 16px;">
          ${metricCard("event", state.hangouts.filter((hangout) => hangout.attendees.includes("you")).length, "RSVPs", "purple")}
          ${metricCard("payments", `${totals.youOwe > 0 ? "-" : "+"}${formatMoney(Math.abs(totals.youOwe))}`, "Balance", "blue")}
        </div>
      </article>
    `,
  });
}

function openModal({ kicker, title, body }) {
  modalKicker.textContent = kicker;
  modalTitle.textContent = title;
  modalBody.innerHTML = body;
  modalBackdrop.hidden = false;
  modalBackdrop.querySelector("input, textarea, select, button")?.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  modalBody.innerHTML = "";
}

function saveHangout(form) {
  const data = Object.fromEntries(new FormData(form));
  if (!validateRequired(form, ["title", "emoji", "day", "time", "location"])) return;

  state.hangouts.unshift({
    id: crypto.randomUUID(),
    title: data.title.trim(),
    emoji: data.emoji.trim(),
    day: data.day.trim(),
    time: data.time.trim(),
    location: data.location.trim(),
    attendees: ["you"],
    description: data.description?.trim() || "Fresh plan, details still loading.",
  });

  persistAndRefresh("Plan created", "event_available");
}

function saveExpense(form) {
  const data = Object.fromEntries(new FormData(form));
  if (!validateRequired(form, ["title", "emoji", "amount", "date"])) return;

  const amount = Number(data.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    setFieldError(form.elements.amount, "Enter an amount greater than zero.");
    return;
  }

  const splitPresets = {
    all: people.map((person) => person.id),
    core: ["you", "alex", "sam"],
    two: ["you", "sarah"],
  };

  const expense = {
    id: form.dataset.id || crypto.randomUUID(),
    title: data.title.trim(),
    emoji: data.emoji.trim(),
    amount,
    paidBy: data.paidBy,
    splitWith: splitPresets[data.splitPreset] || splitPresets.all,
    date: data.date,
  };

  state.expenses = form.dataset.id
    ? state.expenses.map((item) => (item.id === expense.id ? expense : item))
    : [expense, ...state.expenses];

  persistAndRefresh(form.dataset.id ? "Expense updated" : "Expense added", "payments");
}

async function saveMemory(form) {
  const data = Object.fromEntries(new FormData(form));
  if (!validateRequired(form, ["title", "tag", "imageFile"])) return;

  const file = form.elements.imageFile.files?.[0];
  if (!file?.type?.startsWith("image/")) {
    setFieldError(form.elements.imageFile, "Choose an image file.");
    return;
  }

  let image;
  try {
    image = await compressImageFile(file);
  } catch {
    setFieldError(form.elements.imageFile, "Could not read that image. Try another one.");
    return;
  }

  state.memories.unshift({
    id: crypto.randomUUID(),
    title: data.title.trim(),
    tag: data.tag.trim(),
    image,
    description: data.description?.trim() || "A new chapter in the archive.",
    likes: 0,
  });

  persistAndRefresh("Memory added", "photo_camera");
}

function saveVote(form) {
  const data = Object.fromEntries(new FormData(form));
  if (!validateRequired(form, ["label", "emoji"])) return;

  const vote = {
    id: slugify(data.label),
    label: data.label.trim(),
    emoji: data.emoji.trim(),
    voters: ["you"],
  };

  state.votes = state.votes.map((item) => ({
    ...item,
    voters: item.voters.filter((voter) => voter !== "you"),
  }));
  state.votes.push(vote);
  state.userVote = vote.id;

  persistAndRefresh("Idea added and voted", "how_to_vote");
}

function saveNickname(form) {
  const id = form.dataset.id;
  const person = people.find((item) => item.id === id);
  if (!person) return;

  const data = Object.fromEntries(new FormData(form));
  const nickname = data.nickname.trim();
  state.nicknames = state.nicknames || {};

  if (nickname) {
    state.nicknames[id] = nickname;
  } else {
    delete state.nicknames[id];
  }

  persistAndRefresh(nickname ? `${person.name} is now ${nickname}` : `${person.name}'s nickname cleared`, "badge");
}

function validateRequired(form, names) {
  let valid = true;
  names.forEach((name) => {
    const fieldElement = form.elements[name];
    const value = fieldElement?.value?.trim();
    clearFieldError(fieldElement);
    if (!value) {
      setFieldError(fieldElement, "This field is required.");
      valid = false;
    }
  });
  return valid;
}

function setFieldError(fieldElement, message) {
  if (!fieldElement) return;
  clearFieldError(fieldElement);
  const error = document.createElement("span");
  error.className = "field-error";
  error.textContent = message;
  fieldElement.setAttribute("aria-invalid", "true");
  fieldElement.parentElement.append(error);
}

function clearFieldError(fieldElement) {
  if (!fieldElement) return;
  fieldElement.removeAttribute("aria-invalid");
  fieldElement.parentElement.querySelector(".field-error")?.remove();
}

function persistAndRefresh(message, icon) {
  closeModal();
  state.notifications.unshift({ icon, title: message, body: "Saved locally in your browser." });
  saveState();
  navigate(state.activeRoute, { replace: true });
  showToast(message, icon);
}

function voteFor(id) {
  if (state.userVote === id) {
    showToast("That is already your pick", "how_to_vote");
    return;
  }

  state.votes = state.votes.map((vote) => ({
    ...vote,
    voters: vote.id === id
      ? [...new Set([...vote.voters, "you"])]
      : vote.voters.filter((voter) => voter !== "you"),
  }));
  state.userVote = id;
  state.notifications.unshift({ icon: "how_to_vote", title: "Vote updated", body: `${getVote(id)?.label || "Your pick"} is now your vote.` });
  saveState();
  navigate(state.activeRoute, { replace: true });
  showToast("Vote updated", "how_to_vote");
}

function selectSlot(id) {
  state.selectedSlot = id;
  saveState();
  navigate(state.activeRoute, { replace: true });
  showToast("Availability saved", "event_available");
}

function toggleRsvp(id) {
  const hangout = state.hangouts.find((item) => item.id === id);
  if (!hangout) return;

  const isGoing = hangout.attendees.includes("you");
  hangout.attendees = isGoing
    ? hangout.attendees.filter((attendee) => attendee !== "you")
    : [...hangout.attendees, "you"];

  state.notifications.unshift({
    icon: "event",
    title: isGoing ? "RSVP removed" : "RSVP added",
    body: `${hangout.title} was updated.`,
  });

  saveState();
  navigate(state.activeRoute, { replace: true });
  showToast(isGoing ? "You left the plan" : "You're in", "event");
}

function deleteExpense(id) {
  const expense = state.expenses.find((item) => item.id === id);
  if (!expense) return;

  state.expenses = state.expenses.filter((item) => item.id !== id);
  state.notifications.unshift({ icon: "delete", title: "Expense deleted", body: expense.title });
  saveState();
  navigate(state.activeRoute, { replace: true });
  showToast("Expense deleted", "delete");
}

function clearNickname(id) {
  const person = people.find((item) => item.id === id);
  if (!person || !state.nicknames?.[id]) return;

  delete state.nicknames[id];
  state.notifications.unshift({ icon: "badge", title: "Nickname cleared", body: `${person.name} is back to their original name.` });
  saveState();
  navigate(state.activeRoute, { replace: true });
  showToast("Nickname cleared", "badge");
}

async function shareNicknames() {
  const activeNicknames = Object.fromEntries(
    Object.entries(state.nicknames || {}).filter(([, nickname]) => nickname.trim())
  );

  if (!Object.keys(activeNicknames).length) {
    showToast("Add a nickname first", "badge");
    return;
  }

  const link = buildNicknameShareLink(activeNicknames);

  if (navigator.share) {
    try {
      await navigator.share({
        title: "WhatScenes crew nicknames",
        text: "Open this link to use the same friend nicknames in WhatScenes.",
        url: link,
      });
      showToast("Crew link shared", "ios_share");
      return;
    } catch {
      // User cancelled native share.
    }
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(link);
  } else {
    window.prompt("Copy this crew link:", link);
  }
  showToast("Crew link copied", "content_copy");
}

function likeMemory(id) {
  const memory = state.memories.find((item) => item.id === id);
  if (!memory) return;
  memory.likes += 1;
  saveState();
  navigate(state.activeRoute, { replace: true });
  showToast("Memory liked", "favorite");
}

async function shareWrapped() {
  const text = `WhatScenes Wrapped as of ${getLiveDateTimeLabel()}: ${totalVotes()} votes, ${state.hangouts.length} plans, ${state.memories.length} memories.`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "WhatScenes Wrapped", text });
      showToast("Shared wrapped", "ios_share");
      return;
    } catch {
      // User cancelled native share.
    }
  }

  await navigator.clipboard?.writeText(text);
  showToast("Wrapped copied", "content_copy");
}

function resetDemo() {
  state = structuredClone(defaultState);
  saveState();
  navigate("home", { replace: true });
  showToast("Demo reset", "restart_alt");
}

function toggleNotifications() {
  state.notificationsOpen = !state.notificationsOpen;
  saveState();
  renderNotifications();
}

function calculateExpenseTotals() {
  const balances = Object.fromEntries(people.map((person) => [person.id, 0]));

  state.expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    const share = amount / expense.splitWith.length;
    balances[expense.paidBy] += amount;
    expense.splitWith.forEach((personId) => {
      balances[personId] -= share;
    });
  });

  return {
    balances,
    youOwe: -balances.you,
  };
}

function calculateFriendBalances() {
  const balances = Object.fromEntries(
    people.filter((person) => person.id !== "you").map((person) => [person.id, 0])
  );

  state.expenses.forEach((expense) => {
    const amount = Number(expense.amount);
    const share = amount / expense.splitWith.length;

    if (expense.paidBy === "you") {
      expense.splitWith
        .filter((personId) => personId !== "you")
        .forEach((personId) => {
          balances[personId] = (balances[personId] || 0) + share;
        });
      return;
    }

    if (expense.splitWith.includes("you")) {
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) - share;
    }
  });

  return balances;
}

function getSignedBalanceLabel(amount) {
  if (Math.abs(amount) < 0.01) {
    return { text: "$0.00", helper: "settled", className: "money-neutral" };
  }

  return amount > 0
    ? { text: `+${formatMoney(amount)}`, helper: "collect from them", className: "money-positive" }
    : { text: `-${formatMoney(Math.abs(amount))}`, helper: "you owe them", className: "money-negative" };
}

function getMissedCount(personId) {
  return state.hangouts.filter((hangout) => !hangout.attendees.includes(personId)).length;
}

function getMostMissedMember() {
  return people
    .filter((person) => person.id !== "you")
    .map((person) => ({ ...person, missed: getMissedCount(person.id) }))
    .sort((a, b) => b.missed - a.missed)[0];
}

function totalVotes() {
  return state.votes.reduce((sum, vote) => sum + vote.voters.length, 0);
}

function getWinningVote() {
  return [...state.votes].sort((a, b) => b.voters.length - a.voters.length)[0];
}

function getVote(id) {
  return state.votes.find((vote) => vote.id === id);
}

function getRoute(id) {
  return routes.find((route) => route.id === id) || routes[0];
}

function getPerson(id) {
  const person = people.find((item) => item.id === id) || people[0];
  const nickname = state.nicknames?.[person.id]?.trim();
  return nickname ? { ...person, name: nickname, originalName: person.name } : person;
}

function readSharedNicknames() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(SHARE_PARAM);
  if (!encoded) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(atob(encoded)));
    const validIds = new Set(people.map((person) => person.id));
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([id, nickname]) => validIds.has(id) && typeof nickname === "string" && nickname.trim())
        .map(([id, nickname]) => [id, nickname.trim().slice(0, 32)])
    );
  } catch {
    return null;
  }
}

function buildNicknameShareLink(nicknames) {
  const url = new URL(window.location.href);
  const encoded = btoa(encodeURIComponent(JSON.stringify(nicknames)));
  url.searchParams.set(SHARE_PARAM, encoded);
  return url.toString();
}

function countAppearances(id, list, key) {
  return list.reduce((count, item) => count + (item[key]?.includes(id) ? 1 : 0), 0);
}

function showToast(message, icon = "check_circle") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="emoji-token"><span class="material-symbols-outlined">${icon}</span></span>
    <strong>${escapeHtml(message)}</strong>
  `;
  toastStack.append(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(16px)";
    setTimeout(() => toast.remove(), 220);
  }, 2400);
}

function emptyState(title, description) {
  return `
    <div class="empty-state">
      <span class="material-symbols-outlined">auto_awesome</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function field(name, label, type, value = "", required = false, step = "") {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}" type="${type}" value="${escapeHtml(String(value))}" ${required ? "required" : ""} ${step ? `step="${step}"` : ""} />
    </div>
  `;
}

function selectField(name, label, options, selected) {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <select id="${name}" name="${name}">
        ${options
          .map((option) => {
            const label = people.some((person) => person.id === option.id) ? getPerson(option.id).name : option.name;
            return `<option value="${option.id}" ${option.id === selected ? "selected" : ""}>${label}</option>`;
          })
          .join("")}
      </select>
    </div>
  `;
}

function colorBackground(color) {
  const colors = {
    purple: "rgba(189, 0, 255, 0.17)",
    blue: "rgba(0, 224, 255, 0.14)",
    pink: "rgba(255, 79, 154, 0.14)",
    green: "rgba(135, 247, 197, 0.12)",
  };
  return colors[color] || colors.purple;
}

function getLiveDateTimeLabel(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getFullTodayLabel(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxSize = 1200;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}

function formatDate(value) {
  return new Date(value + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function slugify(value) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "idea"}-${Date.now().toString(36)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
