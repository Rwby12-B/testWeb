/* ─────────────────────────────────────────
   ТОХЬ РЕСТОРАН — Frontend App JS
   ───────────────────────────────────────── */

const API = 'https://testweb-7eph.onrender.com'; // Same origin — relative paths

/* ── EMOJI MAP for menu items ── */
const MENU_EMOJIS = {
  khuushuur: '🥟',
  steak:     '🥩',
  soup:      '🍲',
  tsuivan:   '🍜',
  salad:     '🥗',
  tea:       '🍵',
};

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

/* ── NAVBAR scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MOBILE NAV TOGGLE ── */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
// Close on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

/* ── SMOOTH ANCHOR NAVIGATION ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── INTERSECTION OBSERVER for reveal animations ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function addReveal(selector, delay = 0) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${delay + i * 0.1}s`;
    revealObserver.observe(el);
  });
}

/* ── FORMAT PRICE ── */
function formatPrice(price) {
  return new Intl.NumberFormat('mn-MN').format(price) + '₮';
}

/* ── FORMAT DATE ── */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ── STAR RENDERER ── */
function renderStars(rating) {
  return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
}

/* ═══════════════════════════════════════
   MENU
═══════════════════════════════════════ */
let allMenuItems = [];

async function loadMenu() {
  const grid = document.getElementById('menuGrid');
  try {
    const res = await fetch(`${API}/api/menu`);
    const json = await res.json();

    if (!json.success) throw new Error(json.message);
    allMenuItems = json.data;
    renderMenu(allMenuItems);
    setupFilters();
  } catch (err) {
    grid.innerHTML = `<div class="menu-loading"><p style="color:var(--c-red)">Цэс ачаалахад алдаа гарлаа. Дахин оролдоно уу.</p></div>`;
    console.error('Menu load error:', err);
  }
}

function renderMenu(items) {
  const grid = document.getElementById('menuGrid');
  if (items.length === 0) {
    grid.innerHTML = `<div class="menu-loading"><p>Энэ ангилалд хоол байхгүй байна.</p></div>`;
    return;
  }
  grid.innerHTML = items.map((item, i) => `
    <div class="menu-card" style="animation-delay:${i * 0.08}s">
      <div class="menu-card-img">
        <span class="menu-emoji">${MENU_EMOJIS[item.image] || '🍽️'}</span>
        ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
      </div>
      <div class="menu-card-body">
        <div class="menu-category">${item.category}</div>
        <h3 class="menu-name">${item.name}</h3>
        <p class="menu-desc">${item.description}</p>
        <div class="menu-footer">
          <div class="menu-price">${formatPrice(item.price)}</div>
          <button class="menu-order-btn" onclick="document.getElementById('takeawayModal').hidden = false">
            Захиалах
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Reveal animation for newly rendered cards
  document.querySelectorAll('.menu-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity .4s ease, transform .4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const filtered = filter === 'all'
        ? allMenuItems
        : allMenuItems.filter(item => item.category === filter);
      renderMenu(filtered);
    });
  });
}

/* ═══════════════════════════════════════
   REVIEWS
═══════════════════════════════════════ */
async function loadReviews() {
  const grid = document.getElementById('reviewsGrid');
  try {
    const res = await fetch(`${API}/api/reviews`);
    const json = await res.json();

    if (!json.success) throw new Error(json.message);
    renderReviews(json.data);
  } catch (err) {
    grid.innerHTML = `<div class="menu-loading"><p style="color:var(--c-red)">Үнэлгээ ачаалахад алдаа гарлаа.</p></div>`;
    console.error('Reviews load error:', err);
  }
}

function renderReviews(reviews) {
  const grid = document.getElementById('reviewsGrid');
  grid.innerHTML = reviews.map((r, i) => `
    <div class="review-card" style="animation-delay:${i * 0.1}s">
      <div class="review-header">
        <div class="review-avatar">${r.avatar}</div>
        <div class="review-meta">
          <div class="review-author">${r.author}</div>
          <div class="review-date">${formatDate(r.date)}</div>
        </div>
        <div class="review-stars">${renderStars(r.rating)}</div>
      </div>
      <p class="review-text">${r.text}</p>
      ${r.verified ? `<div class="review-verified">✓ Баталгаажсан зочин</div>` : ''}
    </div>
  `).join('');

  document.querySelectorAll('.review-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity .4s ease, transform .4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 80);
  });
}

/* ═══════════════════════════════════════
   RESERVATION FORM
═══════════════════════════════════════ */
// Set minimum date to today
const dateInput = document.getElementById('res-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// Guest counter
const guestInput = document.getElementById('res-guests');
document.getElementById('guestMinus').addEventListener('click', () => {
  const v = parseInt(guestInput.value);
  if (v > 1) guestInput.value = v - 1;
});
document.getElementById('guestPlus').addEventListener('click', () => {
  const v = parseInt(guestInput.value);
  if (v < 20) guestInput.value = v + 1;
});

// Form validation helpers
function setError(fieldId, msg) {
  const el = document.getElementById(`err-${fieldId}`);
  if (el) el.textContent = msg;
}
function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.getElementById('formErrorGeneral').textContent = '';
}

function validateForm(data) {
  let valid = true;
  if (!data.name || data.name.trim().length < 2) {
    setError('name', 'Нэрээ оруулна уу (2+ тэмдэгт).');
    valid = false;
  }
  if (!data.phone || !/^[\d\s\+\-\(\)]{7,15}$/.test(data.phone)) {
    setError('phone', 'Зөв утасны дугаар оруулна уу.');
    valid = false;
  }
  if (!data.date) {
    setError('date', 'Огноо сонгоно уу.');
    valid = false;
  }
  if (!data.time) {
    setError('time', 'Цаг сонгоно уу.');
    valid = false;
  }
  if (!data.guests || data.guests < 1 || data.guests > 20) {
    setError('guests', '1-20 хоорондох тоо оруулна уу.');
    valid = false;
  }
  return valid;
}

document.getElementById('reservationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const form = e.target;
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');

  const data = {
    name:   form.name.value,
    phone:  form.phone.value,
    email:  form.email.value,
    date:   form.date.value,
    time:   form.time.value,
    guests: parseInt(form.guests.value),
    notes:  form.notes.value,
  };

  if (!validateForm(data)) return;

  // Loading state
  submitBtn.disabled = true;
  submitText.hidden = true;
  submitSpinner.hidden = false;
  submitSpinner.textContent = 'Илгээж байна…';

  try {
    const res = await fetch(`${API}/api/reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (json.success) {
      document.getElementById('formFields').hidden = true;
      const successEl = document.getElementById('formSuccess');
      successEl.hidden = false;
      successEl.style.animation = 'fadeUp .5s ease';
    } else {
      if (json.errors) {
        json.errors.forEach(err => {
          document.getElementById('formErrorGeneral').textContent = err;
        });
      } else {
        document.getElementById('formErrorGeneral').textContent = json.message || 'Алдаа гарлаа.';
      }
      submitBtn.disabled = false;
      submitText.hidden = false;
      submitSpinner.hidden = true;
    }
  } catch (err) {
    document.getElementById('formErrorGeneral').textContent = 'Холболтын алдаа. Дахин оролдоно уу.';
    submitBtn.disabled = false;
    submitText.hidden = false;
    submitSpinner.hidden = true;
    console.error('Reservation error:', err);
  }
});

/* ═══════════════════════════════════════
   MODAL (Takeaway)
═══════════════════════════════════════ */
document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('takeawayModal').hidden = true;
});
document.getElementById('takeawayModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.hidden = true;
});

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
  loadReviews();

  // Reveal animations for sections
  setTimeout(() => {
    addReveal('.about-inner > *', 0);
    addReveal('.contact-card', 0);
    addReveal('.stat', 0);
  }, 100);
});
