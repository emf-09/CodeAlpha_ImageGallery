// ============================================================
//  MY IMAGE GALLERY — script.js (Professional Version)
// ============================================================

const images = [
  // 🌿 Nature
  { src: 'images/snow-mountains.webp',  title: 'Snow Mountain',    cat: 'nature'       },
  { src: 'images/waterfall.webp',      title: 'Forest Waterfall', cat: 'nature'       },
  { src: 'images/sunset-ocean.webp',   title: 'Ocean Sunset',     cat: 'nature'       },
  { src: 'images/starry-night.webp',   title: 'Starry Night',     cat: 'nature'       },

  // 🏛 Architecture
  { src: 'images/skyscraper.webp',     title: 'Glass Tower',      cat: 'architecture' },
  { src: 'images/castle.webp',         title: 'Old Castle',       cat: 'architecture' },
  { src: 'images/spiral-stairs.webp',  title: 'Spiral Stairs',    cat: 'architecture' },

  // 🦊 Animals
  { src: 'images/wolf.webp',           title: 'Wild Wolf',        cat: 'animals'      },
  { src: 'images/tiger.webp',          title: 'Tiger Closeup',    cat: 'animals'      },
  { src: 'images/owl.webp',            title: 'Snowy Owl',        cat: 'animals'      },

  // 🎨 Abstract
  { src: 'images/paint-splash.webp',   title: 'Color Splash',     cat: 'abstract'     },
  { src: 'images/neon-lights.webp',    title: 'Neon Trails',      cat: 'abstract'     },
];

// ── State ──
let activeList = [...images];
let currentIndex = 0;
let isAnimating = false;

// ── Elements ──
const gallery    = document.getElementById('gallery');
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lb-img');
const lbCaption  = document.getElementById('lb-caption');
const lbCounter  = document.getElementById('lb-counter');
const lbCatBadge = document.getElementById('lb-cat-badge');

// ── Render gallery ──
function render(list) {
  activeList = list;
  gallery.innerHTML = '';

  const emptyMsg = document.getElementById('empty-msg');
  if (list.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';

  const countEl = document.getElementById('gallery-count');
  if (countEl) countEl.textContent = list.length + ' photos';

  list.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Open ${img.title}`);
    item.style.animationDelay = `${i * 0.08}s`;

    item.innerHTML = `
      <img
        src="${img.src}"
        alt="${img.title}"
        loading="lazy"
        onerror="this.parentElement.classList.add('img-error')"
      />
      <div class="overlay">
        <div class="overlay-cat">${img.cat}</div>
        <div class="overlay-title">${img.title}</div>
      </div>
    `;

    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });

    gallery.appendChild(item);
  });
}

// ── Open lightbox ──
function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lb-close').focus();
}

// ── Close lightbox ──
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Update lightbox content ──
function updateLightbox() {
  if (isAnimating) return;
  isAnimating = true;

  const img = activeList[currentIndex];
  lbImg.style.opacity = '0';

  setTimeout(() => {
    lbImg.src = img.src;
    lbImg.alt = img.title;

    lbImg.onload = () => {
      lbImg.style.opacity = '1';
      isAnimating = false;
    };

    lbImg.onerror = () => {
      lbImg.style.opacity = '1';
      isAnimating = false;
    };

    lbCaption.textContent = img.title;
    lbCounter.textContent = `${currentIndex + 1} / ${activeList.length}`;
    if (lbCatBadge) lbCatBadge.textContent = img.cat;

  }, 150);
}

// ── Navigation ──
function goNext() {
  currentIndex = (currentIndex + 1) % activeList.length;
  updateLightbox();
}

function goPrev() {
  currentIndex = (currentIndex - 1 + activeList.length) % activeList.length;
  updateLightbox();
}

// ── Button events ──
document.getElementById('lb-prev').addEventListener('click', goPrev);
document.getElementById('lb-next').addEventListener('click', goNext);
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-bg')?.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// ── Keyboard controls ──
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  switch(e.key) {
    case 'ArrowLeft':  goPrev(); break;
    case 'ArrowRight': goNext(); break;
    case 'Escape':     closeLightbox(); break;
  }
});

// ── Touch swipe (mobile) ──
let touchStartX = 0;
let touchEndX   = 0;

lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goNext();
    else          goPrev();
  }
});

// ── Filter buttons ──
document.querySelector('.filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  document.querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cat = btn.dataset.cat;
  const filtered = cat === 'all'
    ? images
    : images.filter(img => img.cat === cat);

  render(filtered);
});

// ── Reset filter ──
function resetFilter() {
  document.querySelectorAll('.filter-btn')
    .forEach(b => b.classList.remove('active'));
  document.querySelector('[data-cat="all"]')
    .classList.add('active');
  render(images);
}

// ── Initial render ──
render(images);